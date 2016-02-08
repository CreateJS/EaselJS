describe("SpriteStage", function () {

	beforeEach(function (done) {
		this.sprite = new createjs.Shape();
		this.sprite.width = 20;
		this.sprite.height = 20;
		this.sprite.graphics.beginFill("#00aa00");
		this.sprite.graphics.drawRect(0, 0, this.sprite.width, this.sprite.height);
		this.sprite.graphics.endFill();

		this.bmp = new createjs.Bitmap();
		var img = new Image();
		img.onload = function () {
			this.bmp.width = img.naturalWidth;
			this.bmp.height = img.naturalHeight;
			done();
		}.bind(this);
		img.onerror = function () { fail(img.src + ' failed to load'); done(); };
		img.src = this.assetsBasePath + "ground.png";
		this.bmp.image = img;
		this.bmp.width = img.naturalWidth;
		this.bmp.height = img.naturalWidth;

		// Add a background color to match WebGL's:
		var bgColor = new createjs.Shape();
		var g = bgColor.graphics;
		g.beginFill("#000000");
		g.drawRect(0, 0, this.stageWidth, this.stageHeight);
		g.endFill();
		bgColor.cache(0, 0, this.stageWidth, this.stageHeight);
		this.stage.addChild(bgColor);

		var bgColorSS = bgColor.clone();
		bgColorSS.cache(0, 0, this.stageWidth, this.stageHeight);

		var canvas = document.createElement("canvas");
		canvas.width = this.stageWidth;
		canvas.height = this.stageHeight;

		//*
		this.spriteStage = new createjs.SpriteStage(canvas, false, true);
		this.spriteStage.updateViewport(canvas.width, canvas.height);
		/*/
		this.spriteStage = new createjs.Stage(canvas);
		//*/
		this.spriteStage.addChild(bgColorSS); // Don't really need this, but adding for mirroring consistency.

		this.spriteStage2DCanvas = document.createElement("canvas");
		this.spriteStage2DCanvas.width = this.stageWidth;
		this.spriteStage2DCanvas.height = this.stageHeight;

		this.spriteStage2DContext = this.spriteStage2DCanvas.getContext("2d");

		this.compareStages = function (expect, done, debug) {
			this.stage.update();
			this.spriteStage.update();

			this.spriteStage2DContext.drawImage(this.spriteStage.canvas, 0, 0);

			if (debug) {
				var debugTest = document.createElement("div");

				var debugStage = document.createElement("div");
				debugStage.style.display = "inline-block";
				var debugStageLabel = document.createElement("div");
				debugStageLabel.innerHTML = "Actual:";
				debugStage.appendChild(debugStageLabel);
				debugStage.appendChild(this.spriteStage2DCanvas);
				debugTest.appendChild(debugStage);

				var debugStage = document.createElement("div");
				debugStage.style.display = "inline-block";
				var debugStageLabel = document.createElement("div");
				debugStageLabel.innerHTML = "Expected:";
				debugStage.appendChild(debugStageLabel);
				debugStage.appendChild(this.stage.canvas);
				debugTest.appendChild(debugStage);

				document.body.appendChild(debugTest);
			}

			var pixels = this.stageWidth * this.stageHeight;
			var tolerance = pixels * 0.005; // Small tolerance to account for antialias inconsistencies.
			// tolerance = 0;

			expect(this.spriteStage2DCanvas).toImageDiffEqual(this.stage.canvas, tolerance);

			done();
		};
	});

	it("Box Shape", function (done) {
		var obj = this.sprite.clone(true);

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Box Shape - x, y", function (done) {
		var obj = this.sprite.clone(true);
		obj.x = 10;
		obj.y = 15;

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Box Shape - scaleX,scaleY", function (done) {
		var obj = this.sprite.clone(true);
		obj.scaleX = 2;
		obj.scaleY = 1.5;

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Box Shape - rotation", function (done) {
		var obj = this.sprite.clone(true);
		obj.rotation = 40;

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Box Shape - skewX,skewY", function (done) {
		var obj = this.sprite.clone(true);
		obj.skewX = 5;
		obj.skewY = 0.25;

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Box Shape - regX,regY", function (done) {
		var obj = this.sprite.clone(true);
		obj.regX = -10;
		obj.regY = -10;

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Box Shape - x,y,scaleX,scaleY,rotation,skewX,skewY,regX,regY", function (done) {
		var obj = this.sprite.clone(true);
		obj.x = 32;
		obj.y = 30;
		obj.scaleX = 1.5;
		obj.scaleY = 2;
		obj.rotation = 10;
		obj.skewX = 50;
		obj.skewY = 15;
		obj.regX = -10;
		obj.regY = -10;

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Container + image", function (done) {
		var obj = new createjs.Container();
		obj.x = 30;
		obj.y = 30;

		var child = this.bmp.clone(true);
		obj.addChild(child);

		var objSS = obj.clone(true);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Containers + translated image", function (done) {
		var obj = new createjs.Container();

		var child = this.bmp.clone(true);
		child.regX = -25;
		obj.addChild(child);

		var objSS = obj.clone(true);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Containers + multiple translated images", function (done) {
		var obj = new createjs.Container();
		obj.x = 30;
		obj.y = 30;
		obj.scaleX = 1.5;

		var child = this.bmp.clone(true);
		child.x = 50;
		child.regX = 25;
		obj.addChild(child);

		var childContainer = new createjs.Container();
		childContainer.x = 30;
		childContainer.y = 30;
		childContainer.rotation = 15;
		obj.addChild(childContainer);

		var child2 = this.bmp.clone(true);
		child2.regX = 15;
		child2.skewY = 45;
		childContainer.addChild(child2);

		var objSS = obj.clone(true);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	it("Image", function (done) {
		var obj = this.bmp.clone(true);
		obj.x = 30;
		obj.y = 30;

		var objSS = obj.clone(true);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);

		this.compareStages(expect, done);
	});

	// NOTE: copied from DisplayListSpec.js
	it("BitmapText", function (done) {
		// Embedded SpriteSheet data.
		var data = {
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

		var img = new Image();
		img.onload = function () {
			var ss = new createjs.SpriteSheet(data);
			var text = new createjs.BitmapText("abcdef\nghijklm\nnopqr\nstuvw\nxyz!,.?", ss);

			var textSS = text.clone();

			this.stage.addChild(text);
			this.spriteStage.addChild(textSS);

			// Need to delay this for Safari.
			setTimeout(function () {
				this.compareStages(expect, done);
			}.bind(this), 5);
		}.bind(this);
		img.onerror = function () {
			fail(img.src + ' failed to load');
			done();
		}.bind(this);

		img.src = this.assetsBasePath + "spritesheet_font.png";
	});

	// NOTE: copied from DisplayListSpec.js
	it("masks should work", function (done) {
		// masks can only be shapes.
		var star = new createjs.Shape();

		// the mask's position will be relative to the parent of its target:
		star.x = this.img.width / 2;
		star.y = this.img.height / 2;

		// only the drawPolyStar call is needed for the mask to work:
		star.graphics.beginStroke("#FF0").setStrokeStyle(3).drawPolyStar(0, 0, this.img.height / 2, 5, 0.6);

		var bmp = new createjs.Bitmap(this.img);
		bmp.mask = star;
		this.stage.addChild(bmp);

		var bmpSS = bmp.clone(true);
		this.spriteStage.addChild(bmpSS);

		// note that the shape can be used in the display list as well if you'd like, or
		// we can reuse the Graphics instance in another shape if we'd like to transform it differently.
		this.stage.addChild(star);

		this.compareStages(expect, done);
	});

	// NOTE: copied from DisplayListSpec.js
	it("hitTest() should be true.", function (done) {
		var dot = new createjs.Shape();

		var g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(this.sColor);
		g.beginFill(this.fColor);
		g.drawRect(0, 0, 50, 50);
		g.endFill();

		this.stage.addChild(dot);
		this.stage.update();

		var dotSS = dot.clone(true);
		dotSS.cache(0, 0, 50, 50);

		this.spriteStage.addChild(dotSS);
		this.spriteStage.update();

		expect(this.stage.hitTest(1, 1)).toBe(true);
		expect(this.spriteStage.hitTest(1, 1)).toBe(true);

		// Compare stages, just to make sure the hit test isn't a fluke:
		this.compareStages(expect, done);
	});

	// NOTE: copied from UtilityMethodsSpec.js
	describe("SpriteSheetBuilder", function () {
		beforeEach(function () {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("#F00").drawCircle(0, 0, 30).beginFill("#C00").drawCircle(0, 0, 10);
			circle.setTransform(0, 0);

			var square = new createjs.Container();
			var squareBg = square.addChild(new createjs.Shape());
			squareBg.graphics.beginFill("#00F").drawRect(0, 0, 80, 80);

			var squareFld = square.addChild(new createjs.Text("1", "bold 72px Arial", "#9BF"));
			squareFld.textBaseline = "top";
			squareFld.textAlign = "center";
			squareFld.x = 40;
			square.bounds = new createjs.Rectangle(0, 0, 80, 80);

			// create the sprite sheet builder:
			this.builder = new createjs.SpriteSheetBuilder();

			var index = this.builder.addFrame(circle, new createjs.Rectangle(-30, -30, 60, 60));
			this.builder.addAnimation("circle", index);

			var frames = [];
			for (var i = 0; i < 5; i++) {
				index = this.builder.addFrame(square, null, 1, function (target, data) {
					squareFld.text = data;
				}, i);
				frames.push(index);
			}

			this.builder.addAnimation("square", [1], true);
			this.builder.addAnimation("square2", [2], true);
		});

		it("should build synchronously", function (done) {
			var spriteSheet = this.builder.build();

			var circle2 = new createjs.Sprite(spriteSheet, "circle");
			var circle2SS = circle2.clone();
			this.stage.addChild(circle2).set({x: 40, y: 120});
			this.spriteStage.addChild(circle2SS).set({x: 40, y: 120});

			var circle3 = new createjs.Sprite(spriteSheet, "circle");
			var circle3SS = circle3.clone();
			this.stage.addChild(circle3).set({x: 120, y: 120});
			this.spriteStage.addChild(circle3SS).set({x: 120, y: 120});

			var square2 = new createjs.Sprite(spriteSheet, "square");
			var square2SS = square2.clone();
			this.stage.addChild(square2);
			this.spriteStage.addChild(square2SS);

			var square3 = new createjs.Sprite(spriteSheet, "square2");
			var square3SS = square3.clone();
			this.stage.addChild(square3).set({x: 80});
			this.spriteStage.addChild(square3SS).set({x: 80});

			this.compareStages(expect, done);
		});

		it("should build async", function (done) {
			this.builder.addEventListener("complete", function () {
				var spriteSheet = this.builder.spriteSheet;

				var circle2 = new createjs.Sprite(spriteSheet, "circle");
				var circle2SS = circle2.clone();
				this.stage.addChild(circle2).set({x: 40, y: 120});
				this.spriteStage.addChild(circle2SS).set({x: 40, y: 120});

				var circle3 = new createjs.Sprite(spriteSheet, "circle");
				var circle3SS = circle3.clone();
				this.stage.addChild(circle3).set({x: 120, y: 120});
				this.spriteStage.addChild(circle3SS).set({x: 120, y: 120});

				var square2 = new createjs.Sprite(spriteSheet, "square");
				var square2SS = square2.clone();
				this.stage.addChild(square2);
				this.spriteStage.addChild(square2SS);

				var square3 = new createjs.Sprite(spriteSheet, "square2");
				var square3SS = square3.clone();
				this.stage.addChild(square3).set({x: 80});
				this.spriteStage.addChild(square3SS).set({x: 80});

				// this.compareBaseLine("assets/SpriteSheetBuilder.png", done, expect, 0.0075);
				this.compareStages(expect, done);
			}.bind(this));

			this.builder.buildAsync();
		});
	});

});
