#!/usr/bin/env node

var FILE = require("fs");
var PATH = require("path");
var CHILD_PROCESS = require("child_process");
var OS = require("os");

//file system utils
var WRENCH = require("wrench");

//for parsing command line args
var OPTIMIST = require("optimist");



//included in EaselJS repository
var GOOGLE_CLOSURE_PATH = "tools/google-closure/compiler.jar";
var YUI_DOC_PATH = "tools/yuidoc/bin/yuidoc.py";

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
	"../src/easeljs/display/BitmapSequence.js",
	"../src/easeljs/display/Shape.js",
	"../src/easeljs/display/Text.js",
	"../src/easeljs/utils/SpriteSheetUtils.js",
	"../src/easeljs/display/DOMElement.js",
	"../src/easeljs/filters/Filter.js",
	"../src/easeljs/filters/BoxBlurFilter.js",
	"../src/easeljs/filters/ColorFilter.js",
	"../src/easeljs/filters/ColorMatrixFilter.js",
	"../src/easeljs/ui/Touch.js"
];

//directory where generated files are placed
var OUTPUT_DIR = "output";

//tmp directory used when running scripts
var TMP_DIR = "tmp";

//directory that includes YUI Doc templates
var TEMPLATE_DIR = "template";

//project name
var PROJECT_NAME = "EaselJS";

//yui version being used
var YUI_VERSION = 2;

//name of file for zipped docs
var DOC_ZIP_NAME="easeljs_docs.zip";

//name of minified EaselJS file.
var EASEL_LIB_NAME = "easel.js";

var version;
var verbose;

var TASK = {
	ALL:"ALL",
	BUILDDOCS:"BUILDDOCS",
	BUILDSOURCE:"BUILDSOURCE",
	CLEAN:"CLEAN"
};

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

	var task = argv.tasks.toUpperCase();

	if(!taskIsRecognized(task))
	{
		print("Unrecognized task : " + task);
		displayUsage();
		process.exit(1);
	}

	verbose = argv.v != undefined;
	version = argv.version;

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
		buildSourceTask(function(success)
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
	if(PATH.existsSync(TMP_DIR))
	{	
		WRENCH.rmdirSyncRecursive(TMP_DIR);
	}
	
	if(PATH.existsSync("output"))
	{
		WRENCH.rmdirSyncRecursive("output");
	}
}

function buildSourceTask(completeHandler)
{	
	if(!PATH.existsSync(OUTPUT_DIR))
	{
		FILE.mkdirSync(OUTPUT_DIR);
	}

	var file_args = [];
	var len = SOURCE_FILES.length;
	for(var i = 0; i < len; i++)
	{
		file_args.push("--js");
		file_args.push(SOURCE_FILES[i]);
	}
	
	var tmp_file = PATH.join(OUTPUT_DIR,"tmp.js");
	var final_file = PATH.join(OUTPUT_DIR, EASEL_LIB_NAME);

	var cmd = [
		"java", "-jar", GOOGLE_CLOSURE_PATH
	].concat(
			file_args
		).concat(
			["--js_output_file", tmp_file]
		);
		

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

function buildDocsTask(version, completeHandler)
{	
	var parser_in="../src";
	var	parser_out= PATH.join(TMP_DIR , "parser");

	var doc_dir="easeljs_docs";
	
	var generator_out=PATH.join(OUTPUT_DIR, doc_dir);
	
	var cmd = [
		YUI_DOC_PATH,
		parser_in,
		"-p", parser_out,
		"-o", generator_out,
		"-t", TEMPLATE_DIR,
		"-v", version,
		"-Y", YUI_VERSION,
		"-m", PROJECT_NAME,
		"-u", "http://www.easeljs.com"
	];
	
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
				"cd " + OUTPUT_DIR + ";zip -r " + DOC_ZIP_NAME + " " + doc_dir + " -x *.DS_Store",
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
				
					WRENCH.rmdirSyncRecursive(TMP_DIR);
				
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
	print("USAGE : build.js -v -h --tasks=TASKNAME [--version=DOCVERSION]");
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




