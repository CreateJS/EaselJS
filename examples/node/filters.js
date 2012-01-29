var fs        = require('fs');
var Easel     = require('easeljs');
var Canvas    = require('canvas');

var Image               = Canvas.Image;
var Bitmap              = Easel.Bitmap;
var Stage               = Easel.Stage;
var Shape               = Easel.Shape;
var ColorFilter         = Easel.ColorFilter;
var BoxBlurFilter       = Easel.BoxBlurFilter;
var ColorMatrixFilter   = Easel.ColorMatrixFilter;


var stage;
var img;
function init() {
	//wait for the image to load
	img = new Image();
	img.onload = handleImageLoad;
	img.src = "../img/photo.jpg";
}

function handleImageLoad() {
	//find canvas and load images, wait for last image to load
	var canvas = new Canvas(1000, 600);

	// create a new stage and point it at our canvas:
	stage = new Stage(canvas);

    var bmp = new Bitmap(img);
    bmp.x = (canvas.width-2*img.width)/3;
    bmp.y = (canvas.height-2*img.height)/3;
    stage.addChild(bmp);

    var blurFilter = new BoxBlurFilter(32, 2, 2);
    var margins = blurFilter.getBounds();
    bmp = bmp.clone();
    bmp.filters = [blurFilter];
    // filters are only displayed when the display object is cached
    // later, you can call updateCache() to update changes to your filters
    bmp.cache(margins.x,margins.y,img.width+margins.width,img.height+margins.height);
    bmp.x += bmp.x+img.width;
    stage.addChild(bmp);

    var greyScaleFilter = new ColorMatrixFilter([
        0.33,0.33,0.33,0,0, // red
        0.33,0.33,0.33,0,0, // green
        0.33,0.33,0.33,0,0, // blue
        0,0,0,1,0  // alpha
    ]);
    bmp = bmp.clone();
    bmp.filters = [greyScaleFilter];
    bmp.cache(0,0,img.width,img.height); // color filters don't change the bounds.

    bmp.y += bmp.y+img.height;
    stage.addChild(bmp);

    var removeRedFilter = new ColorFilter(0,1,1,1); // red, green, blue, alpha
    bmp = bmp.clone();
    bmp.filters = [removeRedFilter];
    bmp.cache(0,0,img.width,img.height); // color filters don't change the bounds.
    bmp.x = (canvas.width-2*img.width)/3;
    stage.addChild(bmp);

    // draw to the canvas:
    stage.update();

    var sFile = __filename.replace('.js', '.png');
    fs.writeFile(sFile, canvas.toBuffer(), function() {
        console.log('Wrote', sFile);
        process.exit();
    });
}

init();