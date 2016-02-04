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
			tolerance = 0;

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

	it("Container", function (done) {
		var obj = new createjs.Container();
		obj.x = 30;
		obj.y = 30;

		var child = this.sprite.clone(true);
		child.regX = -10;
		child.regY = -10;
		obj.addChild(child);

		var objSS = obj.clone(true);
		objSS.cache(10, 10, this.sprite.width, this.sprite.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);
		this.compareStages(expect, done);
	});

	it("Image", function (done) {
		var obj = this.bmp.clone(true);
		obj.x = 30;
		obj.y = 30;

		var objSS = obj.clone(true);
		objSS.cache(0, 0, this.bmp.width, this.bmp.height);

		this.stage.addChild(obj);
		this.spriteStage.addChild(objSS);
		this.compareStages(expect, done);
	});

});
