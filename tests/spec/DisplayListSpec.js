describe("DisplayList", function () {
	beforeEach(function () {
		this.shadow = new createjs.Shadow();

		// Used to test clone() and set() operations
		this.displayObjectProps = {
			alpha: .5,
			name: "foo",
			regX: 1,
			regY: 2,
			rotation: 90,
			scaleX: 1.5,
			scaleY: 1.6,
			shadow: this.shadow,
			skewX: 3,
			skewY: 4,
			visible: false,
			x: 5,
			y: 6,
			mouseEnabled: true,
			compositeOperation: "copy"
		};

		this.bitmapProps = {sourceRect: new createjs.Rectangle(1, 2, 3, 4)};
		for (var n in this.displayObjectProps) {
			this.bitmapProps[n] = this.displayObjectProps[n];
		}

		this.createShapeRect = function(x, y, w, h, fColor) {
			var shape = new createjs.Shape();
			var g = shape.graphics;
			g.ss(1).s(this.sColor).f(fColor).dr(x, y, w, h).ef();
			return shape;
		}
	});

	it("stage.addChild() should work", function () {
		var child = new createjs.Container();
		this.stage.addChild(child);

		expect(this.stage.contains(child)).toBe(true);
	});

	it("stage.contains() and stage.removeChild() should work", function () {
		var child = new createjs.Container();
		this.stage.addChild(child);
		this.stage.removeChild(child);

		expect(this.stage.contains(child)).toBe(false);
	});

	it("stage.removeChildAt(0) should work", function () {
		var child = new createjs.Container();
		this.stage.addChild(child);
		this.stage.removeChildAt(0);

		expect(this.stage.contains(child)).toBe(false);
	});

	it("stage.getChildIndex() should work", function () {
		var child = new createjs.Container();
		this.stage.addChild(new createjs.Container());
		this.stage.addChildAt(child, 0);

		expect(this.stage.getChildIndex(child)).toBe(0);
	});

	it("stage.addChildAt() should work.", function () {
		var child = new createjs.Container();
		this.stage.addChild(new createjs.Container());
		this.stage.addChildAt(child, 1);

		expect(this.stage.getChildIndex(child)).toBe(1);
	});

	it("stage.getChildByName('foo') should work", function () {
		var child = new createjs.Container();
		child.name = "foo";
		this.stage.addChild(child);

		expect(this.stage.getChildByName("foo")).not.toBe(null);
	});

	it("stage.getMatrix() should work", function () {
		expect(this.stage.getMatrix()).not.toBe(null);
	});

	it("stage.getConcatenatedMatrix() should work", function () {
		expect(this.stage.getConcatenatedMatrix()).not.toBe(null);
	});

	it("stage.getNumChildren() should be 2", function () {
		this.stage.addChild(new createjs.Sprite());
		this.stage.addChild(new createjs.Sprite());
		expect(this.stage.getNumChildren()).toBe(2);
	});

	it("stage.getStage() should eq stage.", function () {
		expect(this.stage.getStage()).toBe(this.stage);
	});

	it("Bitmap.clone();", function () {
		var bmp = new createjs.Bitmap(this.img).set(this.bitmapProps);
		var clone = bmp.clone();

		for (var n in this.bitmapProps) {
			if (clone[n] instanceof createjs.Rectangle) {
				var a = this.bitmapProps[n];
				var b = clone[n];
				expect(a.x).toBe(b.x);
				expect(a.y).toBe(b.y);
				expect(a.width).toBe(b.width);
				expect(a.height).toBe(b.height);
			} else {
				expect(clone[n]).toBe(this.bitmapProps[n]);
			}
		}
	});

	it("DisplayObject.clone();", function () {
		var obj = new createjs.DisplayObject().set(this.displayObjectProps);
		var clone = obj.clone();

		for (var n in this.displayObjectProps) {
			expect(clone[n]).toBe(this.displayObjectProps[n]);
		}
	});

	it("getTransformedBounds() should work", function () {
		var bmp = new createjs.Bitmap(this.img);
		this.stage.addChild(bmp);
		var bounds = bmp.getTransformedBounds();
		expect(bounds.width).toBe(80);
		expect(bounds.height).toBe(67);
	});

	describe("getObjectsUnderPoint()", function() {
		beforeEach(function () {
			this.rect = this.createShapeRect(0, 0, 150, 150, this.fColor);
			this.rect2 = this.createShapeRect(151, 151, 20, 20, this.fColor);
			this.rect3 = this.createShapeRect(160, 160, 20, 20, this.fColor);
			this.rect4 = this.createShapeRect(151, 151, 20, 20, this.fColor);
			this.rect5 = this.createShapeRect(25, 25, 130, 130, this.fColor);

			this.stage.addChild(this.rect, this.rect2, this.rect3, this.rect4, this.rect5);
			this.stage.update();

			// document.body.appendChild(this.stage.canvas);
		});

		it("should return 1 object.", function () {
			var objects = this.stage.getObjectsUnderPoint(1, 1);
			expect(objects.length).toBe(1);
		});

		it("should return 3 objects.", function () {
			var objects = this.stage.getObjectsUnderPoint(152, 152);
			expect(objects.length).toBe(3);
		});

		describe("should respect masks.", function () {
			beforeEach(function () {
				this.mask = new createjs.Shape();
				var g = this.mask.graphics;
				g.setStrokeStyle(1);
				g.beginStroke(this.sColor);
				g.beginFill(this.fColor);
				g.drawRect(0, 0, 50, 50);
				g.endFill();

				this.rect.mask = this.mask;

				this.stage.update();
			});

			it("should find the masked object on stage", function () {
				var objects = this.stage.getObjectsUnderPoint(51, 51);
				expect(objects.length).toBe(1);
			});

			it("should not find the object on stage", function () {
				var objects = this.stage.getObjectsUnderPoint(51, 51);
				expect(objects.length).toBe(1);
			});

			describe("container masks", function () {
				beforeEach(function () {
					this.stage.removeAllChildren();

					this.container = new createjs.Container();
					var wh = 100;
					var o = 0;
					var oi = 20;
					this.rect1 = this.createShapeRect(o, o, wh, wh, "#ffcc88");
					this.rect2 = this.createShapeRect(o+=oi, o, wh, wh, "#ccccee");
					this.rect3 = this.createShapeRect(o+=oi, o, wh, wh, "#ccccee");
					this.rect4 = this.createShapeRect(o+=oi, o, wh, wh, this.fColor);
					this.rect5 = this.createShapeRect(o+=oi, o, wh, wh, this.fColor);
					this.mask = this.createShapeRect(0, 0, 15, 15, this.fColor);
				});

				it(".getObjectsUnderPoint should return 4", function () {
					this.container.addChild(this.rect1, this.rect2, this.rect3, this.rect4);
					this.stage.addChild(this.container);
					this.stage.update();

					var dot = new createjs.Shape();
					dot.graphics.f("#ffffff").de(50,50,2,2);

					expect(this.container.getObjectsUnderPoint(48, 48).length).toBe(3);

					this.container.addChild(dot);
					this.stage.update();
				});

				it("should respect container masks from stage.getObjectsUnderPoint", function () {
					this.container.addChild(this.rect1, this.rect2, this.rect3, this.rect4);
					this.container.mask = this.mask;
					this.stage.addChild(this.container);
					this.stage.update();

					expect(this.container.getObjectsUnderPoint(50, 50).length).toBe(0);
				});

				it("should respect containers masks", function () {
					this.container.addChild(this.rect1, this.rect2, this.rect3, this.rect4);
					this.container.mask = this.mask;
					this.stage.addChild(this.container);
					this.stage.update();

					expect(this.stage.getObjectsUnderPoint(50, 50).length).toBe(0);
				});
			});
		});

		describe("hitareas", function () {
			beforeEach(function () {
				var hitarea = this.createShapeRect(0,0,10,10, "#ff00aa");

				this.rect.mouseEnabled = true;
				this.rect.hitArea = hitarea;

				this.stage.update();
			});

			it("should find one object", function () {
				var objects = this.stage.getObjectsUnderPoint(9, 9);
				expect(objects.length).toBe(1);
			});

			it("should not return any objects", function () {
				var objects = this.stage.getObjectsUnderPoint(11, 11);
				expect(objects.length).toBe(0);
			});
		});

		describe("mode", function () {
			it("mode=0 should return mouseEnabled=false objects.", function () {
				this.rect2.mouseEnabled = false;
				this.rect3.mouseEnabled = false;

				var objects = this.stage.getObjectsUnderPoint(152, 152, 0);
				expect(objects.length).toBe(3);
			});

			it("mode=1 should ignore mouseEnabled=false objects.", function () {
				this.rect2.mouseEnabled = false;
				this.rect3.mouseEnabled = false;

				var objects = this.stage.getObjectsUnderPoint(152, 152, 1);
				expect(objects.length).toBe(2);
			});

			it("mode=2 should return objects with mouseEvents and mouseEnabled==true.", function () {
				this.rect2.addEventListener("click", function () {
				});
				this.rect2.mouseEnabled = false;
				this.rect3.mouseEnabled = false;
				this.rect4.mouseEnabled = false;

				var objects = this.stage.getObjectsUnderPoint(152, 152, 2);
				expect(objects.length).toBe(0);
			});
		});
	});

	it("hitTest() should be true.", function () {
		var dot = new createjs.Shape();

		var g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(this.sColor);
		g.beginFill(this.fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		this.stage.addChild(dot);
		this.stage.update();

		expect(this.stage.hitTest(1, 1)).toBe(true);
	});

	it("isVisible() should be true.", function () {
		var dot = new createjs.Shape();

		var g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(this.sColor);
		g.beginFill(this.fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		expect(dot.isVisible()).toBe(true);
	});

	it("localToGlobal() should work.", function () {
		var pt = this.stage.localToGlobal(0, 0);
		expect(pt.x).toBe(0);
	});

	it("localToLocal() should work.", function () {
		var s = new createjs.Shape();
		this.stage.addChild(s);

		var pt = this.stage.localToLocal(0, 0, s);
		expect(pt.x).toBe(0);
	});

	it("set() should work", function () {
		var shape = this.stage.addChild(new createjs.Shape()).set(this.displayObjectProps);

		for (var n in this.displayObjectProps) {
			expect(shape[n]).toBe(this.displayObjectProps[n]);
		}
	});

	it("setBounds() should work.", function () {
		var s = new createjs.Shape();
		this.stage.addChild(s);

		s.setBounds(1, 2, 3, 4);

		var b = s.getBounds();
		expect(b.x).toBe(1);
		expect(b.y).toBe(2);
		expect(b.width).toBe(3);
		expect(b.height).toBe(4);
	});

	it("setChildIndex() should work.", function () {
		var foo = new createjs.Shape();
		var bar = new createjs.Shape();
		this.stage.addChild(bar);
		this.stage.addChild(foo);
		this.stage.setChildIndex(foo, 0);
		expect(this.stage.getChildIndex(foo)).toBe(0);
	});

	it("setTransform() should work.", function () {
		var foo = new createjs.Shape();
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

	it("sortChildren() higher y should be on-top", function () {
		var sortFunction = function (obj1, obj2, options) {
			if (obj1.y < obj2.y) { return -1; }
			if (obj1.y > obj2.y) { return 1; }
			return 0;
		}

		var container = new createjs.Container();

		var foo = new createjs.Shape().set({y: 80});
		var bar = new createjs.Shape().set({y: 45});
		var ja = new createjs.Shape().set({y: 150});

		container.addChild(ja, bar, foo);
		expect(container.getChildIndex(ja)).toBe(0);
		container.sortChildren(sortFunction);
		expect(container.getChildIndex(ja)).toBe(2);
	});

	it("swapChildren() should work.", function () {
		var container = new createjs.Container();

		var foo = new createjs.Shape();
		var bar = new createjs.Shape();

		container.addChild(bar, foo);
		expect(container.getChildIndex(bar)).toBe(0);
		expect(container.getChildIndex(foo)).toBe(1);

		container.swapChildren(bar, foo);

		expect(container.getChildIndex(foo)).toBe(0);
		expect(container.getChildIndex(bar)).toBe(1);
	});

	it("swapChildrenAt() should work.", function () {
		var container = new createjs.Container();

		var foo = new createjs.Shape();
		var bar = new createjs.Shape();
		var bars = new createjs.Shape();

		container.addChild(bar, foo, bars);
		expect(container.getChildIndex(bar)).toBe(0);
		expect(container.getChildIndex(bars)).toBe(2);

		container.swapChildren(bar, bars);

		expect(container.getChildIndex(bar)).toBe(2);
		expect(container.getChildIndex(bars)).toBe(0);
	});

	it("toDataURL() should return a valid image.", function (done) {
		var url = this.stage.toDataURL("#ffffff");

		var image = new Image();
		image.onload = function () {
			done();
		}

		image.src = url;
		expect(image.src).not.toBe(null);
	});

	it("stage.toString() should work.", function () {
		expect(this.stage.toString()).not.toBe(null);
	});

	it("cache(), updateCache() and uncache() should work.", function () {
		this.stage.cache(0, 0, 25, 25);
		expect(this.stage.cacheCanvas).not.toBe(null);
		this.stage.updateCache();
		this.stage.uncache();

		var err = false;
		try {
			this.stage.updateCache();
		} catch (e) {
			err = true;
		}
		expect(err).toBe(true);
	});

	it("Text", function (done) {
		var txt = new createjs.Text("", "12px Arial", "#dd0000");
		txt.text = "This text is rendered in canvas.\n\nusing the Text Object.!\n\nTEST!\n\nmore text";
		txt.textBaseline = "top";
		txt.textAlign = "left";
		txt.y = 0;
		txt.x = 0;
		this.stage.addChild(txt);

		this.compareBaseLine("assets/Text.png", done, expect, 0.01);
	});

	it("BitmapText", function (done) {
		var _this = this;

		var img = new Image();
		img.onload = function () {
			var ss = new createjs.SpriteSheet(data);
			var text = new createjs.BitmapText("abcdef\nghijklm\nnopqr\nstuvw\nxyz!,.?", ss);
			_this.stage.addChild(text);

			// Need to delay this for Safari.
			setTimeout(function () {
				_this.stage.update();
				_this.compareBaseLine("assets/BitmapText.png", done, expect);
			}, 5);
		};

		img.src = this.assetsBasePath+"spritesheet_font.png";

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
			"images": [this.assetsBasePath+"spritesheet_font.png"],
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
	});

	it("masks should work", function (done) {
		// masks can only be shapes.
		var star = new createjs.Shape();

		// the mask's position will be relative to the parent of its target:
		star.x = this.img.width / 2;
		star.y = this.img.height / 2;

		// only the drawPolyStar call is needed for the mask to work:
		star.graphics.beginStroke("#FF0").setStrokeStyle(3).drawPolyStar(0, 0, this.img.height / 2, 5, 0.6);

		var bg = new createjs.Bitmap(this.img);
		// blur and desaturate the background image:
		bg.filters = [new createjs.BlurFilter(2, 2, 2), new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, 0, -100, 0))];
		bg.cache(0, 0, this.img.width, this.img.height);
		this.stage.addChild(bg);

		var bmp = new createjs.Bitmap(this.img);
		this.stage.addChild(bmp);
		bmp.mask = star;

		// note that the shape can be used in the display list as well if you'd like, or
		// we can reuse the Graphics instance in another shape if we'd like to transform it differently.
		this.stage.addChild(star);

		this.stage.update();
		this.compareBaseLine("assets/mask.png", done, expect, 0.01);
	});
});
