var fs        = require('fs');
var Easel     = require('easeljs');
var Canvas    = require('canvas');

var Image     = Canvas.Image;
var Stage     = Easel.Stage;
var Graphics  = Easel.Graphics;


var canvas;
var ctx;

var img = new Image();

function init() {
	//find canvas and load images, wait for last image to load
	canvas = new Canvas(1000, 600);
	ctx = canvas.getContext("2d");

	img.onload = run;
	img.src = "../img/daisy.png";
}

function run() {
	// This demo demonstrates compacting graphics calls using the tiny interface.
	// This interface is also useful for tools exporting vector art for easel.
	// View the graphicsTest for the more verbose calls, and better explanations.

	var g = new Graphics();

	g.ss(16,1,1).s("#FF0").mt(50,50).lt(100,100).lt(100,150); // bent yellow line
	g.ss(8).s("#F0F").rf(["#FF0","#00F"],[0,1],100,200,0,100,200,40).dc(100,200,40); // circle
	g.f("rgba(0,0,255,0.5)").ss(4).ls(["#F00","#FFF"],[0,1],300,300,300,500).de(300,300,100,200,8); // ellipse
	g.s().lf(["#FFF","#000"],[0,1],0,100,0,200).dr(200,100,200,100); // gradient rect
	g.bf(img).ss(8).rs(["#FFF","#000"],[0,1],150,300,0,150,300,200).dr(50,300,200,200); // bitmap rect
	g.f().bs(img).ss(32).dr(20,20,940,540); // bitmap frame
	g.s().f("#FF0").dp(500,200,80,5,0.6,-90); // star
	g.f("#0F0").dp(500,350,50,6).dp(500,440,50,6); // hexagons

	g.draw(ctx);

	// or, as a single line of code:
	/*
	g.ss(16,1,1).s("#FF0").mt(50,50).lt(100,100).lt(100,150).ss(8).s("#F0F").rf(["#FF0","#00F"],[0,1],100,200,0,100,200,40).dc(100,200,40).f("rgba(0,0,255,0.5)").ss(4).ls(["#F00","#FFF"],[0,1],300,300,300,500).de(300,300,100,200,8).s().lf(["#FFF","#000"],[0,1],0,100,0,200).dr(200,100,200,100).bf(img).ss(8).rs(["#FFF","#000"],[0,1],150,300,0,150,300,200).dr(50,300, 200,200).f().bs(img).ss(32).dr(20,20,940,540).s().f("#FF0").dp(500,200,80,5,0.6,-90).f("#0F0").dp(500,350,50,6).dp(500,440,50,6).draw(ctx);
	*/

    var sFile = __filename.replace('.js', '.png');
    fs.writeFile(sFile, canvas.toBuffer(), function() {
        console.log('Wrote', sFile);
        process.exit();
    });
}

init();