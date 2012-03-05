#!/usr/bin/env node

/************************************************************
CONFIGURATION
*/
// listing of all source files, with dependencies listed in order:
var SOURCE_FILES = [
	"../src/easeljs/utils/UID.js",
	"../src/easeljs/utils/Ticker.js",
	"../src/easeljs/events/MouseEvent.js",
	"../src/easeljs/geom/Matrix2D.js",
	"../src/easeljs/geom/Point.js",
	"../src/easeljs/geom/Rectangle.js",
	"../src/easeljs/display/Shadow.js",
	"../src/easeljs/display/SpriteSheet.js",
	"../src/easeljs/display/Graphics.js",
	"../src/easeljs/display/DisplayObject.js",
	"../src/easeljs/display/Container.js",
	"../src/easeljs/display/Stage.js",
	"../src/easeljs/display/Bitmap.js",
	"../src/easeljs/display/BitmapAnimation.js",
	"../src/easeljs/display/Shape.js",
	"../src/easeljs/display/Text.js",
	"../src/easeljs/utils/SpriteSheetUtils.js",
	"../src/easeljs/display/DOMElement.js",
	"../src/easeljs/filters/Filter.js",
	//"../src/easeljs/filters/BoxBlurFilter.js",
	//"../src/easeljs/filters/ColorFilter.js",
	//"../src/easeljs/filters/ColorMatrixFilter.js",
	"../src/easeljs/ui/Touch.js"
];

// default name for lib output:
var JS_FILE_NAME = "easel.js";

// project name:
var PROJECT_NAME = "EaselJS";

// url for website or github repo for project:
var PROJECT_URL = "http://easeljs.com/";


// name of directory for docs:
var DOCS_DIR_NAME = PROJECT_NAME+"_docs";

// name of file for zipped docs:
var DOCS_FILE_NAME = DOCS_DIR_NAME+".zip";

// name of directory where generated files are placed
var OUTPUT_DIR_NAME = "output";


// path to directory that includes YUI Doc templates
var TEMPLATE_DIR_PATH = "template";

// tmp directory used when running scripts:
var TMP_DIR_NAME = "tmp";

// paths to tools:
var GOOGLE_CLOSURE_PATH = "tools/google-closure/compiler.jar";
var YUI_DOC_PATH = "tools/yuidoc/bin/yuidoc.py";

// yui version being used
var YUI_VERSION = 2;

/*
END CONFIGURATION
************************************************************/


// TODO: add support for recursively checking to see if we are ommiting any files


var FILE = require("fs");
var PATH = require("path");
var CHILD_PROCESS = require("child_process");
var OS = require("os");

//file system utils
var WRENCH = require("wrench");

//for parsing command line args
var OPTIMIST = require("optimist");

OPTIMIST.describe("v", "Enable verbose output")
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

	.describe("tasks", "Task to run")
	.default("tasks", "all")

	.describe("s","Include specified file in compilation. Option can be specified multiple times for multiple files.")
	.alias("s", "source")

	.describe("o", "Name of minified JavaScript file.")
	.alias("o", "output")
	.default("o", JS_FILE_NAME)

	.describe("n", "No minification.")
	.alias("n", "no-minification")
	.boolean("n")

	.usage("Build Task Manager for "+PROJECT_NAME+"\nUsage\n$0 [-v] [-h] [-l] --tasks=TASK [--version=DOC_VERSION] [--source=FILE] [--output=FILENAME.js]");



//name of minified js file.
var js_file_name = JS_FILE_NAME;

var version;
var verbose;

var TASK = {
	ALL:"ALL",
	BUILDDOCS:"BUILDDOCS",
	BUILDSOURCE:"BUILDSOURCE",
	CLEAN:"CLEAN"
};

var extraSourceFiles;

//main entry point for script. Takes optimist argv object which
//contains command line arguments.
//This function is called at the bottom of the script
function main(argv)
{
	if(argv.h)
	{
		displayUsage();
		process.exit(0);
	}

	if(argv.l)
	{
		displayTasks();
		process.exit(0);
	}

	//default doesn't seem to be working for OPTIMIST right now
	//if task is not specified, we default to ALL
	var task = (!argv.tasks)?"ALL":argv.tasks.toUpperCase();

	if(!taskIsRecognized(task))
	{
		print("Unrecognized task : " + task);
		displayUsage();
		process.exit(1);
	}

	verbose = argv.v != undefined;
	version = argv.version;

	extraSourceFiles = argv.s;
	
	if(argv.o)
	{
		js_file_name = argv.o;
	}

	var shouldBuildSource = (task == TASK.BUILDSOURCE);
	var shouldBuildDocs = (task == TASK.BUILDDOCS);

	if(task==TASK.CLEAN)
	{
		cleanTask(
			function(success)
			{
				print("Clean Task Completed");
			}
		);
	}

  console.log("task", task)

	if(task == TASK.ALL)
	{	
		shouldBuildSource = true;
		shouldBuildDocs = true;
	}

	if(shouldBuildDocs && (version == undefined))
	{
		displayUsage();
		process.exit(0);
	}

	if(shouldBuildSource)
	{
    if(argv.n)
    {
      sourceBuilder = buildSourceWithoutMinification
    }
    else
    {
      sourceBuilder = buildSourceTask
    }

		sourceBuilder(function(success)
		{		
			print("Build Source Task Complete");
			if(shouldBuildDocs)
			{
				buildDocsTask(version,
					function(success)
					{
						print("Build Docs Task Complete");
					}
				);
			}

		});
	}

	if(shouldBuildDocs && task != "ALL")
	{
		buildDocsTask(version,
			function(success)
			{
				print("Build Docs Task Complete");
			}
		);
	}	
}


