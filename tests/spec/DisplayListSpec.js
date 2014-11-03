describe("DisplayList", function () {
	var c;
	var stage;
	var image;
	var sColor = "#000";
	var fColor = "#ff0000";
	var displayObjectProps;
	var bitmapProps;
	var shadow;

	beforeEach(function (done) {
		c = document.createElement("canvas");
		stage = new createjs.Stage(c);
		image = new Image();
		image.src = "assets/daisy.png";
		image.onload = function () {
			done();
		}

		shadow = new createjs.Shadow();

		// Used to test clone operations
		displayObjectProps = {
			alpha: .5,
			name: "foo",
			regX: 5,
			regY: 5,
			rotation: 90,
			scaleX: 1.5,
			scaleY: 1.6,
			shadow: shadow,
			skewX: 5,
			skewY: 5,
			visible: false,
			x: 15,
			y: 15,
			mouseEnabled: true,
			compositeOperation: "copy"
		};

		bitmapProps = {sourceRect: new createjs.Rectangle(1, 2, 3, 4)};
		for (var n in displayObjectProps) {
			bitmapProps[n] = displayObjectProps[n];
		}
	});

	it("stage.addChild() should work", function () {
		var child = new createjs.Container();
		stage.addChild(child);

		expect(stage.contains(child)).toBe(true);
	});

	it("stage.contains() and stage.removeChild() should work", function () {
		var child = new createjs.Container();
		stage.addChild(child);
		stage.removeChild(child);

		expect(stage.contains(child)).toBe(false);
	});

	it("stage.removeChildAt(0) should work", function () {
		var child = new createjs.Container();
		stage.addChild(child);
		stage.removeChildAt(0);

		expect(stage.contains(child)).toBe(false);
	});

	it("stage.getChildIndex() should work", function () {
		var child = new createjs.Container();
		stage.addChild(new createjs.Container());
		stage.addChildAt(child, 0);

		expect(stage.getChildIndex(child)).toBe(0);
	});

	it("stage.addChildAt() should work.", function () {
		var child = new createjs.Container();
		stage.addChild(new createjs.Container());
		stage.addChildAt(child, 1);

		expect(stage.getChildIndex(child)).toBe(1);
	});

	it("stage.getChildByName('foo') should work", function () {
		var child = new createjs.Container();
		child.name = "foo";
		stage.addChild(child);

		expect(stage.getChildByName("foo")).not.toBe(null);
	});

	it("stage.getMatrix() should work", function () {
		expect(stage.getMatrix()).not.toBe(null);
	});

	it("stage.getConcatenatedMatrix() should work", function () {
		expect(stage.getConcatenatedMatrix()).not.toBe(null);
	});

	it("stage.getNumChildren() should be 2", function () {
		stage.addChild(new createjs.Sprite());
		stage.addChild(new createjs.Sprite());
		expect(stage.getNumChildren()).toBe(2);
	});

	it("stage.getStage() should eq stage.", function () {
		expect(stage.getStage()).toBe(stage);
	});

	it("Bitmap.clone();", function () {
		var bmp = new createjs.Bitmap(image).set(bitmapProps);
		var clone = bmp.clone();

		for (var n in bitmapProps) {
			if (clone[n] instanceof createjs.Rectangle) {
				var a = bitmapProps[n];
				var b = clone[n];
				expect(a.x).toBe(b.x);
				expect(a.y).toBe(b.y);
				expect(a.width).toBe(b.width);
				expect(a.height).toBe(b.height);
			} else {
				expect(clone[n]).toBe(bitmapProps[n]);
			}
		}
	});

	it("DisplayObject.clone();", function () {
		var obj = new createjs.DisplayObject().set(displayObjectProps);
		var clone = obj.clone();

		for (var n in displayObjectProps) {
			expect(clone[n]).toBe(displayObjectProps[n]);
		}
	});

	it("getTransformedBounds() should work", function () {
		var bmp = new createjs.Bitmap(image);
		stage.addChild(bmp);
		var bounds = bmp.getTransformedBounds();
		expect(bounds.width).toBe(80);
		expect(bounds.height).toBe(67);
	});

	it("getObjectsUnderPoint() should return 1 object.", function () {
		var dot = new createjs.Shape();

		var g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		stage.addChild(dot);
		stage.update();

		var objects = stage.getObjectsUnderPoint(1, 1);
		expect(objects.length).toBe(1);
	});

	it("getObjectUnderPoint() should not be null.", function () {
		var dot = new createjs.Shape();

		var g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		stage.addChild(dot);
		stage.update();

		expect(stage.getObjectsUnderPoint(1, 1)).not.toBe(null);
	});

	it("hitTest() should be true.", function () {
		var dot = new createjs.Shape();

		var g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		stage.addChild(dot);
		stage.update();

		expect(stage.hitTest(1, 1)).toBe(true);
	});

	it("isVisible() should be true.", function () {
		var dot = new createjs.Shape();

		var g = dot.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(sColor);
		g.beginFill(fColor);
		g.drawRect(0, 0, 5, 5);
		g.endFill();

		expect(dot.isVisible()).toBe(true);
	});

	it("localToGlobal() should work.", function () {
		var pt = stage.localToGlobal(0, 0);
		expect(pt.x).toBe(0);
	});

	it("localToLocal() should work.", function () {
		var s = new createjs.Shape();
		stage.addChild(s);

		var pt = stage.localToLocal(0, 0, s);
		expect(pt.x).toBe(0);
	});

	it("set() should work", function () {
		var shape = stage.addChild(new createjs.Shape()).set(displayObjectProps);

		for (var n in displayObjectProps) {
			expect(shape[n]).toBe(displayObjectProps[n]);
		}
	});

	it("setBounds() should work.", function () {
		var s = new createjs.Shape();
		stage.addChild(s);

		s.setBounds(0, 0, 5, 5);

		var b = s.getBounds();
		expect(b.x).toBe(0);
		expect(b.y).toBe(0);
		expect(b.width).toBe(5);
		expect(b.width).toBe(5);
	});

	it("setChildIndex() should work.", function () {
		var foo = new createjs.Shape();
		var bar = new createjs.Shape();
		stage.addChild(bar);
		stage.addChild(foo);
		stage.setChildIndex(foo, 0);
		expect(stage.getChildIndex(foo)).toBe(0);
	});

	it("setTransform() should work.", function () {
		var foo = new createjs.Shape();
		foo.setTransform(5, 5, 2, 2, 90, 5, 5, 2, 2);

		expect(foo.x).toBe(5);
		expect(foo.y).toBe(5);
		expect(foo.scaleX).toBe(2);
		expect(foo.scaleY).toBe(2);
		expect(foo.rotation).toBe(90);
		expect(foo.skewX).toBe(5);
		expect(foo.skewY).toBe(5);
		expect(foo.regX).toBe(2);
		expect(foo.regY).toBe(2);
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
		var url = stage.toDataURL("#ffffff");

		var image = new Image();
		image.onload = function () {
			done();
		}

		image.src = url;
		expect(image.src).not.toBe(null);
	});

	it("stage.toString() should work.", function () {
		expect(stage.toString()).not.toBe(null);
	});

	it("cache(), updateCache() and uncache() should work.", function () {
		stage.cache(0, 0, 25, 25);
		expect(stage.cacheCanvas).not.toBe(null);
		stage.updateCache();
		stage.uncache();

		var err = false;
		try {
			stage.updateCache();
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

		img.src = "assets/BitmapFontSpriteSheet.png";

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
			"images": ["assets/BitmapFontSpriteSheet.png"],
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
});
