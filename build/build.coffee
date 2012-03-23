SOURCE_FILES = """
  utils/UID.js
  utils/Ticker.js
  events/MouseEvent.js
  geom/Matrix2D.js
  geom/Point.js
  geom/Rectangle.js
  display/Shadow.js
  display/SpriteSheet.js
  display/Graphics.js
  display/DisplayObject.js
  display/Container.js
  display/Stage.js
  display/Bitmap.js
  display/BitmapAnimation.js
  display/Shape.js
  display/Text.js
  utils/SpriteSheetUtils.js
  display/DOMElement.js
  filters/Filter.js
  ui/Touch.js
"""


SOURCE_FILES = for file in SOURCE_FILES.split(/\s+/)
                 "../src/easeljs/#{ file }"


JS_FILE_NAME        = "easel.js"
PROJECT_NAME        = "EaselJS"
PROJECT_URL         = "http://easeljs.com/"
DOCS_DIR_NAME       = PROJECT_NAME + "_docs"
DOCS_FILE_NAME      = DOCS_DIR_NAME + ".zip"
OUTPUT_DIR_NAME     = "output"
TEMPLATE_DIR_PATH   = "template"
TMP_DIR_NAME        = "tmp"

GOOGLE_CLOSURE_PATH = "tools/google-closure/compiler.jar"

YUI_DOC_PATH        = "tools/yuidoc/bin/yuidoc.py"
YUI_VERSION         = 2


knownTasks = "all build_source build_source_nomin build_docs clean".split(/\s+/)


fs           = require "fs"
path         = require "path"
childProcess = require "child_process"
os           = require "os"
wrench       = require "wrench"
optimist     = require "optimist"
_            = require "underscore"
{waterfall}  = require "async"


js_file_name     = JS_FILE_NAME
version          = undefined
verbose          = undefined
extraSourceFiles = undefined


optimist.describe("v", "Enable verbose output")
  .alias("v", "verbose")
  .boolean("v")

  .describe("l", "List all available tasks")
  .alias("l", "list")
  .boolean("l")

  .describe("h", "Display usage")
  .alias("h", "help")
  .boolean("h")

  .describe("version", "Document build version number")
  .string("version")

  .describe("s","Include specified file in compilation. Option can be specified multiple times for multiple files.")
  .alias("s", "source")

  .describe("o", "Name of minified JavaScript file.")
  .alias("o", "output")
  .default("o", JS_FILE_NAME)

  .usage("Build Task Manager for "+PROJECT_NAME+"\nUsage\n$0 [-v] [-h] [-l] [--version=DOC_VERSION] [--source=FILE] [--output=FILENAME.js] [TASK1] [TASK2]...")


main = (argv) ->
  if argv.h
    displayUsage()


  if argv.l
    displayTasks()


  tasks = _.clone argv._


  # no tasks selected: default to building source and docs
  if tasks.length == 0
    tasks.push 'build_source'
    tasks.push 'build_docs'


  # ensure specified tasks exist
  for task in tasks
    unless _.include knownTasks, task
      console.error "Unrecognized task : #{ task }"
      displayUsage(1)


  verbose = argv.v
  version = argv.version

  extraSourceFiles = argv.s

  js_file_name = argv.o  if argv.o


  # map from task names to functions
  taskFunctions = (taskMap[task] for task in tasks)

  # execute the tasks
  waterfall taskFunctions,
    (err, result) ->
      taskList = tasks.join(', ')
      if err
        console.error "failed running tasks #{ taskList }"
        console.error err
        displayUsage(1)
      else
        console.log "finished tasks #{ taskList }"


cleanTask = (cb) ->
  wrench.rmdirSyncRecursive TMP_DIR_NAME    if path.existsSync(TMP_DIR_NAME)
  wrench.rmdirSyncRecursive OUTPUT_DIR_NAME if path.existsSync(OUTPUT_DIR_NAME)
  cb(null)


buildSourceTask = (cb) ->
  fs.mkdirSync OUTPUT_DIR_NAME  unless path.existsSync(OUTPUT_DIR_NAME)
  file_args = []

  for file in SOURCE_FILES
    file_args.push "--js"
    file_args.push file

  if extraSourceFiles
    for file in extraSourceFiles
      file_args.push "--js"
      file_args.push file


  tmp_file = path.join(OUTPUT_DIR_NAME, "tmp.js")
  final_file = path.join(OUTPUT_DIR_NAME, js_file_name)

  cmd = [ "java", "-jar", GOOGLE_CLOSURE_PATH ].concat(file_args).concat([ "--js_output_file", tmp_file ])

  console.log cmd.join(" ")  if verbose


  childProcess.exec cmd.join(" "), (error, stdout, stderr) ->
    if verbose
      console.log stdout  if stdout
      console.log stderr  if stderr

    if error
      return cb("Error Running Google Closure : #{ error }")

    license_data = fs.readFileSync("license.txt", "UTF-8")
    final_data = fs.readFileSync(tmp_file, "UTF-8")

    fs.writeFileSync final_file, license_data + final_data, "utf8"
    fs.unlinkSync tmp_file

    cb(null)


buildSourceWithoutMinificationTask = (cb) ->
  fs.mkdirSync OUTPUT_DIR_NAME unless path.existsSync(OUTPUT_DIR_NAME)

  files = SOURCE_FILES.slice()
  files.concat extraSourceFiles  if extraSourceFiles

  license_data = fs.readFileSync("license.txt", "utf8")
  final_file = path.join(OUTPUT_DIR_NAME, js_file_name)

  fs.open final_file, "w", (err, fd) ->
    pos = 0
    pos += fs.writeSync(fd, license_data, pos)

    for file in SOURCE_FILES
      fileData = fs.readFileSync(file, "utf8")
      pos += fs.writeSync(fd, fileData, pos, "utf8")

    fs.close fd, ->
      cb(null)


buildDocsTask = (cb) ->
  unless version
    return cb "no version specified"

  parser_in = "../src"
  parser_out = path.join(TMP_DIR_NAME, "parser")
  doc_dir = DOCS_DIR_NAME
  generator_out = path.join(OUTPUT_DIR_NAME, doc_dir)


  cmd = [ "python", YUI_DOC_PATH, parser_in, "-p", parser_out, "-o", generator_out, "-t", TEMPLATE_DIR_PATH, "-v", version, "-Y", YUI_VERSION, "-m", PROJECT_NAME, "-u", PROJECT_URL ]

  console.log cmd.join(" ") if verbose

  childProcess.exec cmd.join(" "), (error, stdout, stderr) ->
    if verbose
      console.log stdout  if stdout
      console.log stderr  if stderr

    if error
      return cb "Error Running YUI DOC : " + error

    childProcess.exec "cd " + OUTPUT_DIR_NAME + ";zip -r " + DOCS_FILE_NAME + " " + doc_dir + " -x *.DS_Store", (error, stdout, stderr) ->
      if verbose
        console.log stdout  if stdout
        console.log stderr  if stderr

      if error
        return cb "Error ZIPPING Docs : " + error

      wrench.rmdirSyncRecursive TMP_DIR_NAME

      cb null


displayUsage = (code=0) ->
  console.log optimist.help()
  process.exit code


displayTasks = ->
  console.log "Available tasks: #{ knownTasks.join ', ' }"
  process.exit 0


taskMap =
  build_source: buildSourceTask
  build_source_nomin: buildSourceWithoutMinificationTask
  build_docs: buildDocsTask
  clean: cleanTask





main optimist.argv
