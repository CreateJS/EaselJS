describe("Filters", function () {

	it("AlphaMaskFilter", function (done) {
		var width = this.img.width;
		var height = this.img.height;

		var bmp2 = new createjs.Bitmap(this.img);

		var maskShape = new createjs.Shape();
		var g = maskShape.graphics;
		g.beginLinearGradientFill(["rgba(255,255,255,1)", "rgba(255,255,255,0)"], [0, 1], 0, 0, 0, 35)
		g.drawRect(0, 0, width, height);
		g.endFill();

		maskShape.cache(0, 0, width, height);

		var amf = new createjs.AlphaMaskFilter(maskShape.cacheCanvas);
		bmp2.filters = [amf];
		bmp2.cache(0, 0, width, height);
		this.stage.addChild(bmp2);

		this.stage.update();
		this.compareBaseLine("assets/AlphaMaskFilter.png", done, expect, .01);

		expect(amf.clone().mask).toBe(maskShape.cacheCanvas);
	});

	it("AlphaMapFilter", function (done) {
		var width = this.img.width;
		var height = this.img.height;

		var bmp2 = new createjs.Bitmap(this.img);

		var maskShape = new createjs.Shape();
		g = maskShape.graphics;
		g.beginLinearGradientFill(["rgba(255,255,255,1)", "rgba(255,255,255,0)"], [0, 1], 0, 0, 0, 100)
		g.drawRect(0, 0, width, height);
		g.endFill();

		maskShape.cache(0, 0, width, height);

		var amf = new createjs.AlphaMapFilter(maskShape.cacheCanvas);
		bmp2.filters = [amf];
		bmp2.cache(0, 0, width, height);
		this.stage.addChild(bmp2);

		this.compareBaseLine("assets/AlphaMapFilter.png", done, expect);

		expect(amf.clone().alphaMap).toBe(maskShape.cacheCanvas);
	});

	it("BlurFilter", function (done) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill("#ff0000").drawCircle(50, 75, 25);

		var blurFilter = new createjs.BlurFilter(10, 50, 2);
		shape.filters = [blurFilter];
		var bounds = blurFilter.getBounds();

		this.stage.addChild(shape);

		shape.cache(0, 0, 100, 100);

		this.compareBaseLine("assets/BlurFilter.png", done, expect, 0.01);

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
		this.stage.addChild(shape);

		this.compareBaseLine("assets/ColorFilter.png", done, expect, 0.01);

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
		var bmp = new createjs.Bitmap(this.img).set({x: 25, y: 25});

		var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
		var cmf = new createjs.ColorMatrixFilter(matrix);
		bmp.filters = [cmf];

		bmp.cache(0, 0, 100, 100);

		this.stage.addChild(bmp);

		this.compareBaseLine("assets/ColorMatrixFilter.png", done, expect);

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

		this.stage.addChild(c);

		this.compareBaseLine("assets/Shadow.png", done, expect);
	});

});
