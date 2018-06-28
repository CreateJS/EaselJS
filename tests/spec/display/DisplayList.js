import Bitmap from "../../../src/display/Bitmap";
import BitmapText from "../../../src/display/BitmapText";
import Container from "../../../src/display/Container";
import DisplayObject from "../../../src/display/DisplayObject";
import Shadow from "../../../src/display/Shadow";
import Shape from "../../../src/display/Shape";
import Sprite from "../../../src/display/Sprite";
import SpriteSheet from "../../../src/display/SpriteSheet";
import Stage from "../../../src/display/Stage";
import Text from "../../../src/display/Text";
import Rectangle from "../../../src/geom/Rectangle";
import BlurFilter from "../../../src/filters/BlurFilter";
import ColorMatrix from "../../../src/filters/ColorMatrix";
import ColorMatrixFilter from "../../../src/filters/ColorMatrixFilter";

import globals from "../../setup";
import Canvas from "canvas-prebuilt";

function createShapeRect (x, y, w, h, fColor) {
	const shape = new Shape();
	const g = shape.graphics;
	g.ss(1).s(globals.sColor).f(fColor).dr(x, y, w, h).ef();
	return shape;
}

describe("DisplayList", () => {

	let stage, canvas, image, displayObjectProps, bitmapProps;

	beforeEach(async (done) => {
		canvas = new Canvas();
		canvas.width = canvas.height = 200;
		stage = new Stage(canvas);

		image = new Canvas.Image();
		image.onload = () => { done(); }
		image.onerror = () => { done(`${image.src} failed to load`); }
		image.src = `${globals.rootPath}assets/art/daisy.png`;

		// Used to test clone() and set() operations
		displayObjectProps = {
			alpha: .5,
			name: "foo",
			regX: 1,
			regY: 2,
			rotation: 90,
			scaleX: 1.5,
			scaleY: 1.6,
			shadow: new Shadow(),
			skewX: 3,
			skewY: 4,
			visible: false,
			x: 5,
			y: 6,
			mouseEnabled: true,
			compositeOperation: "copy"
		};

		bitmapProps = { sourceRect: new Rectangle(1, 2, 3, 4) };
		for (let n in displayObjectProps) {
			bitmapProps[n] = displayObjectProps[n];
		}
	});

	afterEach(() => {
		stage, image, displayObjectProps, bitmapProps = null;
	})

	describe("Stage", () => {

		it("addChild() should work", () => {
			const child = new Container();
			stage.addChild(child);
			expect(stage.contains(child)).toBeTruthy();
		});

		it("stage.contains() and stage.removeChild() should work", () => {
			const child = new Container();
			stage.addChild(child);
			stage.removeChild(child);
			expect(stage.contains(child)).toBeFalsy();
		});

		it("stage.removeChildAt(0) should work", () => {
			const child = new Container();
			stage.addChild(child);
			stage.removeChildAt(0);
			expect(stage.contains(child)).toBeFalsy();
		});

		it("stage.getChildIndex() should work", () => {
			const child = new Container();
			stage.addChild(new Container());
			stage.addChildAt(child, 0);
			expect(stage.getChildIndex(child)).toBe(0);
		});

		it("stage.addChildAt() should work.", () => {
			const child = new Container();
			stage.addChild(new Container());
			stage.addChildAt(child, 1);
			expect(stage.getChildIndex(child)).toBe(1);
		});

		it("stage.getChildByName('foo') should work", () => {
			const child = new Container();
			child.name = "foo";
			stage.addChild(child);
			expect(stage.getChildByName("foo")).not.toBeNull();
		});

		it("stage.getMatrix() should work", () => {
			expect(stage.getMatrix()).not.toBe(null);
		});

		it("stage.getConcatenatedMatrix() should work", () => {
			expect(stage.getConcatenatedMatrix()).not.toBe(null);
		});

		it("stage.numChildren should be 2", () => {
			stage.addChild(new Sprite());
			stage.addChild(new Sprite());
			expect(stage.numChildren).toBe(2);
		});

		it("stage.stage should eq stage.", () => {
			expect(stage.stage).toBe(stage);
		});

	});

	describe("*.clone() should work", () => {

		it("Bitmap.clone();", () => {
			let bmp = new Bitmap(image).set(bitmapProps);
			let clone = bmp.clone();

			for (let n in bitmapProps) {
				if (clone[n] instanceof Rectangle) {
					let a = bitmapProps[n];
					let b = clone[n];
					expect(a.x).toBe(b.x);
					expect(a.y).toBe(b.y);
					expect(a.width).toBe(b.width);
					expect(a.height).toBe(b.height);
				} else {
					expect(clone[n]).toBe(bitmapProps[n]);
				}
			}
		});

		it("DisplayObject.clone();", () => {
			let obj = new DisplayObject().set(displayObjectProps);
			let clone = obj.clone();

			for (let n in displayObjectProps) {
				expect(clone[n]).toBe(displayObjectProps[n]);
			}
		});

		it("Sprite.clone();", () => {
			let props = globals.merge({
									   currentFrame: 1,
									   currentAnimation: "foo",
									   paused: true,
									   currentAnimationFrame: 2,
									   framerate: 3
								   }, displayObjectProps);
			let obj = new Sprite().set(props);
			let clone = obj.clone();

			for (let n in props) {
				expect(clone[n]).toBe(props[n]);
			}
		});

		it("Container.clone();", () => {
			let obj = new Container().set(displayObjectProps);
			let clone = obj.clone();

			for (let n in displayObjectProps) {
				expect(clone[n]).toBe(displayObjectProps[n]);
			}
		});

		it("Stage.clone() should fail", () => {
			let obj = new Stage();

			// Can't use toThrow() since a string is thrown and jasmine doesn't catch it.
			try {
				obj.clone();
			} catch (e) {
				expect(true).toBe(true);
				return;
			}

			expect(true).toBe(false);
		});

		it("SpriteSheet.clone() should fail", () => {
			let obj = new SpriteSheet();

			// Can't use toThrow() since a string is thrown and jasmine doesn't catch it.
			try {
				obj.clone();
			} catch (e) {
				expect(true).toBe(true);
				return;
			}

			expect(true).toBe(false);
		});

		it("BitmapText.clone();", () => {
			let props = globals.merge({
									   lineHeight: 4,
									   letterSpacing: 5,
									   spaceWidth: 6
								   }, displayObjectProps);
			let obj = new BitmapText().set(props);
			let clone = obj.clone();

			for (let n in props) {
				expect(clone[n]).toBe(props[n]);
			}
		});

		it("Text.clone();", () => {
			let props = globals.merge({
									   text: "foo bar",
									   font: "Arial",
									   color: "rgba(255,0,255, 5)",
									   textAlign: "right",
									   textBaseline: "hanging",
									   maxWidth: 5,
									   outline: 1,
									   lineHeight: 6,
									   lineWidth: 7
								   }, displayObjectProps);
			let obj = new Text().set(props);
			let clone = obj.clone();

			for (let n in props) {
				expect(clone[n]).toBe(props[n]);
			}
		});
	});

	describe("getObjectsUnderPoint()", () => {
		let rect1, rect2, rect3, rect4, rect5;
		beforeEach(() => {
			rect1 = createShapeRect(0, 0, 150, 150, globals.fColor);
			rect2 = createShapeRect(151, 151, 20, 20, globals.fColor);
			rect3 = createShapeRect(160, 160, 20, 20, globals.fColor);
			rect4 = createShapeRect(151, 151, 20, 20, globals.fColor);
			rect5 = createShapeRect(25, 25, 130, 130, globals.fColor);

			stage.addChild(rect1, rect2, rect3, rect4, rect5);
			stage.update();

			// document.body.appendChild(canvas);
		});

		it("should return 1 object.", () => {
			let objects = stage.getObjectsUnderPoint(1, 1);
			expect(objects.length).toBe(1);
		});

		it("should return 3 objects.", () => {
			let objects = stage.getObjectsUnderPoint(152, 152);
			expect(objects.length).toBe(3);
		});

		describe("should respect masks.", () => {
			let mask;
			beforeEach(() => {
				mask = new Shape();
				let g = mask.graphics;
				g.setStrokeStyle(1);
				g.beginStroke(globals.sColor);
				g.beginFill(globals.fColor);
				g.drawRect(0, 0, 50, 50);
				g.endFill();

				rect1.mask = mask;

				stage.update();
			});

			it("should find the masked object on stage", () => {
				let objects = stage.getObjectsUnderPoint(51, 51);
				expect(objects.length).toBe(1);
			});

			it("should not find the object on stage", () => {
				let objects = stage.getObjectsUnderPoint(51, 51);
				expect(objects.length).toBe(1);
			});

			describe("container masks", () => {
				let container, mask;
				beforeEach(() => {
					stage.removeAllChildren();

					container = new Container();
					let wh = 100;
					let o = 0;
					let oi = 20;
					rect1 = createShapeRect(o, o, wh, wh, "#ffcc88");
					rect2 = createShapeRect(o += oi, o, wh, wh, "#ccccee");
					rect3 = createShapeRect(o += oi, o, wh, wh, "#ccccee");
					rect4 = createShapeRect(o += oi, o, wh, wh, globals.fColor);
					rect5 = createShapeRect(o += oi, o, wh, wh, globals.fColor);
					mask = createShapeRect(0, 0, 15, 15, globals.fColor);
				});

				it(".getObjectsUnderPoint should return 4", () => {
					container.addChild(rect1, rect2, rect3, rect4);
					stage.addChild(container);
					stage.update();

					let dot = new Shape();
					dot.graphics.f("#ffffff").de(50, 50, 2, 2);

					expect(container.getObjectsUnderPoint(48, 48).length).toBe(3);

					container.addChild(dot);
					stage.update();
				});

				it("should respect container masks from stage.getObjectsUnderPoint", () => {
					container.addChild(rect1, rect2, rect3, rect4);
					container.mask = mask;
					stage.addChild(container);
					stage.update();

					expect(container.getObjectsUnderPoint(50, 50).length).toBe(0);
				});

				it("should respect containers masks", () => {
					container.addChild(rect1, rect2, rect3, rect4);
					container.mask = mask;
					stage.addChild(container);
					stage.update();

					expect(stage.getObjectsUnderPoint(50, 50).length).toBe(0);
				});
			});
		});

		describe("hitareas", () => {
			beforeEach(() => {
				let hitarea = createShapeRect(0, 0, 10, 10, "#ff00aa");

				rect1.mouseEnabled = true;
				rect1.hitArea = hitarea;

				stage.update();
			});

			it("should find one object", () => {
				let objects = stage.getObjectsUnderPoint(9, 9);
				expect(objects.length).toBe(1);
			});

			it("should not return any objects", () => {
				let objects = stage.getObjectsUnderPoint(11, 11);
				expect(objects.length).toBe(0);
			});
		});

		describe("mode", () => {
			it("mode=0 should return mouseEnabled=false objects.", () => {
				rect2.mouseEnabled = false;
				rect3.mouseEnabled = false;

				let objects = stage.getObjectsUnderPoint(152, 152, 0);
				expect(objects.length).toBe(3);
			});

			it("mode=1 should ignore mouseEnabled=false objects.", () => {
				rect2.mouseEnabled = false;
				rect3.mouseEnabled = false;

				let objects = stage.getObjectsUnderPoint(152, 152, 1);
				expect(objects.length).toBe(2);
			});

			it("mode=2 should return objects with mouseEvents and mouseEnabled==true.", () => {
				rect2.addEventListener("click", () => {
				});
				rect2.mouseEnabled = false;
				rect3.mouseEnabled = false;
				rect4.mouseEnabled = false;

				let objects = stage.getObjectsUnderPoint(152, 152, 2);
				expect(objects.length).toBe(0);
			});
		});
	});

	it("getTransformedBounds() should work", () => {
		let bmp = new Bitmap(image);
		stage.addChild(bmp);
		let bounds = bmp.getTransformedBounds();
		expect(bounds.width).toBe(80);
		expect(bounds.height).toBe(67);
	});

	it("hitit() should be true.", () => {
		let dot = new Shape();

		let g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		stage.addChild(dot);
		stage.update();

		expect(stage.hitit(1, 1)).toBe(true);
	});

	it("isVisible() should be true.", () => {
		let dot = new Shape();

		let g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(globals.sColor);
		g.beginFill(globals.fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		expect(dot.isVisible()).toBe(true);
	});

	it("localToGlobal() should work on stage.", () => {
		let pt = stage.localToGlobal(0, 0);

		expect(pt.x).toBe(0);
		expect(pt.y).toBe(0);
	});

	it("localToGlobal() should work on nested containers.", () => {
		let c = new Container();
		c.set({x:50, y:50});

		let c2 = new Container();
		c2.set({x:25, y:25});

		let c3 = new Container();
		c3.set({x:-5, y:-5});

		c.addChild(c2);
		c2.addChild(c3);

		expect(c.localToGlobal(0, 0).x).toBe(50);
		expect(c2.localToGlobal(0, 0).x).toBe(75);
		expect(c3.localToGlobal(0, 0).x).toBe(70);

		expect(c.localToGlobal(0, 0).y).toBe(50);
		expect(c2.localToGlobal(0, 0).y).toBe(75);
		expect(c3.localToGlobal(0, 0).y).toBe(70);
	});

	it("localToLocal() should work.", () => {
		let s = new Shape();
		stage.addChild(s);

		let pt = stage.localToLocal(0, 0, s);
		expect(pt.x).toBe(0);
	});

	it("set() should work", () => {
		let shape = stage.addChild(new Shape()).set(displayObjectProps);

		for (let n in displayObjectProps) {
			expect(shape[n]).toBe(displayObjectProps[n]);
		}
	});

	it("setBounds() should work.", () => {
		let s = new Shape();
		stage.addChild(s);

		s.setBounds(1, 2, 3, 4);

		let b = s.getBounds();
		expect(b.x).toBe(1);
		expect(b.y).toBe(2);
		expect(b.width).toBe(3);
		expect(b.height).toBe(4);
	});

	it("setChildIndex() should work.", () => {
		let foo = new Shape();
		let bar = new Shape();
		stage.addChild(bar);
		stage.addChild(foo);
		stage.setChildIndex(foo, 0);
		expect(stage.getChildIndex(foo)).toBe(0);
	});

	it("setTransform() should work.", () => {
		let foo = new Shape();
		foo.setTransform(5, 6, 2, 3, 90, 10, 11, 50, 55);

		expect(foo.x).toBe(5);
		expect(foo.y).toBe(6);
		expect(foo.scaleX).toBe(2);
		expect(foo.scaleY).toBe(3);
		expect(foo.rotation).toBe(90);
		expect(foo.skewX).toBe(10);
		expect(foo.skewY).toBe(11);
		expect(foo.regX).toBe(50);
		expect(foo.regY).toBe(55);
	});

	it("sortChildren() higher y should be on-top", () => {
		let sortFunction = function (obj1, obj2, options) {
			if (obj1.y < obj2.y) {
				return -1;
			}
			if (obj1.y > obj2.y) {
				return 1;
			}
			return 0;
		}

		let container = new Container();

		let foo = new Shape().set({y: 80});
		let bar = new Shape().set({y: 45});
		let ja = new Shape().set({y: 150});

		container.addChild(ja, bar, foo);
		expect(container.getChildIndex(ja)).toBe(0);
		container.sortChildren(sortFunction);
		expect(container.getChildIndex(ja)).toBe(2);
	});

	it("swapChildren() should work.", () => {
		let container = new Container();

		let foo = new Shape();
		let bar = new Shape();

		container.addChild(bar, foo);
		expect(container.getChildIndex(bar)).toBe(0);
		expect(container.getChildIndex(foo)).toBe(1);

		container.swapChildren(bar, foo);

		expect(container.getChildIndex(foo)).toBe(0);
		expect(container.getChildIndex(bar)).toBe(1);
	});

	it("swapChildrenAt() should work.", () => {
		let container = new Container();

		let foo = new Shape();
		let bar = new Shape();
		let bars = new Shape();

		container.addChild(bar, foo, bars);
		expect(container.getChildIndex(bar)).toBe(0);
		expect(container.getChildIndex(bars)).toBe(2);

		container.swapChildren(bar, bars);

		expect(container.getChildIndex(bar)).toBe(2);
		expect(container.getChildIndex(bars)).toBe(0);
	});

	it("toDataURL() should return a valid image.", done => {
		let url = stage.toDataURL("#ffffff");

		let img = new Canvas.Image();
		img.onload = () => { expect(url).not.toBe(null); done(); }
		img.onerror = () => { done(`${url} failed to load`); }
		img.src = url;
	});

	it("stage.toString() should work.", () => {
		expect(stage.toString()).not.toBe(null);
	});

	it("cache(), updateCache() and uncache() should work.", () => {
		stage.cache(0, 0, 25, 25);
		expect(stage.cacheCanvas).not.toBe(null);
		stage.updateCache();
		stage.uncache();

		let err = false;
		try {
			stage.updateCache();
		} catch (e) {
			err = true;
		}
		expect(err).toBe(true);
	});

	it("Text", done => {
		let txt = new Text("", "12px Arial", "#dd0000");
		txt.text = "This text is rendered in canvas.\n\nusing the Text Object.!\n\nTEST!\n\nmore text";
		txt.textBaseline = "top";
		txt.textAlign = "left";
		txt.y = 0;
		txt.x = 0;
		stage.addChild(txt);
		stage.update();
		globals.compareBaseLine(globals.rootPath + "tests/assets/Text.png", done, expect, canvas, 0.01);
	});

	it("Text.getBounds() should allow 0 as a value", () => {
		let txt = new Text("", "12px Arial", "#dd0000");
		txt.text = 0;
		stage.addChild(txt);

		expect(txt.getBounds()).not.toBe(null);
	});

	it("BitmapText", done => {
		// Embedded SpriteSheet data.
		const data = {
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
		let img = new Canvas.Image();
		img.onload = () => {
			data.images = [img];
			let ss = new SpriteSheet(data);
			let text = new BitmapText("abcdef\nghijklm\nnopqr\nstuvw\nxyz!,.?", ss);
			stage.addChild(text);
			stage.update();
			globals.compareBaseLine(globals.rootPath + "tests/assets/BitmapText.png", done, expect, canvas);
		};
		img.onerror = () => done(`${img.src} failed to load`);
		img.src = globals.rootPath + "assets/art/spritesheet_font.png";
	});

	it("masks should work", done => {
		// masks can only be shapes.
		let star = new Shape();

		// the mask's position will be relative to the parent of its target:
		star.x = image.width / 2;
		star.y = image.height / 2;

		// only the drawPolyStar call is needed for the mask to work:
		star.graphics.beginStroke("#FF0").setStrokeStyle(3).drawPolyStar(0, 0, image.height / 2, 5, 0.6);

		let bg = new Bitmap(image);
		// blur and desaturate the background image:
		bg.filters = [new BlurFilter(2, 2, 2), new ColorMatrixFilter(new ColorMatrix(0, 0, -100, 0))];
		bg.cache(0, 0, image.width, image.height);
		stage.addChild(bg);

		let bmp = new Bitmap(image);
		stage.addChild(bmp);
		bmp.mask = star;

		// note that the shape can be used in the display list as well if you'd like, or
		// we can reuse the Graphics instance in another shape if we'd like to transform it differently.
		stage.addChild(star);
		stage.update();

		globals.compareBaseLine(globals.rootPath + "tests/assets/mask.png", done, expect, canvas, 0.01);
	});

});
