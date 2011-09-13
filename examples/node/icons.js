var fs        = require('fs');
var Easel     = require('EaselJS');
var Canvas    = require('canvas');

var Image               = Canvas.Image;
var Stage               = Easel.Stage;
var SpriteSheet         = Easel.SpriteSheet;
var BitmapSequence      = Easel.BitmapSequence;

var canvas;
var stage;

var iconSheet = new Image();

function init() {
	//find canvas and load images, wait for last image to load
	canvas = new Canvas(900, 500);
	iconSheet.onload = handleImageLoad;
	iconSheet.src = "../img/icons.png";
}

function handleImageLoad() {
	// create a new stage and point it at our canvas:
	stage = new Stage(canvas);
	
	/*** FIRST: the "simple" approach ***/
	// create a simple SpriteSheet with a frame size of 80x80 and no frameData:
	var spriteSheet  = new SpriteSheet(iconSheet, 80, 80);
	
	// create a BitmapSequence to display frames from the sprite sheet:
	var icon1 = new BitmapSequence(spriteSheet);
	icon1.y = 100;
	icon1.x = 90;
	
	// because we didn't specify frameData, we have to reference frames by number:
	icon1.gotoAndStop(2);
	stage.addChild(icon1);
	
	// we'll clone icon1 to save a little work:
	var icon2 = icon1.clone();
	icon2.x += 120;
	icon2.gotoAndStop(5);
	stage.addChild(icon2);
	
	
	
	/*** NEXT: the more robust approach ***/
	// define frameData describing the available icons:
	// we can use the form {frameName:frameNumber} instead of {frameName:[startFrame,endFrame]} because each "sequence" is only a single frame:
	var frameData = {trash:0, male:1, wait:2, library:3, female:4, hanger:5, stairs:6, noparking:7};
	
	// create a SpriteSheet using the frameData:
 	spriteSheet = new SpriteSheet(iconSheet, 80, 80, frameData);
 	
 	// we'll clone icon2, to preserve the x/y, and swap out the SpriteSheet:
 	var icon3 = icon2.clone();
 	icon3.spriteSheet = spriteSheet;
 	icon3.x += 120;
 	
 	// we can reference frames by name because of frameData:
 	icon3.gotoAndStop("male");
 	stage.addChild(icon3);
 	
 	var icon4 = icon3.clone();
 	icon4.gotoAndStop("female");
 	icon4.x += 120;
 	stage.addChild(icon4);
 	
 	var icon5 = icon4.clone();
 	icon5.gotoAndStop("trash");
 	icon5.x += 120;
 	stage.addChild(icon5);
 	
 	// finally, we'll add one that just plays through:
 	var icon6 = icon1.clone();
 	icon6.x = icon5.x + 190;
 	icon6.gotoAndPlay(0);
 	stage.addChild(icon6);

    var iWritten = 0;
    var iWriting = 6;
    for (var i = 0; i < 6; i++) {
        stage.update();

        (function(i) {
            var sFile = __filename.replace('.js', '-' + i + '.png');
            fs.writeFile(sFile, canvas.toBuffer(), function() {
                console.log('Wrote', sFile);
                iWritten++;
                if (iWritten >= iWriting) {
                    process.exit();
                }
            });
        }(i));
    }
}

init();