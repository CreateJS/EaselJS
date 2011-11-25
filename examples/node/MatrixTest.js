var fs        = require('fs');
var Easel     = require('easeljs');
var Canvas    = require('canvas');

var Stage         = Easel.Stage;
var Bitmap        = Easel.Bitmap;
var Point         = Easel.Point;
var Shape         = Easel.Shape;
var Graphics      = Easel.Graphics;
var Container     = Easel.Container;
var Image         = Canvas.Image;

var canvas;
var stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset = new Point();
var target;
var target2;
var container;
var ref;

function init() {
    // create stage and point it to the canvas:
    canvas = new Canvas(500,500);
    stage = new Stage(canvas);

    // toss a shape on stage to show what it looks like untransformed:
    ref = new Shape();
    stage.addChild(ref);
    ref.x = ref.y = 60;
    ref.graphics.beginFill("#888").drawRect(-50,-50,100,100).beginFill("#FFF").drawRect(0,-1,60,2);


    // create a container (equivalent to a Sprite)
    container = new Container();
    stage.addChild(container);

    container.x = 100;
    container.y = 50;
    container.scaleX = 1;
    container.skewX = -39;

    // create the target we will try to match:
    target = new Shape();
    container.addChild(target);
    target.graphics.beginFill("#F00").drawRect(-50,-50,100,100).beginFill("#FFF").drawRect(0,-1,60,2);

    target.scaleX = -1;
    target.skewY = 17;
    target.x = target.y = 100;
    target.rotation = 30;

    test();
}

function test() {
    // create another identical looking target to overlay:
    target2 = new Shape();
    target2.graphics.beginFill("#00F").drawRect(-50,-50,100,100).beginFill("#FFF").drawRect(0,-1,60,2);
    stage.addChild(target2);

    var mtx = target.getConcatenatedMatrix();
    mtx.decompose(target2);
    target2.y += 100;

    target.onPress = function(evt) { alert("Clicked the red shape"); }

    stage.update();

    var sFile = __filename.replace('.js', '.png');
    fs.writeFile(sFile, canvas.toBuffer(), function() {
        console.log('Wrote', sFile);
        process.exit();
    });
}

init();
