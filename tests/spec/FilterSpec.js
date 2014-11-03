describe("Filters", function () {
	var sColor = "#000";
	var fColor = "#ff0000";
	var g;
	var stage;
	var img;

	beforeEach(function (done) {
		stage = new createjs.Stage(imagediff.createCanvas(200, 200));
		var shape = new createjs.Shape();
		g = shape.graphics;
		stage.addChild(shape);

		baseStage = new createjs.Stage(imagediff.createCanvas(200, 200));

		jasmine.addMatchers(imagediff.jasmine);

		img = new Image();
		img.onload = function () {
			done();
		}
		img.src = "assets/daisy.png";
	});

	/**
	 * Compare each drawing to a pre-saved base line image.
	 * Need to has a small tolerance (100),
	 * to account for antialiasing differnces between the saved images also browser to browser to browser differnces.
	 *
	 * @param path
	 * @param done
	 * @param expect
	 */
	var compareBaseLine = function (path, done, expect, pixelTolerance) {
		stage.update();

		var img = new Image();
		img.src = path;
		img.onload = function () {
			var pixels = 200 * 200;
			var tolerance = pixels * (pixelTolerance == null ? .005 : pixelTolerance);
			expect(stage.canvas).toImageDiffEqual(this, tolerance);
			done();
		}
	}

	it("AlphaMaskFilter", function (done) {
		var width = img.width;
		var height = img.height;

		var bmp2 = new createjs.Bitmap(img);

		var maskShape = new createjs.Shape();
		g = maskShape.graphics;
		g.beginLinearGradientFill(["rgba(255,255,255,1)", "rgba(255,255,255,0)"], [0, 1], 0, 0, 0, 35)
		g.drawRect(0, 0, width, height);
		g.endFill();

		maskShape.cache(0, 0, width, height);

		var amf = new createjs.AlphaMaskFilter(maskShape.cacheCanvas);
		bmp2.filters = [amf];
		bmp2.cache(0, 0, width, height);
		stage.addChild(bmp2);

		stage.update();
		compareBaseLine("assets/AlphaMaskFilter.png", done, expect);

		expect(amf.clone().mask).toBe(maskShape.cacheCanvas);
	});

	it("AlphaMapFilter", function (done) {
		var width = img.width;
		var height = img.height;

		var bmp2 = new createjs.Bitmap(img);

		var maskShape = new createjs.Shape();
		g = maskShape.graphics;
		g.beginLinearGradientFill(["rgba(255,255,255,1)", "rgba(255,255,255,0)"], [0, 1], 0, 0, 0, 100)
		g.drawRect(0, 0, width, height);
		g.endFill();

		maskShape.cache(0, 0, width, height);

		var amf = new createjs.AlphaMapFilter(maskShape.cacheCanvas);
		bmp2.filters = [amf];
		bmp2.cache(0, 0, width, height);
		stage.addChild(bmp2);

		compareBaseLine("assets/AlphaMapFilter.png", done, expect);

		expect(amf.clone().alphaMap).toBe(maskShape.cacheCanvas);
	});

	it("BlurFilter", function (done) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill("#ff0000").drawCircle(50, 75, 25);

		var blurFilter = new createjs.BlurFilter(10, 50, 2);
		shape.filters = [blurFilter];
		var bounds = blurFilter.getBounds();

		stage.addChild(shape);

		shape.cache(0, 0, 100, 100);

		compareBaseLine("assets/BlurFilter.png", done, expect, 0.01);

		var blurClone = blurFilter.clone();
		expect(blurClone.blurX).toBe(blurFilter.blurX);
		expect(blurClone.blurY).toBe(blurFilter.blurY);
		expect(blurClone.quality).toBe(blurFilter.quality);
	});

	it("ColorFilter() shape should be blue", function (done) {
		var shape = new createjs.Shape().set({x: 10, y: 10});
		shape.graphics.beginFill("#ff0000").drawCircle(50, 60, 25);

		var cf = new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 255, 0);

		shape.filters = [cf];

		shape.cache(0, 0, 100, 100);
		stage.addChild(shape);

		compareBaseLine("assets/ColorFilter.png", done, expect, 0.01);

		var colorFilterClone = cf.clone();

		expect(colorFilterClone.redMultiplier).toBe(cf.redMultiplier);
		expect(colorFilterClone.greenMultiplier).toBe(cf.greenMultiplier);
		expect(colorFilterClone.blueMultiplier).toBe(cf.blueMultiplier);
		expect(colorFilterClone.alphaMultiplier).toBe(cf.alphaMultiplier);
		expect(colorFilterClone.redOffset).toBe(cf.redOffset);
		expect(colorFilterClone.greenOffset).toBe(cf.greenOffset);
		expect(colorFilterClone.blueOffset).toBe(cf.blueOffset);
		expect(colorFilterClone.alphaOffset).toBe(cf.alphaOffset);
	});

	it("ColorMatrixFilter()", function (done) {
		var bmp = new createjs.Bitmap(img).set({x: 25, y: 25});

		var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
		var cmf = new createjs.ColorMatrixFilter(matrix);
		bmp.filters = [cmf];

		bmp.cache(0, 0, 100, 100);

		stage.addChild(bmp);

		compareBaseLine("assets/ColorMatrixFilter.png", done, expect);

		var clone = cmf.clone().matrix.toArray();
		var orig = cmf.matrix.toArray()

		for (var i = 0; i < orig.length; i++) {
			expect(clone[i]).toBe(orig[i]);
		}
	});

	it("Shadow", function (done) {
		var c = new createjs.Container();
		g = c.addChild(new createjs.Shape()).graphics;
		g.beginFill("#ff0000").drawRect(10, 10, 100, 100);
		c.shadow = new createjs.Shadow("#000000", 5, 5, 20);

		stage.addChild(c);

		compareBaseLine("assets/Shadow.png", done, expect);
	});

});
