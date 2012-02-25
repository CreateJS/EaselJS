#!/usr/bin/env node
(function() {
  var DOCS_DIR_NAME, DOCS_FILE_NAME, GOOGLE_CLOSURE_PATH, JS_FILE_NAME, OUTPUT_DIR_NAME, PROJECT_NAME, PROJECT_URL, SOURCE_FILES, TEMPLATE_DIR_PATH, TMP_DIR_NAME, YUI_DOC_PATH, YUI_VERSION, buildDocsTask, buildSourceTask, buildSourceWithoutMinificationTask, childProcess, cleanTask, displayTasks, displayUsage, extraSourceFiles, file, fs, js_file_name, knownTasks, main, optimist, os, path, taskMap, verbose, version, waterfall, wrench, _;

  SOURCE_FILES = "utils/UID.js\nutils/Ticker.js\nevents/MouseEvent.js\ngeom/Matrix2D.js\ngeom/Point.js\ngeom/Rectangle.js\ndisplay/Shadow.js\ndisplay/SpriteSheet.js\ndisplay/Graphics.js\ndisplay/DisplayObject.js\ndisplay/Container.js\ndisplay/Stage.js\ndisplay/Bitmap.js\ndisplay/BitmapAnimation.js\ndisplay/Shape.js\ndisplay/Text.js\nutils/SpriteSheetUtils.js\ndisplay/DOMElement.js\nfilters/Filter.js\nui/Touch.js";

  SOURCE_FILES = (function() {
    var _i, _len, _ref, _results;
    _ref = SOURCE_FILES.split(/\s+/);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      _results.push("../src/easeljs/" + file);
    }
    return _results;
  })();

  JS_FILE_NAME = "easel.js";

  PROJECT_NAME = "EaselJS";

  PROJECT_URL = "http://easeljs.com/";

  DOCS_DIR_NAME = PROJECT_NAME + "_docs";

  DOCS_FILE_NAME = DOCS_DIR_NAME + ".zip";

  OUTPUT_DIR_NAME = "output";

  TEMPLATE_DIR_PATH = "template";

  TMP_DIR_NAME = "tmp";

  GOOGLE_CLOSURE_PATH = "tools/google-closure/compiler.jar";

  YUI_DOC_PATH = "tools/yuidoc/bin/yuidoc.py";

  YUI_VERSION = 2;

  knownTasks = "all build_source build_source_nomin build_docs clean".split(/\s+/);

  fs = require("fs");

  path = require("path");

  childProcess = require("child_process");

  os = require("os");

  wrench = require("wrench");

  optimist = require("optimist");

  _ = require("underscore");

  waterfall = require("async").waterfall;

  js_file_name = JS_FILE_NAME;

  version = void 0;

  verbose = void 0;

  extraSourceFiles = void 0;

  optimist.describe("v", "Enable verbose output").alias("v", "verbose").boolean("v").describe("l", "List all available tasks").alias("l", "list").boolean("l").describe("h", "Display usage").alias("h", "help").boolean("h").describe("version", "Document build version number").string("version").describe("s", "Include specified file in compilation. Option can be specified multiple times for multiple files.").alias("s", "source").describe("o", "Name of minified JavaScript file.").alias("o", "output")["default"]("o", JS_FILE_NAME).usage("Build Task Manager for " + PROJECT_NAME + "\nUsage\n$0 [-v] [-h] [-l] [--version=DOC_VERSION] [--source=FILE] [--output=FILENAME.js] [TASK1] [TASK2]...");

  main = function(argv) {
    var task, taskFunctions, tasks, _i, _len;
    if (argv.h) displayUsage();
    if (argv.l) displayTasks();
    tasks = _.clone(argv._);
    if (tasks.length === 0) {
      tasks.push('build_source');
      tasks.push('build_docs');
    }
    for (_i = 0, _len = tasks.length; _i < _len; _i++) {
      task = tasks[_i];
      if (!_.include(knownTasks, task)) {
        console.error("Unrecognized task : " + task);
        displayUsage(1);
      }
    }
    verbose = argv.v;
    version = argv.version;
    extraSourceFiles = argv.s;
    if (argv.o) js_file_name = argv.o;
    taskFunctions = (function() {
      var _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = tasks.length; _j < _len2; _j++) {
        task = tasks[_j];
        _results.push(taskMap[task]);
      }
      return _results;
    })();
    return waterfall(taskFunctions, function(err, result) {
      var taskList;
      taskList = tasks.join(', ');
      if (err) {
        console.error("failed running tasks " + taskList);
        console.error(err);
        return displayUsage(1);
      } else {
        return console.log("finished tasks " + taskList);
      }
    });
  };

  cleanTask = function(cb) {
    if (path.existsSync(TMP_DIR_NAME)) wrench.rmdirSyncRecursive(TMP_DIR_NAME);
    if (path.existsSync(OUTPUT_DIR_NAME)) {
      wrench.rmdirSyncRecursive(OUTPUT_DIR_NAME);
    }
    return cb(null);
  };

  buildSourceTask = function(cb) {
    var cmd, file, file_args, final_file, tmp_file, _i, _j, _len, _len2;
    if (!path.existsSync(OUTPUT_DIR_NAME)) fs.mkdirSync(OUTPUT_DIR_NAME);
    file_args = [];
    for (_i = 0, _len = SOURCE_FILES.length; _i < _len; _i++) {
      file = SOURCE_FILES[_i];
      file_args.push("--js");
      file_args.push(file);
    }
    if (extraSourceFiles) {
      for (_j = 0, _len2 = extraSourceFiles.length; _j < _len2; _j++) {
        file = extraSourceFiles[_j];
        file_args.push("--js");
        file_args.push(file);
      }
    }
    tmp_file = path.join(OUTPUT_DIR_NAME, "tmp.js");
    final_file = path.join(OUTPUT_DIR_NAME, js_file_name);
    cmd = ["java", "-jar", GOOGLE_CLOSURE_PATH].concat(file_args).concat(["--js_output_file", tmp_file]);
    if (verbose) console.log(cmd.join(" "));
    return childProcess.exec(cmd.join(" "), function(error, stdout, stderr) {
      var final_data, license_data;
      if (verbose) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
      }
      if (error) return cb("Error Running Google Closure : " + error);
      license_data = fs.readFileSync("license.txt", "UTF-8");
      final_data = fs.readFileSync(tmp_file, "UTF-8");
      fs.writeFileSync(final_file, license_data + final_data, "utf8");
      fs.unlinkSync(tmp_file);
      return cb(null);
    });
  };

  buildSourceWithoutMinificationTask = function(cb) {
    var files, final_file, license_data;
    if (!path.existsSync(OUTPUT_DIR_NAME)) fs.mkdirSync(OUTPUT_DIR_NAME);
    files = SOURCE_FILES.slice();
    if (extraSourceFiles) files.concat(extraSourceFiles);
    license_data = fs.readFileSync("license.txt", "utf8");
    final_file = path.join(OUTPUT_DIR_NAME, js_file_name);
    return fs.open(final_file, "w", function(err, fd) {
      var file, fileData, pos, _i, _len;
      pos = 0;
      pos += fs.writeSync(fd, license_data, pos);
      for (_i = 0, _len = SOURCE_FILES.length; _i < _len; _i++) {
        file = SOURCE_FILES[_i];
        fileData = fs.readFileSync(file, "utf8");
        pos += fs.writeSync(fd, fileData, pos, "utf8");
      }
      return fs.close(fd, function() {
        return cb(null);
      });
    });
  };

  buildDocsTask = function(cb) {
    var cmd, doc_dir, generator_out, parser_in, parser_out;
    if (!version) return cb("no version specified");
    parser_in = "../src";
    parser_out = path.join(TMP_DIR_NAME, "parser");
    doc_dir = DOCS_DIR_NAME;
    generator_out = path.join(OUTPUT_DIR_NAME, doc_dir);
    cmd = ["python", YUI_DOC_PATH, parser_in, "-p", parser_out, "-o", generator_out, "-t", TEMPLATE_DIR_PATH, "-v", version, "-Y", YUI_VERSION, "-m", PROJECT_NAME, "-u", PROJECT_URL];
    if (verbose) console.log(cmd.join(" "));
    return childProcess.exec(cmd.join(" "), function(error, stdout, stderr) {
      if (verbose) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
      }
      if (error) return cb("Error Running YUI DOC : " + error);
      return childProcess.exec("cd " + OUTPUT_DIR_NAME + ";zip -r " + DOCS_FILE_NAME + " " + doc_dir + " -x *.DS_Store", function(error, stdout, stderr) {
        if (verbose) {
          if (stdout) console.log(stdout);
          if (stderr) console.log(stderr);
        }
        if (error) return cb("Error ZIPPING Docs : " + error);
        wrench.rmdirSyncRecursive(TMP_DIR_NAME);
        return cb(null);
      });
    });
  };

  displayUsage = function(code) {
    if (code == null) code = 0;
    console.log(optimist.help());
    return process.exit(code);
  };

  displayTasks = function() {
    console.log("Available tasks: " + (knownTasks.join(', ')));
    return process.exit(0);
  };

  taskMap = {
    build_source: buildSourceTask,
    build_source_nomin: buildSourceWithoutMinificationTask,
    build_docs: buildDocsTask,
    clean: cleanTask
  };

  main(optimist.argv);

}).call(this);
