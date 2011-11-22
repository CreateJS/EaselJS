require("sys");
var FILE = require("fs");
var PATH = require("path");
var CHILD_PROCESS = require("child_process");

var OS = require("os");

//var task = require("jake").task;

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

desc("Default task");
task("default", ["build", "build-docs"],
	function(params)
	{
		//print("Build Complete : " + sys.args);
	}
);

desc("Build task");
task("build", [],
	function(verbose)
	{
		var isVerbose = (verbose == "true")
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
				if(isVerbose)
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
				
				print("Build Task Complete");
			}
		);
	
		
	}
);

function exitWithFailure()
{
	process.exit(1);
}

desc("Doc Build task");
task("build-docs", [],
	function(params)
	{
		print("build docs");
		return;
		if(sys.args < 3)
		{
			print("USAGE : jake build-docs build_version");
			//OS.exit(1);
		}		
		
		//var version = sys.args[2];
		var version = 5;
		
		if(!version)
		{
			print("USAGE : jake build-docs build_version");
			//OS.exit(1);	
		}
		
		var parser_in="../src";

		var	parser_out="tmp/parser";

		var working_dir="output";
		var doc_dir="easeljs_docs";
		var zip_name="easeljs_docs.zip";
		
		var generator_out=FILE.join(working_dir, doc_dir);
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
		
		OS.sys(cmd);
		
		OS.sys("cd " + OS.enquote(working_dir) + ";zip -r " + zip_name + " " + doc_dir + " -x *.DS_Store");
		
		
		//Need to make this a recursive function that goes through and cleans the directory
		//tree
		var files = FILE.list("/Users/mesh/src/EaselJS/build/tmp/parser/");
		var len = files.length;
		for(var i = 0; i < len; i++)
		{
			FILE.remove(FILE.join("/Users/mesh/src/EaselJS/build/tmp/parser/", files[i]));
		}
		
		FILE.rmdir("/Users/mesh/src/EaselJS/build/tmp/parser/");
		
		
		var files = FILE.list("/Users/mesh/src/EaselJS/build/tmp/");
		var len = files.length;
		for(var i = 0; i < len; i++)
		{
			FILE.remove(FILE.join("/Users/mesh/src/EaselJS/build/tmp/", files[i]));
		}		
		
		FILE.rmdir("/Users/mesh/src/EaselJS/build/tmp/");
		
		print("build-docs");
	}
);

