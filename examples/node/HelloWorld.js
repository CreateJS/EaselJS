var fs        = require('fs');
var Easel     = require('easeljs');
var Canvas    = require('canvas');
var Stage     = Easel.Stage;
var Text      = Easel.Text;

function init() {
	// get a reference to the canvas we'll be working with:
	var canvas = new Canvas(500, 500);
	
	// create a stage object to work with the canvas. This is the top level node in the display list:
	var stage = new Stage(canvas);
	
	// Create a new Text object:
	var text = new Text("Hello World!", "36px Arial", "#FFF");
	
	// add the text as a child of the stage. This means it will be drawn any time the stage is updated
	// and that it's transformations will be relative to the stage coordinates:
	stage.addChild(text);
	
	// position the text on screen, relative to the stage coordinates:
	text.x = 100;
	text.y = 100;
	
	// call update on the stage to make it render the current display list to the canvas:
	stage.update();
    
    var sFile = __filename.replace('.js', '.png');
    fs.writeFile(sFile, canvas.toBuffer(), function() {
        console.log('Wrote', sFile);
        process.exit();
    });
}

init();

