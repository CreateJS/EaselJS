var fs        = require('fs');
var Easel     = require('easeljs');
var Canvas    = require('canvas');

var Image     = Canvas.Image;
var Stage     = Easel.Stage;
var Graphics  = Easel.Graphics;


var canvas;
var stage;
var ctx;

var img = new Image();

function init() {
	//find canvas and load images, wait for last image to load
	canvas = new Canvas(1000, 600);
	stage = new Stage(canvas);
	ctx = canvas.getContext("2d");
	
	img.onload = run;
	img.src = "../img/daisy.png";
}

function run() {
	// create a new Graphics object. Note that Graphics can be used without any dependency on the rest of Easel.
	var g = new Graphics();
	
	// note that you can call graphics methods individually:
	g.setStrokeStyle(16, "round", "round")
	g.beginStroke("#FF0");
	// or you can chain them together:
	g.moveTo(50,50).lineTo(100,100).lineTo(100,150);

	g.setStrokeStyle(8).beginStroke("#F0F");
	g.beginRadialGradientFill(["#FF0","#00F"],[0,1],100,200,0,100,200,40);
	g.drawCircle(100,200,40);
	
	// Graphics has a few helper methods for creating color strings from numeric color values:
	g.beginFill(Graphics.getRGB(0x00,0x00,0xFF,0.5));
	g.setStrokeStyle(4)
	g.beginLinearGradientStroke(["#F00","#FFF"],[0,1],300,300,300,500);
	g.drawEllipse(300,300,100,200,8);
	
	g.beginLinearGradientFill(["#FFF","#000"],[0,1],0,100,0,200);
	g.endStroke();
	g.drawRect(200,100,200,100);
	
	g.beginBitmapFill(img);
	g.setStrokeStyle(8).beginRadialGradientStroke(["#FFF","#000"],[0,1],150,300,0,150,300,200);
	g.drawRect(50, 300, 200, 200);

	// example of chaining an entire draw together:
	g.endFill().beginBitmapStroke(img).setStrokeStyle(32).drawRect(20,20,940,540);

	// draw a star:
	g.beginFill("#FF0").endStroke().drawPolyStar(500,200,80,5,0.6,-90);

	// draw two hexagons:
	g.beginFill("#0F0").drawPolyStar(500,350,50,6).drawPolyStar(500,440,50,6);
	
	// Again, note that the Easel framework was not required, we can draw directly to any context2D:
	g.draw(ctx);

    var sFile = __filename.replace('.js', '.png');
    fs.writeFile(sFile, canvas.toBuffer(), function() {
        console.log('Wrote', sFile);
        process.exit();
    });
}

init();