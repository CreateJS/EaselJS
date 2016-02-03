describe("SpriteStage", function () {

	beforeEach(function (done) {
		this.spriteWidth = 20;
		this.spriteHeight = 20;

		this.sprite = new createjs.Shape();
		this.sprite.graphics.beginFill("#00aa00");
		this.sprite.graphics.drawRect(0, 0, this.spriteWidth, this.spriteHeight);
		this.sprite.graphics.endFill();

		var img = this.img = new Image();
		img.onload = function () { done(); };
		img.onerror = function () { fail(img.src + ' failed to load'); done(); };
		img.src = this.assetsBasePath + "flowers.jpg";
		this.sprite = new createjs.Bitmap(img);

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

		this.spriteStage = new createjs.SpriteStage(canvas, false, true);
		this.spriteStage.updateViewport(canvas.width, canvas.height);
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
				document.body.appendChild(this.stage.canvas);
				document.body.appendChild(this.spriteStage2DCanvas);
			}

			var pixels = this.stageWidth * this.stageHeight;
			var tolerance = pixels * 0.005; // Small tolerance to account for antialias inconsistencies.

			expect(this.spriteStage2DCanvas).toImageDiffEqual(this.stage.canvas, tolerance);

			done();
		};

		this.compareDisplayObjects = function (obj, expect, done, debug) {
			var objSS = obj.clone(true);
			// objSS.cache(0, 0, this.spriteWidth, this.spriteHeight);

			this.stage.addChild(obj);
			this.spriteStage.addChild(objSS);

			this.compareStages(expect, done, debug);
		};
	});

	it("Simple image", function (done) {
		var obj = this.sprite.clone(true);

		this.compareDisplayObjects(obj, expect, done);
	});

	it("Simple image - x, y", function (done) {
		var obj = this.sprite.clone(true);
		obj.x = 10;
		obj.y = 15;

		this.compareDisplayObjects(obj, expect, done);
	});

	it("Simple image - scaleX,scaleY", function (done) {
		var obj = this.sprite.clone(true);
		obj.scaleX = 2;
		obj.scaleY = 1.5;

		this.compareDisplayObjects(obj, expect, done);
	});

	it("Simple image - rotation", function (done) {
		var obj = this.sprite.clone(true);
		obj.rotation = 45;

		this.compareDisplayObjects(obj, expect, done);
	});

	it("Simple image - skewX,skewY", function (done) {
		var obj = this.sprite.clone(true);
		obj.skewX = 0.5;
		obj.skewY = 0.25;

		this.compareDisplayObjects(obj, expect, done);
	});

	it("Simple image - regX,regY", function (done) {
		var obj = this.sprite.clone(true);
		obj.regX = -10;
		obj.regY = -10;

		this.compareDisplayObjects(obj, expect, done);
	});

});
