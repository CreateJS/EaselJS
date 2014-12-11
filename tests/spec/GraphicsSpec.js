describe("Graphics", function () {

	beforeEach(function() {
		var shape = new createjs.Shape();
		this.g = shape.graphics;
		this.stage.addChild(shape);
	});

	it("arc()", function (done) {
		this.g.setStrokeStyle(2);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.moveTo(120, 100).arc(100, 100, 20, 0, Math.PI);

		this.compareBaseLine("assets/arc.png", done, expect, 0.01);
	});

	it("arcTo()", function (done) {
		this.g.setStrokeStyle(2);
		this.g.beginStroke(this.sColor);
		this.g.moveTo(25, 25).arcTo(150, 25, 150, 70, 50, Math.PI * 2);

		this.compareBaseLine("assets/arcTo.png", done, expect);
	});

	it("beginBitmapFill()", function (done) {
		this.g.beginBitmapFill(this.img).drawRect(5, 5, 100, 100);

		this.compareBaseLine("assets/beginBitmapFill.png", done, expect);
	});

	it("beginBitmapStroke()", function (done) {
		this.g.setStrokeStyle(10).beginBitmapStroke(this.img).drawRect(5, 5, 100, 100);

		this.compareBaseLine("assets/beginBitmapStroke.png", done, expect);
	});

	it("beginLinearGradientFill()", function (done) {
		this.g.beginLinearGradientFill([this.fColor, "rgba(0,0,0,1)"], [0, 1], 0, 0, 0, 130).drawRect(0, 0, 120, 120);

		this.compareBaseLine("assets/beginLinearGradientFill.png", done, expect);
	});

	it("beginLinearGradientStroke()", function (done) {
		this.g.beginLinearGradientStroke([this.sColor, "rgba(50, 50, 50, 1)"], [0, .4], 0, 0, 70, 140).moveTo(5, 25).lineTo(110, 25).endStroke();

		this.compareBaseLine("assets/beginLinearGradientStroke.png", done, expect);
	});

	it("beginRadialGradientFill()", function (done) {
		this.g.beginRadialGradientFill([this.fColor, "rgba(0,0,0,1)"], [0, 1], 0, 0, 0, 0, 0, 60).drawRect(40, 40, 40, 40);

		this.compareBaseLine("assets/beginRadialGradientFill.png", done, expect, 300);
	});

	it("beginRadialGradientStroke()", function (done) {
		this.g.setStrokeStyle(10).beginRadialGradientStroke(["#F00", "#00F"], [0, 1], 150, 150, 200, 100, 100, 25).drawRect(25, 25, 125, 125);

		this.compareBaseLine("assets/beginRadialGradientStroke.png", done, expect);
	});

	it("bezierCurveTo()", function (done) {
		this.g.beginFill(this.fColor).beginStroke(this.sColor).moveTo(25, 25).bezierCurveTo(45, 175, 125, 75, 25, 25);

		this.compareBaseLine("assets/bezierCurveTo.png", done, expect);
	});

	it("quadraticCurveTo() / curveTo()", function (done) {
		this.g.beginFill(this.fColor).beginStroke(this.sColor).moveTo(5, 5).quadraticCurveTo(200, 20, 190, 190).endStroke();

		this.compareBaseLine("assets/quadraticCurveTo.png", done, expect);
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

		this.stage.addChild(this.shape_10, this.shape_9, this.shape_8, this.shape_7, this.shape_6, this.shape_5, this.shape_4, this.shape_3, this.shape_2, this.shape_1, this.shape);

		this.compareBaseLine("assets/decodePath.png", done, expect, .01);
	});

	it("drawCircle()", function (done) {
		this.g.setStrokeStyle(2);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.drawCircle(100, 100, 50);
		this.g.endFill();

		this.compareBaseLine("assets/drawCircle.png", done, expect);
	});

	it("drawEllipse()", function (done) {
		this.g.setStrokeStyle(2);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.drawEllipse(25, 25, 75, 150);
		this.g.endFill();

		this.compareBaseLine("assets/drawEllipse.png", done, expect);
	});

	it("drawPolyStar()", function (done) {
		this.g.setStrokeStyle(2);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.drawPolyStar(100, 100, 75, 5, 0.6, -90);
		this.g.endFill();

		this.compareBaseLine("assets/drawPolyStar.png", done, expect);
	});

	it("drawRect()", function (done) {
		this.g.setStrokeStyle(1);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.drawRect(5, 5, 100, 100);
		this.g.endFill();

		this.compareBaseLine("assets/drawRect.png", done, expect);
	});

	it("drawRoundRect()", function (done) {
		this.g.setStrokeStyle(1);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.drawRoundRect(5, 5, 100, 100, 7);
		this.g.endFill();

		this.compareBaseLine("assets/drawRoundRect.png", done, expect);
	});

	it("drawRoundRectComplex()", function (done) {
		this.g.setStrokeStyle(1);
		this.g.beginStroke(this.sColor);
		this.g.beginFill(this.fColor);
		this.g.drawRoundRectComplex(5, 5, 100, 100, 5, 10, 15, 20);
		this.g.endFill();

		this.compareBaseLine("assets/drawRoundRectComplex.png", done, expect);
	});

	it("getHSL()", function () {
		expect(createjs.Graphics.getHSL(150, 100, 70)).toBe("hsl(150,100%,70%)");
	});

	it("getRGB()", function () {
		expect(createjs.Graphics.getRGB(50, 100, 150, 0.5)).toBe("rgba(50,100,150,0.5)");
		expect(createjs.Graphics.getRGB(0xFF00FF, 0.2)).toBe("rgba(255,0,255,0.2)");
	});

	it("isEmpty()", function () {
		expect(this.g.isEmpty()).toBe(true);
		this.g.drawRect(0, 0, 5, 5);
		expect(this.g.isEmpty()).toBe(false);
	});

	it("lineTo()", function (done) {
		this.g.beginStroke(this.sColor).moveTo(5, 35).lineTo(110, 75);

		this.compareBaseLine("assets/lineTo.png", done, expect);
	});

	it("setStrokeStyle()", function (done) {
		this.g.setStrokeStyle(25, 1, 1, 0, true).beginStroke(this.sColor, 1).moveTo(25, 25).lineTo(150, 150);

		this.compareBaseLine("assets/setStrokeStyle.png", done, expect);
	});

	describe("tiny api", function () {
		it('moveTo should equal mt', function () {
			expect(this.g['moveTo']).toBe(this.g['mt']);
		});

		it('arc should equal a', function () {
			expect(this.g['arc']).toBe(this.g['a']);
		});

		it('arcTo should equal at', function () {
			expect(this.g['arcTo']).toBe(this.g['at']);
		});

		it('quadraticCurveTo should equal qt', function () {
			expect(this.g['quadraticCurveTo']).toBe(this.g['qt']);
		});

		it('curveTo should equal qt', function () {
			expect(this.g['curveTo']).toBe(this.g['qt']);
		});

		it('closePath should equal cp', function () {
			expect(this.g['closePath']).toBe(this.g['cp']);
		});

		it('beginFill should equal f', function () {
			expect(this.g['beginFill']).toBe(this.g['f']);
		});

		it('beginLinearGradientFill should equal lf', function () {
			expect(this.g['beginLinearGradientFill']).toBe(this.g['lf']);
		});

		it('beginRadialGradientFill should equal rf', function () {
			expect(this.g['beginRadialGradientFill']).toBe(this.g['rf']);
		});

		it('beginBitmapFill should equal bf', function () {
			expect(this.g['beginBitmapFill']).toBe(this.g['bf']);
		});

		it('endFill should equal ef', function () {
			expect(this.g['endFill']).toBe(this.g['ef']);
		});

		it('setStrokeStyle should equal ss', function () {
			expect(this.g['setStrokeStyle']).toBe(this.g['ss']);
		});

		it('beginStroke should equal s', function () {
			expect(this.g['beginStroke']).toBe(this.g['s']);
		});

		it('beginLinearGradientStroke should equal ls', function () {
			expect(this.g['beginLinearGradientStroke']).toBe(this.g['ls']);
		});

		it('beginRadialGradientStroke should equal rs', function () {
			expect(this.g['beginRadialGradientStroke']).toBe(this.g['rs']);
		});

		it('beginBitmapStroke should equal bs', function () {
			expect(this.g['beginBitmapStroke']).toBe(this.g['bs']);
		});

		it('endStroke should equal es', function () {
			expect(this.g['endStroke']).toBe(this.g['es']);
		});

		it('drawRect should equal dr', function () {
			expect(this.g['drawRect']).toBe(this.g['dr']);
		});

		it('drawRoundRect should equal rr', function () {
			expect(this.g['drawRoundRect']).toBe(this.g['rr']);
		});

		it('drawRoundRectComplex should equal rc', function () {
			expect(this.g['drawRoundRectComplex']).toBe(this.g['rc']);
		});

		it('drawCircle should equal dc', function () {
			expect(this.g['drawCircle']).toBe(this.g['dc']);
		});

		it('drawEllipse should equal de', function () {
			expect(this.g['drawEllipse']).toBe(this.g['de']);
		});

		it('drawPolyStar should equal dp', function () {
			expect(this.g['drawPolyStar']).toBe(this.g['dp']);
		});

		it('decodePath should equal p', function () {
			expect(this.g['decodePath']).toBe(this.g['p']);
		});
	});
});
