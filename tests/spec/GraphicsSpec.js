describe("Graphics", function () {
	var sColor = "#000";
	var fColor = "#ff0000";
	var g;
	var stage;
	var img;

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

	it("arc()", function (done) {
		g.setStrokeStyle(2);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.moveTo(120, 100).arc(100, 100, 20, 0, Math.PI);

		compareBaseLine("assets/arc.png", done, expect);
	});

	it("arcTo()", function (done) {
		g.setStrokeStyle(2);
		g.beginStroke(sColor);
		g.moveTo(25, 25).arcTo(150, 25, 150, 70, 50, Math.PI * 2);

		compareBaseLine("assets/arcTo.png", done, expect);
	});

	it("beginBitmapFill()", function (done) {
		g.beginBitmapFill(img).drawRect(5, 5, 100, 100);

		compareBaseLine("assets/beginBitmapFill.png", done, expect);
	});

	it("beginBitmapStroke()", function (done) {
		g.setStrokeStyle(10).beginBitmapStroke(img).drawRect(5, 5, 100, 100);

		compareBaseLine("assets/beginBitmapStroke.png", done, expect);
	});

	it("beginLinearGradientFill()", function (done) {
		g.beginLinearGradientFill([fColor, "rgba(0,0,0,1)"], [0, 1], 0, 0, 0, 130).drawRect(0, 0, 120, 120);

		compareBaseLine("assets/beginLinearGradientFill.png", done, expect);
	});

	it("beginLinearGradientStroke()", function (done) {
		g.beginLinearGradientStroke([sColor, "rgba(50, 50, 50, 1)"], [0, .4], 0, 0, 70, 140).moveTo(5, 25).lineTo(110, 25).endStroke();

		compareBaseLine("assets/beginLinearGradientStroke.png", done, expect);
	});

	it("beginRadialGradientFill()", function (done) {
		g.beginRadialGradientFill([fColor, "rgba(0,0,0,1)"], [0, 1], 0, 0, 0, 0, 0, 60).drawRect(40, 40, 40, 40);

		compareBaseLine("assets/beginRadialGradientFill.png", done, expect, 300);
	});

	it("beginRadialGradientStroke()", function (done) {
		g.setStrokeStyle(10).beginRadialGradientStroke(["#F00", "#00F"], [0, 1], 150, 150, 200, 100, 100, 25).drawRect(25, 25, 125, 125);

		compareBaseLine("assets/beginRadialGradientStroke.png", done, expect);
	});

	it("bezierCurveTo()", function (done) {
		g.beginFill(fColor).beginStroke(sColor).moveTo(25, 25).bezierCurveTo(45, 175, 125, 75, 25, 25);

		compareBaseLine("assets/bezierCurveTo.png", done, expect);
	});

	it("quadraticCurveTo() / curveTo()", function (done) {
		g.beginFill(fColor).beginStroke(sColor).moveTo(5, 5).quadraticCurveTo(200, 20, 190, 190).endStroke();

		compareBaseLine("assets/quadraticCurveTo.png", done, expect);
	});

	it("decodePath()", function (done) {
		var cjs = createjs;
		this.shape = new cjs.Shape();
		this.shape.graphics.f().s("#000000").ss(1, 1, 1).p("ACHjBQBuBMgyAlQggAXiOAVQiWAXgqATQhLAkBJBJQBKBLA+AEQArADAxglQAagUAsgkQAmgVAgAg");
		this.shape.setTransform(36.3, 38.9);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.lf(["#21B573", "#209564"], [0, 1], 2.3, 43.2, 0.3, -53.1).s().p("AjRGeQgcgSgQgaIgDgFQgKgSgCgRIgBgJQgBgmAQgzIAEACQASAHAsgGQAdgEAEgfQADgSgEgYQAzgXA0gaQBpg1AAgLQAAgJgEgKQANgcARg0QAchUABgXQAAgLgLgLQgLgKgPgEQgPgDgLAFQgNAIgCATIABASQABAXgCAXQgDBFgYAhQgCACAAAFQgxALg9A2QgjAegZAeIgGgNQgLgQgOAAIAVgrQAuhQARghQASgjAHgVQADgNAAgIIAAgDQgBgMgMgXIAHgGQAhgeALgeIASgTIgPAYQA5hTAQgqQANglgEgzIABABQBEBIAOANQA1AwAgAxQBBBnACCEQACBFgTBKQgUBNgmBAQgLAUgNARQgqA6g0AkIAAgCQAUgPAQgQQAPgPACgHQgZAZgbATQACgoAGgNQAHgQgBgVQgBgagRgLQgKgGgPgBQgQgCgNAFQgfAMAJAsIAXBsQgbANgcAIIgTAEIAAADIATgCIgKACQgcAGgbAAQg+AAgvgfgAjYCDQAMgBAIADQAGAggrAGIARgog");
		this.shape_1.setTransform(119.7, 119.2);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.lf(["#21B174", "#20B669"], [0, 1], 3, 43.2, -7.9, -37.3).s().p("ABvGJQgjgagdgDQgrgHhrgKIhYgIIgwgDQhKgCgXABQhAAAgJAKIgHgBQgZgEgDgOQgBgJAQgPQAUgTAMgaIAmhUIATgqQADgLAbgdIAbgdQBHgpAzgqQAwghB/glQgQgLgsANQgoALgzAcIgSAKQAsglAPgYIBQiEQASggAeghQAngfA1guQAmggAWgCQAZgCAdAiQAaAeAyBXQAmBBArB+IAFAOIgnhdIgDgGQAUBOAgBRQAXA7AIA6IABAHQAHA8gLApQgLAjgoBEIgSATQgdAcglALQgQAFgRACQhAAKghABIgBAAIgCABIgHAAQgbAAgZgRgAAFANQhCAJgnAzQglAuAGA5QAGA7AzAgQA6AlBggNQA0gHAdgjQAggmgIg6QgCgLgKgWQgOgcgTgXQgxg6hBAAIgVACgAl+FaIgGAAIAGAAIAyAAIgJAAIgWAAIgTAAg");
		this.shape_2.setTransform(77.5, 60.2);

		this.shape_3 = new cjs.Shape();
		this.shape_3.graphics.f("#CCCEAA").s().p("AAKA1IgKgGQgFgEAAgEQABgDAGgBIAEgBIAJABQAGABAEAEQACACAAADIgBACIgBAEIgBAAIgEADIgDABQgEAAgDgCgAgFAUIgQgKQgJgGABgEQABgEAMgBIAKgBIAHABQAIABAEAEQAEAFgBAHQgCAFgHADQgDACgEAAIgFgCgAADgbQgCgDADgHQACgGAFgGQADgEAFgBIADAAQADAAACACQADAEAAAEQgBAGgEADIgGADQgJAGgEAAIgDgBg");
		this.shape_3.setTransform(91.6, 137.2);

		this.shape_4 = new cjs.Shape();
		this.shape_4.graphics.f("#000000").s().p("AgJALQgGgEgBgGQAAgDAEgFQAEgFAIgBQAFgBAGAEQAFADABAGQABAEgFAFQgEAEgIABIgBABQgFAAgEgDg");
		this.shape_4.setTransform(84.7, 79.9);

		this.shape_5 = new cjs.Shape();
		this.shape_5.graphics.f("#FFFFFF").s().p("AhFBqQg7gYgIg8QgJg/AmgoQAigjA5gDQA2gDArAeQAwAhAIA6QAHAugYAgQgYAigzAHQgUACgTAAQgoAAgjgOgAArAaQgIABgEAFQgEAFAAAFQABAGAFAEQAGADAHgBQAHgBAFgEQAEgFgBgGQAAgGgGgDQgEgDgFAAIgDAAg");
		this.shape_5.setTransform(80.3, 75.8);

		this.shape_6 = new cjs.Shape();
		this.shape_6.graphics.f("#21965E").s().p("AB6DbQhpgIhigOQkggngGgtIAAgEIApAAIAJAAIAZAAIAhAAIAlABQAhABBoAJQBtAJAqAGQAUADAPAIIAWAPQAXARAngGIACAAIABAAQAhgCBAgJQARgCAQgFQAlgMAdgcQgKAfgiAeIgHAGQguAmgwAGIgKAAQgZAAhKgGgAhDAeQgzgfgGg7QgGg4AlgvQAngyBCgKQBPgKA4BCQATAXAOAcQAKAWACAMQAIA6ggAjQgdAkg0AHQgaADgWAAQg/AAgrgbgAARjIQg3ADgiAjQgmAoAJBBQAIA6A7AYQAwAVBCgJQAzgHAYggQAYgggHgwQgIg6gwghQgngbgyAAIgKAAg");
		this.shape_6.setTransform(76.8, 83.9);

		this.shape_7 = new cjs.Shape();
		this.shape_7.graphics.f("#1C7C4A").s().p("AGrLJQACgNAMgMQAZgYA4AJQg3gEgUAWQgKALABALgAj8KpQABgMALgKQAWgUAwAIQgvgEgSATQgIAJABAKgAD/HUIATgEQAcgIAdgNIABAHIAAABQgYALgaAGIgIAAIgTADgAGDGZQAcgTAZgYQgDAGgPAQQgQAPgUAPIABgJgAAjD0IAAAAIAAgBIgDgHIAeAEQAgACAPgCIgTAFQgOACgQAAIgZgDgAgCieIgWgOQgPgJgUgDQgpgGhwgJQhogJghAAIglgCIghAAIgYAAIgzgBIgFAAIgJAAIgNAAQAJgKBAgBQAXAABLACIAvADIBYAIQBuAKArAGQAcAEAiAaQAcATAfgDIgUACQgaAAgPgNgAEUjfQAnhEALgkQALgogGg9IgBgHQgJg5gXg8QgfhSgVhOIADAGIAnBdIALAbQAjBXAIA/IADAYQADAygNAmQgPAqg8BTIAQgYgAlTooQAhgYAngXIASgKQAzgbAogLQAtgNARALQiAAlgxAhQgzAshHApIgCABQAPgZArgig");
		this.shape_7.setTransform(88.7, 116);

		this.shape_8 = new cjs.Shape();
		this.shape_8.graphics.f("#21B573").s().p("AipDqIgKAFIgjgWIgCgBQAAgFgCgEQgGgbAEg5IAAgEQA1gkApg5QAKAoAbAtQALASAOAIQAHAEAQAFIAHACIAHAAIAuAJQBbAHBGgxQBDgvAThKQARg/gQhAQgRhKg4gFQgpgCghA5IgWAuQgMAbgEAGIgBgVQABgTAIgdQAIghApgmQApgnAaACQAbACAoApQAmAoAFAbQANAlgHA7QgEAhgOAyQgeB3i2BBQg+AWhBAMIgcAFQhBgjgpAMgAkTC6IgxgUQAZgFAZgLIAKApIgLgFg");
		this.shape_8.setTransform(149.5, 146.1);

		this.shape_9 = new cjs.Shape();
		this.shape_9.graphics.f("#37CE83").s().p("ACFMuQAAAAAAAAQgBgBAAAAQAAgBgBAAQAAgBAAAAQAKgSAjgYQA2giBAgEIiXg6IACgGQgFgLgPhAIgKgpIgBgBIgBgHIgZhtQgJgrAhgMQANgFAQACQAPAAAKAHQARALABAZQACAWgIAQQgFANgDAnIgBAJIAAADIAAADQgEA5AGAbQACAEAAAFQACASgIAPIAEABQAJABAKgDIAUgJIAKgFQApgLBBAiQAZAOAdAUQAmAbAfAeQAcAdAEALQABAEgFADIgCABIgNAIQgIAFiaADIieACQgHAAgCgBgADgMUQgNAMgBANIALAAQgBgLAJgLQAVgWA3AEQgPgCgNAAQgjAAgSARgAoWMOQgBgBAAAAQAAAAAAAAQgBgBAAAAQAAgBAAgBQAIgOAegVQAugeA3gBQA3gDA5AZIAdAOIAJhtIANiUIABAAIAAgBQACgEA5gZQACASAKARQgJADgGADQgSAIgRgEIABABQABAIAEAHIARATQAZAmghBcQgMAigQAeIgPAYIACABQgBAFgDACIgMAHQgHAFiCACIiIACQgGAAgBgBgAnJL3QgLAKgBAMIAJAAQgBgKAJgJQARgTAvAEQgNgDgLAAQgdAAgQAPgAriCvICkiMIC5BwIgyDUIjYARgAicFtIgFgCIAAAAIAAAAIACgEIAAgDQAAgCgCgCQgDgEgGgCIgJAAIgBgCIAYADQARAAAOgCIATgFQgQACgfgCIgegEIACAHIgFgJQAEAAAEgCQAHgEABgEQACgHgFgGQgEgFgIgBIgJgBIAAgCQAaAEAYgCIAEgBQArgGgFghQgIgCgNABIgEAAQgXAEgRAMIAAgBIAGgEQAFgDAAgFQABgEgDgEQgCgCgEAAQAEgHAHgEQAPgKAagCIAEAAQAOAAALAQIAHANQAZgfAigdQA8g2AzgLQgBgGACgEQAYggAEhFQABgXAAgVIgCgSQADgTAMgIQALgFAQADQAOAEALAKQALAKAAAMQAAAXgcBSQgSA0gMAdQAEAKAAAKQgBALhrA1QgxAag0AXQAFAYgDASQgFAfgdAEQgTADgOAAQgSAAgKgFgAADgEIAAAEQAAAFgDAOQgCgPAFgIgAHbifQguguAAhAQAAhAAugtQAtguBAAAQBAAAAuAuQAtAtAABAQAABAgtAuQguAthAAAQhAAAgtgtgAENoCIAAksIFyAAIAAEsg");
		this.shape_9.setTransform(110.4, 106);

		this.shape_10 = new cjs.Shape();
		this.shape_10.graphics.f("#CC0000").s().p("AMnDfQAGgpARgmQAMgeAAgfQAAgxgdg7QgZg4gagRQgvgfgSgJQgsgZgmgDQh9gNjAgOIiqgNIiUAAIgGADInxABQhkATg4AJQhTALhPgBQgPAAgFgGQADgPBygMQCpgPA7gMIHogCQAHgCAAAAICPAAQAJABCiAIQDDAKCaAUQAiAFApAdQAYAPAuAjQAZAQAMAaIAWA3QAQArAAAyQAAA5gDALQgGAegkAvQgHgDgDgEg");
		this.shape_10.setTransform(103.6, 30.5);

		stage.addChild(this.shape_10, this.shape_9, this.shape_8, this.shape_7, this.shape_6, this.shape_5, this.shape_4, this.shape_3, this.shape_2, this.shape_1, this.shape);

		compareBaseLine("assets/decodePath.png", done, expect, .01);
	});

	it("drawCircle()", function (done) {
		g.setStrokeStyle(2);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawCircle(100, 100, 50);
		g.endFill();

		compareBaseLine("assets/drawCircle.png", done, expect);
	});

	it("drawEllipse()", function (done) {
		g.setStrokeStyle(2);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawEllipse(25, 25, 75, 150);
		g.endFill();

		compareBaseLine("assets/drawEllipse.png", done, expect);
	});

	it("drawPolyStar()", function (done) {
		g.setStrokeStyle(2);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawPolyStar(100, 100, 75, 5, 0.6, -90);
		g.endFill();

		compareBaseLine("assets/drawPolyStar.png", done, expect);
	});

	it("drawRect()", function (done) {
		g.setStrokeStyle(1);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawRect(5, 5, 100, 100);
		g.endFill();

		compareBaseLine("assets/drawRect.png", done, expect);
	});

	it("drawRoundRect()", function (done) {
		g.setStrokeStyle(1);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawRoundRect(5, 5, 100, 100, 7);
		g.endFill();

		compareBaseLine("assets/drawRoundRect.png", done, expect);
	});

	it("drawRoundRectComplex()", function (done) {
		g.setStrokeStyle(1);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawRoundRectComplex(5, 5, 100, 100, 5, 10, 15, 20);
		g.endFill();

		compareBaseLine("assets/drawRoundRectComplex.png", done, expect);
	});

	it("getHSL()", function () {
		expect(createjs.Graphics.getHSL(150, 100, 70)).toBe("hsl(150,100%,70%)");
	});

	it("getRGB()", function () {
		expect(createjs.Graphics.getRGB(50, 100, 150, 0.5)).toBe("rgba(50,100,150,0.5)");
		expect(createjs.Graphics.getRGB(0xFF00FF, 0.2)).toBe("rgba(255,0,255,0.2)");
	});

	it("isEmpty()", function () {
		expect(g.isEmpty()).toBe(true);
		g.drawRect(0, 0, 5, 5);
		expect(g.isEmpty()).toBe(false);
	});

	it("lineTo()", function (done) {
		g.beginStroke(sColor).moveTo(5, 35).lineTo(110, 75);

		compareBaseLine("assets/lineTo.png", done, expect);
	});

	it("setStrokeStyle()", function (done) {
		g.setStrokeStyle(25, 1, 1, 0, true).beginStroke(sColor).rect(30, 30, 100, 100);

		compareBaseLine("assets/setStrokeStyle.png", done, expect);
	});
});
