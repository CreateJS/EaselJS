import Graphics from "../../../src/display/Graphics";
import Shape from "../../../src/display/Shape";
import Stage from "../../../src/display/Stage";

import globals from "../../setup";
import Canvas from "canvas-prebuilt";

describe("Graphics", () => {

	let stage, canvas, shape, g, image;

	beforeEach(async (done) => {
		canvas = new Canvas();
		canvas.width = canvas.height = 200;
		stage = new Stage(canvas);
		shape = new Shape();
		g = shape.graphics;
		stage.addChild(shape);
		image = new Canvas.Image();
		image.onload = () => { done(); }
		image.onerror = () => { done(`${image.src} failed to load`); }
		image.src = `${globals.rootPath}assets/art/daisy.png`;
	});

	it("arc()", done => {
		g.setStrokeStyle(2);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.moveTo(120, 100).arc(100, 100, 20, 0, Math.PI);

		globals.compareBaseLine(globals.rootPath + "tests/assets/arc.png", done, expect, canvas, 0.01);
	});

	it("arcTo()", done => {
		g.setStrokeStyle(2);
		g.beginStroke(globals.sColor);
		g.moveTo(25, 25).arcTo(150, 25, 150, 70, 50, Math.PI * 2);

		globals.compareBaseLine(globals.rootPath + "tests/assets/arcTo.png", done, expect, canvas);
	});

	it("beginBitmapFill()", done => {
		g.beginBitmapFill(image).drawRect(5, 5, 100, 100);

		globals.compareBaseLine(globals.rootPath + "tests/assets/beginBitmapFill.png", done, expect, canvas);
	});

	it("beginBitmapStroke()", done => {
		g.setStrokeStyle(10).beginBitmapStroke(image).drawRect(5, 5, 100, 100);

		globals.compareBaseLine(globals.rootPath + "tests/assets/beginBitmapStroke.png", done, expect, canvas);
	});

	it("beginLinearGradientFill()", done => {
		g.beginLinearGradientFill([globals.fColor, "rgba(0,0,0,1)"], [0, 1], 0, 0, 0, 130).drawRect(0, 0, 120, 120);

		globals.compareBaseLine(globals.rootPath + "tests/assets/beginLinearGradientFill.png", done, expect, canvas);
	});

	it("beginLinearGradientStroke()", done => {
		g.beginLinearGradientStroke([globals.sColor, "rgba(50, 50, 50, 1)"], [0, .4], 0, 0, 70, 140).moveTo(5, 25).lineTo(110, 25).endStroke();

		globals.compareBaseLine(globals.rootPath + "tests/assets/beginLinearGradientStroke.png", done, expect, canvas);
	});

	it("beginRadialGradientFill()", done => {
		g.beginRadialGradientFill([globals.fColor, "rgba(0,0,0,1)"], [0, 1], 0, 0, 0, 0, 0, 60).drawRect(40, 40, 40, 40);

		globals.compareBaseLine(globals.rootPath + "tests/assets/beginRadialGradientFill.png", done, expect, canvas, 300);
	});

	it("beginRadialGradientStroke()", done => {
		g.setStrokeStyle(10).beginRadialGradientStroke(["#F00", "#00F"], [0, 1], 150, 150, 200, 100, 100, 25).drawRect(25, 25, 125, 125);

		globals.compareBaseLine(globals.rootPath + "tests/assets/beginRadialGradientStroke.png", done, expect, canvas);
	});

	it("bezierCurveTo()", done => {
		g.beginFill(globals.fColor).beginStroke(globals.sColor).moveTo(25, 25).bezierCurveTo(45, 175, 125, 75, 25, 25);

		globals.compareBaseLine(globals.rootPath + "tests/assets/bezierCurveTo.png", done, expect, canvas, 0.008);
	});

	it("quadraticCurveTo() / curveTo()", done => {
		g.beginFill(globals.fColor).beginStroke(globals.sColor).moveTo(5, 5).quadraticCurveTo(200, 20, 190, 190).endStroke();

		globals.compareBaseLine(globals.rootPath + "tests/assets/quadraticCurveTo.png", done, expect, canvas, 0.008);
	});

	it("decodePath()", done => {
		let shape = new Shape();
		shape.graphics.f().s("#000000").ss(1, 1, 1).p("ACHjBQBuBMgyAlQggAXiOAVQiWAXgqATQhLAkBJBJQBKBLA+AEQArADAxglQAagUAsgkQAmgVAgAg");
		shape.setTransform(36.3, 38.9);

		let shape_1 = new Shape();
		shape_1.graphics.lf(["#21B573", "#209564"], [0, 1], 2.3, 43.2, 0.3, -53.1).s().p("AjRGeQgcgSgQgaIgDgFQgKgSgCgRIgBgJQgBgmAQgzIAEACQASAHAsgGQAdgEAEgfQADgSgEgYQAzgXA0gaQBpg1AAgLQAAgJgEgKQANgcARg0QAchUABgXQAAgLgLgLQgLgKgPgEQgPgDgLAFQgNAIgCATIABASQABAXgCAXQgDBFgYAhQgCACAAAFQgxALg9A2QgjAegZAeIgGgNQgLgQgOAAIAVgrQAuhQARghQASgjAHgVQADgNAAgIIAAgDQgBgMgMgXIAHgGQAhgeALgeIASgTIgPAYQA5hTAQgqQANglgEgzIABABQBEBIAOANQA1AwAgAxQBBBnACCEQACBFgTBKQgUBNgmBAQgLAUgNARQgqA6g0AkIAAgCQAUgPAQgQQAPgPACgHQgZAZgbATQACgoAGgNQAHgQgBgVQgBgagRgLQgKgGgPgBQgQgCgNAFQgfAMAJAsIAXBsQgbANgcAIIgTAEIAAADIATgCIgKACQgcAGgbAAQg+AAgvgfgAjYCDQAMgBAIADQAGAggrAGIARgog");
		shape_1.setTransform(119.7, 119.2);

		let shape_2 = new Shape();
		shape_2.graphics.lf(["#21B174", "#20B669"], [0, 1], 3, 43.2, -7.9, -37.3).s().p("ABvGJQgjgagdgDQgrgHhrgKIhYgIIgwgDQhKgCgXABQhAAAgJAKIgHgBQgZgEgDgOQgBgJAQgPQAUgTAMgaIAmhUIATgqQADgLAbgdIAbgdQBHgpAzgqQAwghB/glQgQgLgsANQgoALgzAcIgSAKQAsglAPgYIBQiEQASggAeghQAngfA1guQAmggAWgCQAZgCAdAiQAaAeAyBXQAmBBArB+IAFAOIgnhdIgDgGQAUBOAgBRQAXA7AIA6IABAHQAHA8gLApQgLAjgoBEIgSATQgdAcglALQgQAFgRACQhAAKghABIgBAAIgCABIgHAAQgbAAgZgRgAAFANQhCAJgnAzQglAuAGA5QAGA7AzAgQA6AlBggNQA0gHAdgjQAggmgIg6QgCgLgKgWQgOgcgTgXQgxg6hBAAIgVACgAl+FaIgGAAIAGAAIAyAAIgJAAIgWAAIgTAAg");
		shape_2.setTransform(77.5, 60.2);

		let shape_3 = new Shape();
		shape_3.graphics.f("#CCCEAA").s().p("AAKA1IgKgGQgFgEAAgEQABgDAGgBIAEgBIAJABQAGABAEAEQACACAAADIgBACIgBAEIgBAAIgEADIgDABQgEAAgDgCgAgFAUIgQgKQgJgGABgEQABgEAMgBIAKgBIAHABQAIABAEAEQAEAFgBAHQgCAFgHADQgDACgEAAIgFgCgAADgbQgCgDADgHQACgGAFgGQADgEAFgBIADAAQADAAACACQADAEAAAEQgBAGgEADIgGADQgJAGgEAAIgDgBg");
		shape_3.setTransform(91.6, 137.2);

		let shape_4 = new Shape();
		shape_4.graphics.f("#000000").s().p("AgJALQgGgEgBgGQAAgDAEgFQAEgFAIgBQAFgBAGAEQAFADABAGQABAEgFAFQgEAEgIABIgBABQgFAAgEgDg");
		shape_4.setTransform(84.7, 79.9);

		let shape_5 = new Shape();
		shape_5.graphics.f("#FFFFFF").s().p("AhFBqQg7gYgIg8QgJg/AmgoQAigjA5gDQA2gDArAeQAwAhAIA6QAHAugYAgQgYAigzAHQgUACgTAAQgoAAgjgOgAArAaQgIABgEAFQgEAFAAAFQABAGAFAEQAGADAHgBQAHgBAFgEQAEgFgBgGQAAgGgGgDQgEgDgFAAIgDAAg");
		shape_5.setTransform(80.3, 75.8);

		let shape_6 = new Shape();
		shape_6.graphics.f("#21965E").s().p("AB6DbQhpgIhigOQkggngGgtIAAgEIApAAIAJAAIAZAAIAhAAIAlABQAhABBoAJQBtAJAqAGQAUADAPAIIAWAPQAXARAngGIACAAIABAAQAhgCBAgJQARgCAQgFQAlgMAdgcQgKAfgiAeIgHAGQguAmgwAGIgKAAQgZAAhKgGgAhDAeQgzgfgGg7QgGg4AlgvQAngyBCgKQBPgKA4BCQATAXAOAcQAKAWACAMQAIA6ggAjQgdAkg0AHQgaADgWAAQg/AAgrgbgAARjIQg3ADgiAjQgmAoAJBBQAIA6A7AYQAwAVBCgJQAzgHAYggQAYgggHgwQgIg6gwghQgngbgyAAIgKAAg");
		shape_6.setTransform(76.8, 83.9);

		let shape_7 = new Shape();
		shape_7.graphics.f("#1C7C4A").s().p("AGrLJQACgNAMgMQAZgYA4AJQg3gEgUAWQgKALABALgAj8KpQABgMALgKQAWgUAwAIQgvgEgSATQgIAJABAKgAD/HUIATgEQAcgIAdgNIABAHIAAABQgYALgaAGIgIAAIgTADgAGDGZQAcgTAZgYQgDAGgPAQQgQAPgUAPIABgJgAAjD0IAAAAIAAgBIgDgHIAeAEQAgACAPgCIgTAFQgOACgQAAIgZgDgAgCieIgWgOQgPgJgUgDQgpgGhwgJQhogJghAAIglgCIghAAIgYAAIgzgBIgFAAIgJAAIgNAAQAJgKBAgBQAXAABLACIAvADIBYAIQBuAKArAGQAcAEAiAaQAcATAfgDIgUACQgaAAgPgNgAEUjfQAnhEALgkQALgogGg9IgBgHQgJg5gXg8QgfhSgVhOIADAGIAnBdIALAbQAjBXAIA/IADAYQADAygNAmQgPAqg8BTIAQgYgAlTooQAhgYAngXIASgKQAzgbAogLQAtgNARALQiAAlgxAhQgzAshHApIgCABQAPgZArgig");
		shape_7.setTransform(88.7, 116);

		let shape_8 = new Shape();
		shape_8.graphics.f("#21B573").s().p("AipDqIgKAFIgjgWIgCgBQAAgFgCgEQgGgbAEg5IAAgEQA1gkApg5QAKAoAbAtQALASAOAIQAHAEAQAFIAHACIAHAAIAuAJQBbAHBGgxQBDgvAThKQARg/gQhAQgRhKg4gFQgpgCghA5IgWAuQgMAbgEAGIgBgVQABgTAIgdQAIghApgmQApgnAaACQAbACAoApQAmAoAFAbQANAlgHA7QgEAhgOAyQgeB3i2BBQg+AWhBAMIgcAFQhBgjgpAMgAkTC6IgxgUQAZgFAZgLIAKApIgLgFg");
		shape_8.setTransform(149.5, 146.1);

		let shape_9 = new Shape();
		shape_9.graphics.f("#37CE83").s().p("ACFMuQAAAAAAAAQgBgBAAAAQAAgBgBAAQAAgBAAAAQAKgSAjgYQA2giBAgEIiXg6IACgGQgFgLgPhAIgKgpIgBgBIgBgHIgZhtQgJgrAhgMQANgFAQACQAPAAAKAHQARALABAZQACAWgIAQQgFANgDAnIgBAJIAAADIAAADQgEA5AGAbQACAEAAAFQACASgIAPIAEABQAJABAKgDIAUgJIAKgFQApgLBBAiQAZAOAdAUQAmAbAfAeQAcAdAEALQABAEgFADIgCABIgNAIQgIAFiaADIieACQgHAAgCgBgADgMUQgNAMgBANIALAAQgBgLAJgLQAVgWA3AEQgPgCgNAAQgjAAgSARgAoWMOQgBgBAAAAQAAAAAAAAQgBgBAAAAQAAgBAAgBQAIgOAegVQAugeA3gBQA3gDA5AZIAdAOIAJhtIANiUIABAAIAAgBQACgEA5gZQACASAKARQgJADgGADQgSAIgRgEIABABQABAIAEAHIARATQAZAmghBcQgMAigQAeIgPAYIACABQgBAFgDACIgMAHQgHAFiCACIiIACQgGAAgBgBgAnJL3QgLAKgBAMIAJAAQgBgKAJgJQARgTAvAEQgNgDgLAAQgdAAgQAPgAriCvICkiMIC5BwIgyDUIjYARgAicFtIgFgCIAAAAIAAAAIACgEIAAgDQAAgCgCgCQgDgEgGgCIgJAAIgBgCIAYADQARAAAOgCIATgFQgQACgfgCIgegEIACAHIgFgJQAEAAAEgCQAHgEABgEQACgHgFgGQgEgFgIgBIgJgBIAAgCQAaAEAYgCIAEgBQArgGgFghQgIgCgNABIgEAAQgXAEgRAMIAAgBIAGgEQAFgDAAgFQABgEgDgEQgCgCgEAAQAEgHAHgEQAPgKAagCIAEAAQAOAAALAQIAHANQAZgfAigdQA8g2AzgLQgBgGACgEQAYggAEhFQABgXAAgVIgCgSQADgTAMgIQALgFAQADQAOAEALAKQALAKAAAMQAAAXgcBSQgSA0gMAdQAEAKAAAKQgBALhrA1QgxAag0AXQAFAYgDASQgFAfgdAEQgTADgOAAQgSAAgKgFgAADgEIAAAEQAAAFgDAOQgCgPAFgIgAHbifQguguAAhAQAAhAAugtQAtguBAAAQBAAAAuAuQAtAtAABAQAABAgtAuQguAthAAAQhAAAgtgtgAENoCIAAksIFyAAIAAEsg");
		shape_9.setTransform(110.4, 106);

		let shape_10 = new Shape();
		shape_10.graphics.f("#CC0000").s().p("AMnDfQAGgpARgmQAMgeAAgfQAAgxgdg7QgZg4gagRQgvgfgSgJQgsgZgmgDQh9gNjAgOIiqgNIiUAAIgGADInxABQhkATg4AJQhTALhPgBQgPAAgFgGQADgPBygMQCpgPA7gMIHogCQAHgCAAAAICPAAQAJABCiAIQDDAKCaAUQAiAFApAdQAYAPAuAjQAZAQAMAaIAWA3QAQArAAAyQAAA5gDALQgGAegkAvQgHgDgDgEg");
		shape_10.setTransform(103.6, 30.5);

		stage.addChild(shape_10, shape_9, shape_8, shape_7, shape_6, shape_5, shape_4, shape_3, shape_2, shape_1, shape);

		globals.compareBaseLine(globals.rootPath + "tests/assets/decodePath.png", done, expect, canvas, .01);
	});

	it("drawCircle()", done => {
		g.setStrokeStyle(2);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawCircle(100, 100, 50);
		g.endFill();

		globals.compareBaseLine(globals.rootPath + "tests/assets/drawCircle.png", done, expect, canvas);
	});

	it("drawEllipse()", done => {
		g.setStrokeStyle(2);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawEllipse(25, 25, 75, 150);
		g.endFill();

		globals.compareBaseLine(globals.rootPath + "tests/assets/drawEllipse.png", done, expect, canvas);
	});

	it("drawPolyStar()", done => {
		g.setStrokeStyle(2);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawPolyStar(100, 100, 75, 5, 0.6, -90);
		g.endFill();

		globals.compareBaseLine(globals.rootPath + "tests/assets/drawPolyStar.png", done, expect, canvas);
	});

	it("drawRect()", done => {
		g.setStrokeStyle(1);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawRect(5, 5, 100, 100);
		g.endFill();

		globals.compareBaseLine(globals.rootPath + "tests/assets/drawRect.png", done, expect, canvas);
	});

	it("drawRoundRect()", done => {
		g.setStrokeStyle(1);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawRoundRect(5, 5, 100, 100, 7);
		g.endFill();

		globals.compareBaseLine(globals.rootPath + "tests/assets/drawRoundRect.png", done, expect, canvas);
	});

	it("drawRoundRectComplex()", done => {
		g.setStrokeStyle(1);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawRoundRectComplex(5, 5, 100, 100, 5, 10, 15, 20);
		g.endFill();

		globals.compareBaseLine(globals.rootPath + "tests/assets/drawRoundRectComplex.png", done, expect, canvas);
	});

	it("getHSL()", () => {
		expect(Graphics.getHSL(150, 100, 70)).toBe("hsl(150,100%,70%)");
	});

	it("getRGB()", () => {
		expect(Graphics.getRGB(50, 100, 150, 0.5)).toBe("rgba(50,100,150,0.5)");
		expect(Graphics.getRGB(0xFF00FF, 0.2)).toBe("rgba(255,0,255,0.2)");
	});

	it("isEmpty()", () => {
		expect(g.isEmpty()).toBeTruthy();
		g.drawRect(0, 0, 5, 5);
		expect(g.isEmpty()).toBeFalsy();
	});

	it("lineTo()", done => {
		g.beginStroke(globals.sColor).moveTo(5, 35).lineTo(110, 75);

		globals.compareBaseLine(globals.rootPath + "tests/assets/lineTo.png", done, expect, canvas);
	});

	it("setStrokeStyle()", done => {
		g.setStrokeStyle(25, 1, 1, 0, true).beginStroke(globals.sColor, 1).moveTo(25, 25).lineTo(150, 150);

		globals.compareBaseLine(globals.rootPath + "tests/assets/setStrokeStyle.png", done, expect, canvas);
	});

	it("setStrokeDash()", done => {
		g.setStrokeDash([7, 3]);
		g.setStrokeStyle(5).beginStroke("black").rect(10, 10, 150, 150);
		globals.compareBaseLine(globals.rootPath + "tests/assets/setStrokeDash.png", done, expect, canvas, 0.008);
	});

	it("clone()", done => {
		g.setStrokeStyle(2);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.moveTo(120, 100).arc(100, 100, 20, 0, Math.PI);
		g = g.clone();

		globals.compareBaseLine(globals.rootPath + "tests/assets/arc.png", done, expect, canvas, 0.01);
	});

	describe("tiny api", () => {
		it('moveTo should equal mt', () => {
			expect(g['moveTo']).toBe(g['mt']);
		});

		it('arc should equal a', () => {
			expect(g['arc']).toBe(g['a']);
		});

		it('arcTo should equal at', () => {
			expect(g['arcTo']).toBe(g['at']);
		});

		it('quadraticCurveTo should equal qt', () => {
			expect(g['quadraticCurveTo']).toBe(g['qt']);
		});

		it('curveTo should equal qt', () => {
			expect(g['curveTo']).toBe(g['qt']);
		});

		it('closePath should equal cp', () => {
			expect(g['closePath']).toBe(g['cp']);
		});

		it('beginFill should equal f', () => {
			expect(g['beginFill']).toBe(g['f']);
		});

		it('beginLinearGradientFill should equal lf', () => {
			expect(g['beginLinearGradientFill']).toBe(g['lf']);
		});

		it('beginRadialGradientFill should equal rf', () => {
			expect(g['beginRadialGradientFill']).toBe(g['rf']);
		});

		it('beginBitmapFill should equal bf', () => {
			expect(g['beginBitmapFill']).toBe(g['bf']);
		});

		it('endFill should equal ef', () => {
			expect(g['endFill']).toBe(g['ef']);
		});

		it('setStrokeStyle should equal ss', () => {
			expect(g['setStrokeStyle']).toBe(g['ss']);
		});

		it('beginStroke should equal s', () => {
			expect(g['beginStroke']).toBe(g['s']);
		});

		it('beginLinearGradientStroke should equal ls', () => {
			expect(g['beginLinearGradientStroke']).toBe(g['ls']);
		});

		it('beginRadialGradientStroke should equal rs', () => {
			expect(g['beginRadialGradientStroke']).toBe(g['rs']);
		});

		it('beginBitmapStroke should equal bs', () => {
			expect(g['beginBitmapStroke']).toBe(g['bs']);
		});

		it('endStroke should equal es', () => {
			expect(g['endStroke']).toBe(g['es']);
		});

		it('drawRect should equal dr', () => {
			expect(g['drawRect']).toBe(g['dr']);
		});

		it('drawRoundRect should equal rr', () => {
			expect(g['drawRoundRect']).toBe(g['rr']);
		});

		it('drawRoundRectComplex should equal rc', () => {
			expect(g['drawRoundRectComplex']).toBe(g['rc']);
		});

		it('drawCircle should equal dc', () => {
			expect(g['drawCircle']).toBe(g['dc']);
		});

		it('drawEllipse should equal de', () => {
			expect(g['drawEllipse']).toBe(g['de']);
		});

		it('drawPolyStar should equal dp', () => {
			expect(g['drawPolyStar']).toBe(g['dp']);
		});

		it('decodePath should equal p', () => {
			expect(g['decodePath']).toBe(g['p']);
		});
	});
});
