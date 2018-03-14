import Bitmap from "../../../src/display/Bitmap";
import Container from "../../../src/display/Container";
import Shadow from "../../../src/display/Shadow";
import Shape from "../../../src/display/Shape";
import Stage from "../../../src/display/Stage";
import AlphaMaskFilter from "../../../src/filters/AlphaMaskFilter";
import BlurFilter from "../../../src/filters/BlurFilter";
import ColorFilter from "../../../src/filters/ColorFilter";
import ColorMatrix from "../../../src/filters/ColorMatrix";
import ColorMatrixFilter from "../../../src/filters/ColorMatrixFilter";

import globals from "../../setup";
import imagediff from "imagediff";
import Canvas from "canvas-prebuilt";

describe("Filters", () => {

	let stage, image;

	beforeEach(async (done) => {
		stage = new Stage(imagediff.createCanvas(200, 200));

		image = new Canvas.Image();
		image.onload = () => { done(); }
		image.onerror = () => { done(`${image.src} failed to load`); }
		image.src = `${globals.rootPath}assets/art/daisy.png`;
	});

	it("AlphaMaskFilter", done => {
		let width = image.width;
		let height = image.height;

		let bmp2 = new Bitmap(image);

		let maskShape = new Shape();
		let g = maskShape.graphics;
		g.beginLinearGradientFill(["rgba(255,255,255,1)", "rgba(255,255,255,0)"], [0, 1], 0, 0, 0, 35)
		g.drawRect(0, 0, width, height);
		g.endFill();

		maskShape.cache(0, 0, width, height);

		let amf = new AlphaMaskFilter(maskShape.cacheCanvas);
		bmp2.filters = [amf];
		bmp2.cache(0, 0, width, height);
		stage.addChild(bmp2);

		stage.update();
		globals.compareBaseLine(globals.rootPath + "tests/assets/AlphaMaskFilter.png", done, expect, .01);

		expect(amf.clone().mask).toBe(maskShape.cacheCanvas);
	});

	it("AlphaMapFilter", done => {
		let width = image.width;
		let height = image.height;

		let bmp2 = new Bitmap(image);

		let maskShape = new Shape();
		let g = maskShape.graphics;
		g.beginLinearGradientFill(["rgba(255,255,255,1)", "rgba(255,255,255,0)"], [0, 1], 0, 0, 0, 100)
		g.drawRect(0, 0, width, height);
		g.endFill();

		maskShape.cache(0, 0, width, height);

		let amf = new AlphaMapFilter(maskShape.cacheCanvas);
		bmp2.filters = [amf];
		bmp2.cache(0, 0, width, height);
		stage.addChild(bmp2);

		globals.compareBaseLine(globals.rootPath + "tests/assets/AlphaMapFilter.png", done, expect, stage.canvas);

		expect(amf.clone().alphaMap).toBe(maskShape.cacheCanvas);
	});

	it("BlurFilter", done => {
		let shape = new Shape();
		shape.graphics.beginFill("#ff0000").drawCircle(50, 75, 25);

		let blurFilter = new BlurFilter(10, 50, 2);
		shape.filters = [blurFilter];
		let bounds = blurFilter.getBounds();

		stage.addChild(shape);

		shape.cache(0, 0, 100, 100);

		globals.compareBaseLine(globals.rootPath + "tests/assets/BlurFilter.png", done, expect, stage.canvas, 0.01);

		let blurClone = blurFilter.clone();
		expect(blurClone.blurX).toBe(blurFilter.blurX);
		expect(blurClone.blurY).toBe(blurFilter.blurY);
		expect(blurClone.quality).toBe(blurFilter.quality);
	});

	it("ColorFilter() shape should be blue", done => {
		let shape = new Shape().set({x: 10, y: 10});
		shape.graphics.beginFill("#ff0000").drawCircle(50, 60, 25);

		let cf = new ColorFilter(0, 0, 0, 1, 0, 0, 255, 0);

		shape.filters = [cf];

		shape.cache(0, 0, 100, 100);
		stage.addChild(shape);

		globals.compareBaseLine(globals.rootPath + "tests/assets/ColorFilter.png", done, expect, stage.canvas, 0.01);

		let colorFilterClone = cf.clone();

		expect(colorFilterClone.redMultiplier).toBe(cf.redMultiplier);
		expect(colorFilterClone.greenMultiplier).toBe(cf.greenMultiplier);
		expect(colorFilterClone.blueMultiplier).toBe(cf.blueMultiplier);
		expect(colorFilterClone.alphaMultiplier).toBe(cf.alphaMultiplier);
		expect(colorFilterClone.redOffset).toBe(cf.redOffset);
		expect(colorFilterClone.greenOffset).toBe(cf.greenOffset);
		expect(colorFilterClone.blueOffset).toBe(cf.blueOffset);
		expect(colorFilterClone.alphaOffset).toBe(cf.alphaOffset);
	});

	it("ColorMatrixFilter()", done => {
		let bmp = new Bitmap(image).set({x: 25, y: 25});

		let matrix = new ColorMatrix().adjustHue(180).adjustSaturation(100);
		let cmf = new ColorMatrixFilter(matrix);
		bmp.filters = [cmf];

		bmp.cache(0, 0, 100, 100);

		stage.addChild(bmp);

		globals.compareBaseLine(globals.rootPath + "tests/assets/ColorMatrixFilter.png", done, expect, stage.canvas);

		let clone = cmf.clone().matrix.toArray();
		let orig = cmf.matrix.toArray()

		for (let i = 0; i < orig.length; i++) {
			expect(clone[i]).toBe(orig[i]);
		}
	});

	it("Shadow", done => {
		let c = new Container();
		let g = c.addChild(new Shape()).graphics;
		g.beginFill("#ff0000").drawRect(10, 10, 100, 100);
		c.shadow = new Shadow("#000000", 5, 5, 20);

		stage.addChild(c);

		globals.compareBaseLine(globals.rootPath + "tests/assets/Shadow.png", done, expect, stage.canvas);
	});

});
