require("system");
var FILE = require("file");
var OS = require("os");

var task = require("jake").task;

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

task("default", ["build", "build-docs"],
	function()
	{
		print("Build Complete : " + system.args);
	}
);

task("build", [],
	function()
	{
		var output_dir = "output";
		
		if(!FILE.exists(output_dir))
		{
			//do we need to make sure this is relative to the build directory?
			FILE.mkdir(output_dir);
		}
		
		//catch errors and fail, cleanup and fail gracefully
		//test with paths that contain spaces
		
		try
		{
			var file_args = [];
			var len = SOURCE_FILES.length;
			for(var i = 0; i < len; i++)
			{
				file_args.push("--js");
				file_args.push(SOURCE_FILES[i]);
			}
			
			var tmp_file = FILE.join(output_dir,"tmp.js");
			var final_file = FILE.join(output_dir, "easel.js");
		
			var cmd = [
				"java", "-jar", GOOGLE_CLOSURE_PATH
			].concat(
					file_args
				).concat(
					["--js_output_file", tmp_file]
				);
		
			OS.system(cmd);
		
			var license_data = FILE.read("license.txt");
			var final_data = FILE.read(tmp_file);
		
			FILE.write(final_file, license_data + final_data);
		
			FILE.remove(tmp_file);
		}
		catch(error)
		{
			print("Build Task Failed : " + error.message);
			OS.exit(1);
		}
		finally
		{
			//cleanup here?
		}
	
		print("Build Task Complete");
	}
);


task("build-docs", [],
	function()
	{
		if(system.args < 3)
		{
			print("USAGE : jake build-docs build_version");
			OS.exit(1);
		}		
		
		var version = system.args[2];
		
		if(!version)
		{
			print("USAGE : jake build-docs build_version");
			OS.exit(1);	
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
		
		OS.system(cmd);
		
		//FILE.remove("tmp");
		
		//print("cd " + working_dir + " && zip -r " + zip_name + " " + doc_dir + " -x *.DS_Store && cd ..");
		OS.system("cd " + OS.enquote(working_dir) + " && zip -r" + zip_name + " " + doc_dir + " -x *.DS_Store");
		
		/*
		OS.system(["cd", working_dir]);
		OS.system([
				"zip",
				"-r",
				zip_name,
				doc_dir,
				"-x", "*.DS_Store"
			]);
		OS.system(["cd", ".."]);		
		*/
		print("build-docs");
	}
);
