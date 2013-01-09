#!/usr/bin/env node
// TODO: add support for recursively checking to see if we are ommiting any files

var FILE = require("fs");
var PATH = require("path");
var CHILD_PROCESS = require("child_process");
var OS = require("os");

//file system utils
var WRENCH = require("wrench");

//for parsing command line args
var OPTIMIST = require("optimist");

/************************************************************
CONFIGURATION
*/

var json = FILE.readFileSync(PATH.resolve("./configMovieClip.json"), "UTF-8");
json = JSON.parse(json);
var config =json.config_easeljs_movieclip;

var SOURCE_FILES = [];
// listing of all source files, with dependencies listed in order:
SOURCE_FILES = config.SOURCE_FILES;

// default name for lib output:
var JS_FILE_NAME = config.JS_FILE_NAME;
// project name:
var PROJECT_NAME = config.PROJECT_NAME;

// url for website or github repo for project:
var PROJECT_URL = config.PROJECT_URL;

// name of directory for docs:
var DOCS_DIR_NAME =  PROJECT_NAME + config.DOCS_DIR_NAME;

// name of file for zipped docs:
var DOCS_FILE_NAME = DOCS_DIR_NAME + config.DOCS_FILE_NAME

// name of directory where generated files are placed
var OUTPUT_DIR_NAME = __dirname + config.OUTPUT_DIR_NAME;

var OUTPUT_DIR_MIN_NAME = __dirname + config.OUTPUT_DIR_MIN_NAME;

// path to directory that includes YUI Doc templates
var TEMPLATE_DIR_PATH = __dirname + config.TEMPLATE_DIR_PATH;

// tmp directory used when running scripts:
var TMP_DIR_NAME = __dirname + config.TMP_DIR_NAME;

// paths to tools:
var GOOGLE_CLOSURE_PATH = PATH.resolve("../"+PATH.normalize(config.GOOGLE_CLOSURE_PATH))

/*
END CONFIGURATION
************************************************************/

OPTIMIST
	.describe("l", "List all available tasks")
	.alias("l", "list")
	.boolean("l")
	.describe("h", "Display usage")
	.alias("h", "help")
	.boolean("h")
	.describe("version", "Build version number (x.x.x) defaults 'NEXT'")
	.string("version")
    .default("version", "NEXT")
	.describe("tasks", "Task to run options: [ALL, BUILDDOCS, BUILDSOURCE, CLEAN]")
	.default("tasks", "ALL")
	.usage("Build Task Manager for "+PROJECT_NAME+"\nUsage\n$0 [-h] [-l] --tasks=TASK [--version=DOC_VERSION]");


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
	if(argv.h || argv.help)
	{
		displayUsage();
		process.exit(0);
	}

	if(argv.l || argv.list)
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

	version = argv.version || "NEXT";
    var type = OS.type().toLowerCase();
	if (type.indexOf("windows") != -1) {
        os = type;
    } else if (type.indexOf("darwin") != -1) {
        os = type;
    }

	var shouldBuildSource = (task == TASK.BUILDSOURCE);

	var shouldBuildDocs = (task == TASK.BUILDDOCS);

	if(task==TASK.CLEAN)
	{
		cleanTask(
			function(success)
			{
				print(setColorText("Clean Task Completed", "green"));
			}
		);
	}

	if(task == TASK.ALL)
	{	
		shouldBuildSource = true;
		shouldBuildDocs = true;
	}
	
	
	
	// DO NOT BUILD DOCS FOR MOVIECLIP, INCLUDED WITH EASELJS.
	shouldBuildDocs = false;



	if(shouldBuildDocs && (version == undefined))
	{
		displayUsage();
		process.exit(0);
	}

	if(shouldBuildSource)
	{
		buildSourceTask(function(success)
		{		
			print(setColorText("\nBuild Source Task Complete", "green"));
			if(shouldBuildDocs)
			{
				buildDocsTask(version,
					function(success)
					{
						print(setColorText("Build Docs Task Complete", "green"));
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
				print(setColorText("Build Docs Task Complete","green"));
			}
		);
	}	
}


/********** TASKS *************/


function cleanTask(completeHandler)
{
	if(FILE.existsSync(TMP_DIR_NAME))
	{	
		WRENCH.rmdirSyncRecursive(TMP_DIR_NAME);
	}
	
	if(FILE.existsSync(OUTPUT_DIR_NAME))
	{
		WRENCH.rmdirSyncRecursive(OUTPUT_DIR_NAME);
	}
}

function buildSourceTask(completeHandler)
{	
	if(!FILE.existsSync(OUTPUT_DIR_NAME))
	{
		FILE.mkdirSync(OUTPUT_DIR_NAME);
	}
	
	js_file_name = js_file_name.split("%VERSION%").join(version);

	var file_args = [];
	var len = SOURCE_FILES.length;
	for(var i = 0; i < len; i++)
	{
		file_args.push("--js");
        
        var dirName = '"'+PATH.resolve(__dirname + SOURCE_FILES[i])+'"';
		var pattern = /[\w.\/% ]+version_movieclip.js/g;
        var result = pattern.test(dirName);
        
        if (result) {
            var versionData = FILE.readFileSync(PATH.resolve(__dirname + SOURCE_FILES[i]), "UTF-8"); 
            pattern = /\/\*version\*\/"([\w.]+)"/g;
            var hasVersionFile = pattern.test(versionData);
            if (hasVersionFile) {
                var updateValues = {date:new Date().toUTCString(), version:version};
                updatedVersionData = replaceMetaData(versionData, updateValues);
                
                if (updatedVersionData.length != 0 || updatedVersionData != null || updatedVersionData != "") { 
                    FILE.writeFileSync(PATH.resolve(__dirname + SOURCE_FILES[i]), updatedVersionData, "UTF-8");
                } else {
                    console.log(setColorText("Error -- updating version_movieclip.js","red"));
                }
                
            }
        }
        
        file_args.push(dirName);
	}
	
	var tmp_file = '"'+PATH.join(OUTPUT_DIR_NAME,"tmp.js")+'"';
	var final_file = PATH.join(OUTPUT_DIR_NAME, js_file_name);
	
	GOOGLE_CLOSURE_PATH = '"'+GOOGLE_CLOSURE_PATH+'"';

	
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

		    if (error !== null)
			{
				print(setColorText("Error Running Google Closure : " + error, "red"));
				exitWithFailure();
		    }
		
			var license_data = FILE.readFileSync(__dirname + "/license.txt", "UTF-8");
			var path = tmp_file.substring(1, tmp_file.length-1);
			var final_data = FILE.readFileSync(path, "UTF-8");
				
			FILE.writeFileSync(final_file, license_data + final_data, "UTF-8");

			FILE.unlinkSync(path);
			
			completeHandler(true);
		}
	);
}

