require("system");
var FILE = require("file");
var OS = require("os");

var task = require("jake").task;


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
		var compiler_path = system.args[2];
		var output_dir = "output";

		if(!compiler_path)
		{
			//usage
			print("USAGE : jake build PATH_TO_COMPILER.JAR");
			OS.exit(1);
		}
		
		if(!FILE.exists(compiler_path))
		{
			print("ERROR : could not locate compiler.jar : " + compiler_path );
			OS.exit(1);
		}
		
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
				"java", "-jar", compiler_path
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
		print("build-docs");
	}
);