/********** TASKS *************/


function cleanTask(completeHandler)
{
	if(PATH.existsSync(TMP_DIR_NAME))
	{	
		WRENCH.rmdirSyncRecursive(TMP_DIR_NAME);
	}
	
	if(PATH.existsSync(OUTPUT_DIR_NAME))
	{
		WRENCH.rmdirSyncRecursive(OUTPUT_DIR_NAME);
	}
}

function buildSourceTask(completeHandler)
{	
	if(!PATH.existsSync(OUTPUT_DIR_NAME))
	{
		FILE.mkdirSync(OUTPUT_DIR_NAME);
	}

	var file_args = [];
	var len = SOURCE_FILES.length;
	for(var i = 0; i < len; i++)
	{
		file_args.push("--js");
		file_args.push(SOURCE_FILES[i]);
	}
	
	if(extraSourceFiles)
	{
		len = extraSourceFiles.length;
		for(var i = 0; i < len; i++)
		{
			file_args.push("--js");
			file_args.push(extraSourceFiles[i]);
		}
	}
	
	
	var tmp_file = PATH.join(OUTPUT_DIR_NAME,"tmp.js");
	var final_file = PATH.join(OUTPUT_DIR_NAME, js_file_name);

	var cmd = [
		"java", "-jar", GOOGLE_CLOSURE_PATH
	].concat(
			file_args
		).concat(
			["--js_output_file", tmp_file]
		);
		
	if(verbose)
	{
		print(cmd.join(" "));
	}

	CHILD_PROCESS.exec(
		cmd.join(" "),
		function(error, stdout, stderr)
		{
			if(verbose)
			{
				if(stdout)
				{
					print(stdout);
				}
			
				if(stderr)
				{
					print(stderr);
				}
			}

		    if (error !== null)
			{
				print("Error Running Google Closure : " + error);
				exitWithFailure();
		    }
		
			var license_data = FILE.readFileSync("license.txt", "UTF-8");
			var final_data = FILE.readFileSync(tmp_file, "UTF-8");

			FILE.writeFileSync(final_file, license_data + final_data, "UTF-8");

			FILE.unlinkSync(tmp_file);
			
			completeHandler(true);
		}
	);
}


function buildSourceWithoutMinification(completeHandler)
{
  if(!PATH.existsSync(OUTPUT_DIR_NAME))
	{
		FILE.mkdirSync(OUTPUT_DIR_NAME);
	}

	var file = SOURCE_FILES.slice();
	
	if(extraSourceFiles)
	{
    files.concat(extraSourceFiles)
	}
	
	
  var license_data = FILE.readFileSync("license.txt", "utf8");
	var final_file = PATH.join(OUTPUT_DIR_NAME, js_file_name);

  console.log("final", final_file);


  FILE.open(final_file, 'w', function(err, fd) {
    pos = 0
    pos += FILE.writeSync(fd, license_data, pos)

    for( var i=0, l=SOURCE_FILES.length; i<l; i++ ) {
      fileData = FILE.readFileSync(SOURCE_FILES[i], 'utf8');
      pos += FILE.writeSync(fd, fileData, pos, 'utf8');
    }

    FILE.close(fd, function() {
      completeHandler(true);
    });
  })


}

function buildDocsTask(version, completeHandler)
{	
	var parser_in="../src";
	var	parser_out= PATH.join(TMP_DIR_NAME , "parser");

	var doc_dir=DOCS_DIR_NAME;
	
	var generator_out=PATH.join(OUTPUT_DIR_NAME, doc_dir);
	
	var cmd = [
		"python", YUI_DOC_PATH,
		parser_in,
		"-p", parser_out,
		"-o", generator_out,
		"-t", TEMPLATE_DIR_PATH,
		"-v", version,
		"-Y", YUI_VERSION,
		"-m", PROJECT_NAME,
		"-u", PROJECT_URL
	];
	
	if(verbose)
	{
		print(cmd.join(" "));
	}	
	
	CHILD_PROCESS.exec(
		cmd.join(" "),
		function(error, stdout, stderr)
		{
			if(verbose)
			{
				if(stdout)
				{
					print(stdout);
				}
			
				if(stderr)
				{
					print(stderr);
				}
			}

		    if (error !== null)
			{
				print("Error Running YUI DOC : " + error);
				exitWithFailure();
		    }
		
			CHILD_PROCESS.exec(
				"cd " + OUTPUT_DIR_NAME + ";zip -r " + DOCS_FILE_NAME + " " + doc_dir + " -x *.DS_Store",
				function(error, stdout, stderr)
				{
					if(verbose)
					{
						if(stdout)
						{
							print(stdout);
						}

						if(stderr)
						{
							print(stderr);
						}
					}

				    if (error !== null)
					{
						print("Error ZIPPING Docs : " + error);
						exitWithFailure();
				    }
				
					WRENCH.rmdirSyncRecursive(TMP_DIR_NAME);
				
					completeHandler(true);				
				});		
		
		
		});	
}

/*************** some util methods ******************/

function exitWithFailure()
{
	process.exit(1);
}

function displayUsage()
{
	print(OPTIMIST.help());
}

function displayTasks()
{
	var out = "Available tasks: ";
	
	for(var _t in TASK)
	{
		out += TASK[_t] +", "
	}
	
	print(out.slice(0, -2));
}

function taskIsRecognized(task)
{
	return TASK.hasOwnProperty(task);
}

function print(msg)
{
	console.log(msg);
}

//call the main script entry point
main(OPTIMIST.argv);





