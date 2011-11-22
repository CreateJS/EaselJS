#!/usr/bin/env node

var FILE = require("fs");
var PATH = require("path");
var CHILD_PROCESS = require("child_process");
var OS = require("os");
var WRENCH = require("wrench");
var argv = require("optimist").argv;

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

function print(msg)
{
	console.log(msg);
}

function cleanTask(completeHandler)
{
	if(PATH.existsSync("tmp"))
	{	
		WRENCH.rmdirSyncRecursive("tmp");
	}
	
	if(PATH.existsSync("output"))
	{
		WRENCH.rmdirSyncRecursive("output");
	}
}

function buildSourceTask(completeHandler)
{
	var output_dir = "output";
	
	if(!PATH.existsSync(output_dir))
	{
		//do we need to make sure this is relative to the build directory?
		FILE.mkdirSync(output_dir);
	}
	
	//catch errors and fail, cleanup and fail gracefully
	//test with paths that contain spaces
	
	//try
	var file_args = [];
	var len = SOURCE_FILES.length;
	for(var i = 0; i < len; i++)
	{
		file_args.push("--js");
		file_args.push(SOURCE_FILES[i]);
	}
	
	var tmp_file = PATH.join(output_dir,"tmp.js");
	var final_file = PATH.join(output_dir, "easel.js");

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
			
			print("Build Task Complete");
		}
	);
}


function exitWithFailure()
{
	process.exit(1);
}

function buildDocsTask(version, completeHandler)
{	
	var parser_in="../src";

	var	parser_out="tmp/parser";

	var working_dir="output";
	var doc_dir="easeljs_docs";
	var zip_name="easeljs_docs.zip";
	
	var generator_out=PATH.join(working_dir, doc_dir);
	var template = "template";
	
	var yuiversion = 2;
	var projectname = "EaselJS";
	
	var cmd = [
		YUI_DOC_PATH,
		parser_in,
		"-p", parser_out,
		"-o", generator_out,
		"-t", template,
		"-v", version,
		"-Y", yuiversion,
		"-m", projectname,
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
				"cd " + PATH.normalize(working_dir) + ";zip -r " + zip_name + " " + doc_dir + " -x *.DS_Store",
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
				
					WRENCH.rmdirSyncRecursive("tmp");
				
					completeHandler(true);				
				});		
		
		
		});	
}


function displayUsage()
{
	print("USAGE : build.js -v -h --tasks=TASKNAME [--version=DOCVERSION]");
}

function taskIsRecognized(task)
{
	return TASK.hasOwnProperty(task);
}

if(argv.h)
{
	displayUsage();
	process.exit(0);
}


var TASK = {
	ALL:"ALL",
	BUILDDOCS:"BUILDDOCS",
	BUILDSOURCE:"BUILDSOURCE",
	CLEAN:"CLEAN",
};

var verbose = argv.v != undefined;

var task = argv.tasks.toUpperCase();

if(!taskIsRecognized(task))
{
	print("Unrecognized task : " + task);
	displayUsage();
	process.exit(1);
}


var version = argv.version;

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
		print("Build Source Complete");
		if(shouldBuildDocs)
		{
			buildDocsTask(version,
				function(success)
				{
					print("Build Docs Complete");
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
			print("Build Docs Complete");
		}
	);
}