function buildDocsTask(version, completeHandler)
{	
	var parser_in="../src";
	var	parser_out= PATH.join(TMP_DIR_NAME , "parser");

	var doc_dir=DOCS_DIR_NAME.split("%VERSION%").join(version);
	var doc_file=DOCS_FILE_NAME.split("%VERSION%").join(version);
	
	var generator_out=PATH.join(OUTPUT_DIR_NAME, doc_dir);

	var zipCommand = "";
    var yuidocCommand = ["yuidoc -q --themedir ./createjsTheme --outdir "+"./output/"+doc_dir+" --project-version", version];
    var type = OS.type().toLowerCase();
    if(type.indexOf("windows") != -1){  
		//If 7zip.exe is currently with the /build directory.
		zipCommand = "..\\tools\\7-Zip\\7z a "+"output\\"+doc_file+" "+"output\\"+ doc_dir +" > %temp%\\7z-log.txt";
	} else {
		zipCommand = "cd ./output;zip -rq " + doc_file + " " + ""+doc_dir+"   " + "*.DS_Store";
	}
    
    CHILD_PROCESS.exec(
		yuidocCommand.join(" "),
		function(error, stdout, stderr)
		{

		    if (error !== null)
			{
				print(setColorText("Error Running YUI DOC : " + error, "red"));
				exitWithFailure();
		    }
		
			CHILD_PROCESS.exec(
				zipCommand,
				function(error, stdout, stderr)
				{

				    if (error !== null)
					{
						print(setColorText("Error ZIPPING Docs :" + error, "red"));
						exitWithFailure();
				    }
					completeHandler(true);				
				});		
		});
}

/*************** some util methods ******************/

function setColorText(str, color) {
    var type = color.toLowerCase();
    var colorStr = ""
    switch(type) {
        case "red":
            colorStr = "\033[31m"+str+"\033[0m";
            break;
        case "green":
            colorStr = "\033[32m"+str+"\033[0m";
            break;
        case "blue":
            colorStr = "\033[34m"+str+"\033[0m"
            break;
        case "magenta":
            colorStr = "\033[35m"+str+"\033[0m"
            break;
        case "white":
            colorStr = "\033[37m"+str+"\033[0m"
            break;
        case "cyan":
            colorStr = "\033[36m"+str+"\033[0m";
            break;
        case "yellow":
            colorStr = "\033[33m"+str+"\033[0m";
            break;
        default:
            colorStr = str;
    }
    
    return colorStr;
}

function replaceMetaData(data, values) {
    var finalResult = "";
    var newData = data;
    for(var n in values) {
        var pattern = new RegExp("(\/\\*"+n+"\\*\/\")(.*)(\";)", "i");
        var result = pattern.test(data);
        if (result) {
            finalResult = newData.replace(pattern, "$1"+values[n]+"$3");
            newData = finalResult;
        } else {
            console.log(setColorText("Error -- Unable to resolve value:"+ pattern, "red"));
        }
    }
    return finalResult;
}

function exitWithFailure()
{
	process.exit(1);
}

function displayUsage()
{
	print(setColorText(OPTIMIST.help(), "yellow"));
}

function displayTasks()
{
	var out = "Available tasks: ";
	
	for(var _t in TASK)
	{
		out += TASK[_t] +", "
	}
	
	print(setColorText(out.slice(0, -2), "Cyan"));
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







