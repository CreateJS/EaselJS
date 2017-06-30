describe("StageGL", function () {
	var DEBUG = true;

	// To account for AntiAlias and rendering fluctuations
	var stageWidth, stageHeight, tolerance, bitmapTextSpriteData;
	beforeAll(function (done) {
		stageWidth = this.stageWidth;
		stageHeight = this.stageHeight;
		tolerance = 0.0025 * stageWidth * stageHeight;

		this.bitmapTextSpriteData = {
			"animations": {
				"V": {"frames": [21]},
				"A": {"frames": [0]},
				",": {"frames": [26]},
				"W": {"frames": [22]},
				"B": {"frames": [1]},
				"X": {"frames": [23]},
				"C": {"frames": [2]},
				".": {"frames": [29]},
				"Y": {"frames": [24]},
				"D": {"frames": [3]},
				"Z": {"frames": [25]},
				"E": {"frames": [4]},
				"F": {"frames": [5]},
				"G": {"frames": [6]},
				"H": {"frames": [7]},
				"I": {"frames": [8]},
				"J": {"frames": [9]},
				"K": {"frames": [10]},
				"!": {"frames": [27]},
				"L": {"frames": [11]},
				"M": {"frames": [12]},
				"N": {"frames": [13]},
				"O": {"frames": [14]},
				"P": {"frames": [15]},
				"Q": {"frames": [16]},
				"R": {"frames": [17]},
				"S": {"frames": [18]},
				"T": {"frames": [19]},
				"?": {"frames": [28]},
				"U": {"frames": [20]}
			},
			"images": [this.assetsBasePath + "spritesheet_font.png"],
			"frames": [
				[155, 2, 25, 41, 0, -10, -3],
				[72, 2, 28, 43, 0, -8, -1],
				[599, 2, 28, 38, 0, -8, -4],
				[41, 2, 27, 44, 0, -8, -1],
				[728, 2, 32, 38, 0, -6, -4],
				[184, 2, 35, 41, 0, -4, -2],
				[409, 2, 30, 39, 0, -7, -3],
				[443, 2, 29, 39, 0, -7, -3],
				[901, 2, 13, 35, 0, -8, -5],
				[698, 2, 26, 38, 0, -9, -4],
				[666, 2, 28, 38, 0, -8, -4],
				[764, 2, 23, 38, 0, -10, -4],
				[828, 2, 37, 36, 0, -3, -5],
				[567, 2, 28, 38, 0, -8, -4],
				[519, 2, 44, 38, 0, 1, -4],
				[869, 2, 28, 36, 0, -8, -5],
				[476, 2, 39, 38, 0, -2, -4],
				[371, 2, 34, 39, 0, -5, -3],
				[631, 2, 31, 38, 0, -6, -4],
				[289, 2, 39, 40, 0, -2, -3],
				[918, 2, 31, 32, 0, -6, -7],
				[791, 2, 33, 37, 0, -5, -4],
				[2, 2, 35, 46, 0, -4, 1],
				[253, 2, 32, 40, 0, -6, -3],
				[104, 2, 32, 43, 0, -6, -1],
				[332, 2, 35, 39, 0, -5, -4],
				[953, 2, 9, 16, 0, -17, -29],
				[140, 2, 11, 41, 0, -16, -1],
				[223, 2, 26, 41, 0, -7, -1],
				[966, 2, 9, 10, 0, -17, -31]
			]
		};
		done();
	});

	beforeEach(function (done) {
		var img = new Image();
		var _this = this;
		img.onload = function () {
			_this.stageGL = makeStage();
			_this.bmp = new createjs.Bitmap(img);
			_this.shape = new createjs.Shape();
			_this.shape.graphics.ss(2).s("#222222").f("#44DD44").dr(2,2, 60,60).ef();
			_this.shape.width = 64;
			_this.shape.height = 64;
			done();
		};
		img.onerror = function () {
			fail(img.src + ' failed to load');
			done();
		};
		img.src = this.bitmapTextSpriteData.images[0];
	});

	var makeStage = function () {
		var canvas = document.createElement("canvas");
		canvas.style.width = (canvas.width = stageWidth) + "px";
		canvas.style.height = (canvas.height = stageHeight) + "px";
		return new createjs.StageGL(canvas, {transparent: true, antialias: true, premultiply: true});
	};

	var compareStageRendering = function (stage, stageGL, content, invert) {
		stage.addChild(content);
		stage.update();

		stageGL.addChild(content);
		stageGL.update();

		// we need a context 2D to extract the
		var canvas = document.createElement("canvas");
		canvas.style.width = (canvas.width = stageWidth) + "px";
		canvas.style.height = (canvas.height = stageHeight) + "px";

		// draw in the stageGL
		var glC2DExtraction = canvas.getContext("2d");
		glC2DExtraction.drawImage(stageGL.canvas, 0,0);

		if (DEBUG) {
			// we need a context 2D to extract the
			var canvasStick = document.createElement("canvas");
			canvasStick.style.width = (canvasStick.width = stage.canvas.width) + "px";
			canvasStick.style.height = (canvasStick.height = stage.canvas.height) + "px";

			// draw in the stageGL
			var contextStick = canvasStick.getContext("2d");
			contextStick.drawImage(stage.canvas, 0,0);

			var label, dispWrapper, debugWrapper = document.createElement("div");

			dispWrapper = document.createElement("div");
			dispWrapper.style.display = "inline-block";

			label = document.createElement("div");
			label.innerHTML = "Actual:";

			dispWrapper.appendChild(label);
			dispWrapper.appendChild(canvas);
			debugWrapper.appendChild(dispWrapper);

			dispWrapper = document.createElement("div");
			dispWrapper.style.display = "inline-block";

			label = document.createElement("div");
			label.innerHTML = "Expected:";

			dispWrapper.appendChild(label);
			dispWrapper.appendChild(canvasStick);
			debugWrapper.appendChild(dispWrapper);

			document.body.appendChild(debugWrapper);
		}

		if(invert){
			expect(stage.canvas).not.toImageDiffEqual(glC2DExtraction, tolerance);
		} else {
			expect(stage.canvas).toImageDiffEqual(glC2DExtraction, tolerance);
		}
	};

	describe("Basic Drawing", function () {
		beforeEach(function(done) {
			this.stageGL = makeStage();
			done();
		});

		it("Draws bitmap images", function(done) {
			var bmpTest = this.bmp.clone(true);
			compareStageRendering(this.stage, this.stageGL, bmpTest);
			done();
		});

		it("Draws cached shapes", function(done) {
			var shapeTest = this.shape.clone();
			shapeTest.cache(0,0, this.shape.width,this.shape.height);
			compareStageRendering(this.stage, this.stageGL, shapeTest);
			done();
		});

		it("Draws SpriteSheets", function(done) {
			var ss = new createjs.SpriteSheet(this.bitmapTextSpriteData);
			var sprite = new createjs.Sprite(ss);
			sprite.gotoAndStop("Q");
			compareStageRendering(this.stage, this.stageGL, sprite);
			done();
		});

		it("Works with containers", function(done) {
			var bmpTest = this.bmp.clone(true);
			var container1 = new createjs.Container();
			var container2 = new createjs.Container();

			container2.addChild(container1);
			container1.addChild(bmpTest);
			compareStageRendering(this.stage, this.stageGL, container2);		// unmoved

			bmpTest.x = 40;			bmpTest.y = 60;
			container1.x = 35;		container1.y = 15;
			container2.x = 15;		container2.y = 35;
			compareStageRendering(this.stage, this.stageGL, container2);		// combined translation

			done();
		});

		it("Draws Bitmap Text", function(done) {
			var ss = new createjs.SpriteSheet(this.bitmapTextSpriteData);
			var text = new createjs.BitmapText("TEST", ss);
			compareStageRendering(this.stage, this.stageGL, text);
			done();
		});

		it("Draws DOM elements", function(done) {	// simply do a no-fail check
			var dom = document.createElement("div");
			var text = new createjs.DOMElement(dom);
			this.stageGL.addChild(text);
			expect(function(){this.stageGL.update()}.bind(this)).not.toThrow();
			done();
		});

		it("Silent fail on unsupported elements", function(done) {
			var container = new createjs.Container();

			var bmpTest = this.bmp.clone(true);
			container.addChild(bmpTest);

			bmpTest.shadow = new createjs.Shadow("#000000", 5, 5, 10);

			var shapeTest = this.shape.clone();
			container.addChild(shapeTest);

			var txt = new createjs.Text("TEST", "20px Arial", "#ff7700");
			container.addChild(txt);

			compareStageRendering(this.stage, this.stageGL, container, true);

			done();
		});
	});

	describe("Basic transformations", function () {
		beforeEach(function(done) {
			this.stageGL = makeStage();
			this.shapeTest = this.shape.clone();
			this.shapeTest.cache(0,0, this.shape.width,this.shape.height);	// the clone doesn't copy the width over
			done();
		});

		it("Translation", function(done) {
			this.shapeTest.x = 30;
			this.shapeTest.y = 50;
			compareStageRendering(this.stage, this.stageGL, this.shapeTest);
			done();
		});

		it("Scale", function(done) {
			this.shapeTest.scaleX = 2;
			this.shapeTest.scaleY = 1.5;
			compareStageRendering(this.stage, this.stageGL, this.shapeTest);
			done();
		});

		it("Registration", function(done) {
			this.shapeTest.regX = 5;
			this.shapeTest.regY = -20;
			compareStageRendering(this.stage, this.stageGL, this.shapeTest);
			done();
		});

		it("Rotation", function(done) {
			this.shapeTest.rotation = 45;
			compareStageRendering(this.stage, this.stageGL, this.shapeTest);
			done();
		});

		it("Skewing", function(done) {
			this.shapeTest.skewX = 5;
			this.shapeTest.skewY = 0.25;
			compareStageRendering(this.stage, this.stageGL, this.shapeTest);
			done();
		});

		it("Combined", function(done) {
			this.shapeTest.x = 30;
			this.shapeTest.y = 50;
			this.shapeTest.scaleX = 2;
			this.shapeTest.scaleY = 1.5;
			this.shapeTest.regX = 5;
			this.shapeTest.regY = -20;
			this.shapeTest.skewX = 25;
			this.shapeTest.skewY = 5;
			compareStageRendering(this.stage, this.stageGL, this.shapeTest);
			done();
		});
	});

	/*
	describe("Filters/caches", function () {
		beforeEach(function(done) {
			this.stageGL = makeStage();
			done();
		});

		it("2D Stage 3D cache", function(done) {

			fail("incomplete");


			//compareStageRendering(this.stage, this.stageGL, );
			done();
		});
		it("3D Stage 3D cache", function(done) {

			fail("incomplete");


			//compareStageRendering(this.stage, this.stageGL, );
			done();
		});
		it("________ filter", function(done) {

			fail("incomplete");


			//compareStageRendering(this.stage, this.stageGL, );
			done();
		});
	});
	*/

	describe("Misc functionality", function () {
		beforeEach(function(done) {
			this.stageGL = makeStage();
			done();
		});

		it("HitTest", function(done) {
			var shapeTest = this.shape.clone();

			this.stage.addChild(shapeTest);
			expect(this.stage.hitTest(10, 10)).toBe(true);
			this.stageGL.addChild(shapeTest);
			expect(this.stageGL.hitTest(10, 10)).toBe(true);

			done();
		});
	});
});
