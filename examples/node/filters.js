var fs        = require('fs');
var Easel     = require('easeljs');
var Canvas    = require('canvas');

var Stage               = Easel.Stage;
var Shape               = Easel.Shape;
var ColorFilter         = Easel.ColorFilter;
var BoxBlurFilter       = Easel.BoxBlurFilter;
var ColorMatrixFilter   = Easel.ColorMatrixFilter;


function init() {
	//find canvas and load images, wait for last image to load
	var canvas = new Canvas(500, 500);
	
	// create a new stage and point it at our canvas:
	stage = new Stage(canvas);

	var blurFilter = new BoxBlurFilter(16, 8, 2);
	var margins = blurFilter.getBounds();
	
	var shape = new Shape();
	shape.graphics.setStrokeStyle(4).beginStroke("#FFFFFF").beginFill("#666").drawRect(0,0,100,100);
	shape.x = shape.y = 50;
	shape.filters = [new ColorFilter(0,1,1,1,0,0,0,0),blurFilter];
	shape.cache(margins.x,margins.y,100+margins.width,100+margins.height);
	stage.addChild(shape);

	var a = 0.33;
	var mtx = [a,a,a,0,0,
			   a,a,a,0,0,
			   a,a,a,0,0,
			   0,0,0,1,0];
	shape = new Shape();
	shape.graphics.beginStroke("#FF0").beginFill("#0F0").drawRect(0,0,100,100);
	shape.x = 200;
	shape.y = 50;
	shape.filters = [new ColorMatrixFilter(mtx)];
	shape.cache(-2,-2,104,104);
	stage.addChild(shape);
	
	// we want to do some work before we update the canvas,
	// otherwise we could use Ticker.addListener(stage);
	stage.update();

    var sFile = __filename.replace('.js', '.png');
    fs.writeFile(sFile, canvas.toBuffer(), function() {
        console.log('Wrote', sFile);
        process.exit();
    });
}

init();