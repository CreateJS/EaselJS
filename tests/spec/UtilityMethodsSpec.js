describe("Utlity Methods", function () {

	beforeEach(function () {
		createjs.Ticker.reset();
		createjs.Ticker.init();
	});

	it("indexOf()", function () {
		var arr = [1, 2, 3, 4, 5];
		expect(createjs.indexOf(arr, 3)).toBe(2);
	});

	describe("Ticker", function () {
		it("createjs.Ticker.addEventListener(tick) evt.time", function (done) {
			setTimeout(function () {
				var tick = function (evt) {
					expect(evt.time).toBeInRange(createjs.Ticker.getTime(), 2);
					done();

					createjs.Ticker.removeEventListener("tick", tick);
				}
				createjs.Ticker.addEventListener("tick", tick);
			}, 1000);
		});

		it("createjs.Ticker.addEventListener(tick) evt.delta", function (done) {
			setTimeout(function () {
				var tick = function (evt) {
					expect(evt.delta).toBeInRange(createjs.Ticker.getInterval(), 5);
					done();

					createjs.Ticker.removeEventListener("tick", tick);
				}
				createjs.Ticker.addEventListener("tick", tick);
			}, 1000);
		});

		it("createjs.Ticker.addEventListener(tick) evt.runTime", function (done) {
			setTimeout(function () {
				var tick = function (evt) {
					expect(evt.runTime).toBeInRange(createjs.Ticker.getTime() | 0, 1);
					done();

					createjs.Ticker.removeEventListener("tick", tick);
				}
				createjs.Ticker.addEventListener("tick", tick);
			}, 1000);
		});

		it("setPaused", function (done) {
			createjs.Ticker.setPaused(true);

			// Should be paused
			expect(createjs.Ticker.getPaused()).toBe(true);

			// tick event should also also be paused.
			var func = function (evt) {
				expect(evt.paused).toBe(true);
				createjs.Ticker.removeEventListener("tick", func);
				done();
			};
			createjs.Ticker.addEventListener("tick", func);
		});

		it("getFPS", function () {
			createjs.Ticker.setInterval(40);

			expect(createjs.Ticker.getFPS()).toBe(25);
			expect(createjs.Ticker.getInterval()).toBe(40);
		});

		it("setFPS", function (done) {
			createjs.Ticker.setFPS(40);
			setTimeout(function () {
				expect(createjs.Ticker.getTime() | 0).toBeInRange(40 * 2, 3);
				done();
			}, 40 * 2);
		});

		it("getMeasuredFPS", function (done) {
			setTimeout(function () {
				expect(createjs.Ticker.getMeasuredFPS()).toBeInRange(createjs.Ticker.getFPS(), 5);
				done();
			}, 1000);
		});

		it("getMeasuredTickTime", function () {
			expect(createjs.Ticker.getMeasuredTickTime() | 0).not.toBe(null);
		});

		it("getTicks", function (done) {
			setTimeout(function () {
				expect(createjs.Ticker.getTicks()).toBeInRange(createjs.Ticker.getFPS(), 5);
				done();
			}, 1000);
		});

		it("should advance by 1 seconds - getTime()", function (done) {
			setTimeout(function () {
				expect(createjs.Ticker.getTime()).toBeInRange(1000, 5);
				done();
			}, 1000);
		});

		it("getEventTime", function (done) {
			setTimeout(function () {
				var expected = (createjs.Ticker.getInterval() * createjs.Ticker.getFPS()) - createjs.Ticker.getInterval();

				// Firefox needs the higest range (on average)
				expect(createjs.Ticker.getEventTime() | 0).toBeInRange(expected, 40);
				done();
			}, 1000);
		});
	});

	describe("SpriteSheetBuilder", function () {
		beforeEach(function () {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("#F00").drawCircle(0, 0, 30).beginFill("#C00").drawCircle(0, 0, 10);
			circle.setTransform(0, 0);

			var square = new createjs.Container();
			var squareBg = square.addChild(new createjs.Shape());
			squareBg.graphics.beginFill("#00F").drawRect(0, 0, 80, 80);

			var squareFld = square.addChild(new createjs.Text("1", "bold 72px Arial", "#9BF"));
			squareFld.textBaseline = "top";
			squareFld.textAlign = "center";
			squareFld.x = 40;
			square.bounds = new createjs.Rectangle(0, 0, 80, 80);

			// create the sprite sheet builder:
			this.builder = new createjs.SpriteSheetBuilder();

			var index = this.builder.addFrame(circle, new createjs.Rectangle(-30, -30, 60, 60));
			this.builder.addAnimation("circle", index);

			var frames = [];
			for (var i = 0; i < 5; i++) {
				index = this.builder.addFrame(square, null, 1, function (target, data) {
					squareFld.text = data;
				}, i);
				frames.push(index);
			}

			this.builder.addAnimation("square", [1], true);
			this.builder.addAnimation("square2", [2], true);
		});

		it("should build synchronously", function (done) {
			var spriteSheet = this.builder.build();

			var circle2 = new createjs.Sprite(spriteSheet, "circle");
			this.stage.addChild(circle2).set({x: 40, y: 120});

			var circle3 = new createjs.Sprite(spriteSheet, "circle");
			this.stage.addChild(circle3).set({x: 120, y: 120});

			var square2 = new createjs.Sprite(spriteSheet, "square");
			this.stage.addChild(square2);

			var square3 = new createjs.Sprite(spriteSheet, "square2");
			this.stage.addChild(square3).set({x: 80});

			this.compareBaseLine("assets/SpriteSheetBuilder.png", done, expect, 0.0075);
		});

		it("should build async", function (done) {
			var _this = this;
			this.builder.addEventListener("complete", function () {
				var spriteSheet = _this.builder.spriteSheet;
				var circle2 = new createjs.Sprite(spriteSheet, "circle");
				_this.stage.addChild(circle2).set({x: 40, y: 120});

				var circle3 = new createjs.Sprite(spriteSheet, "circle");
				_this.stage.addChild(circle3).set({x: 120, y: 120});

				var square2 = new createjs.Sprite(spriteSheet, "square");
				_this.stage.addChild(square2);

				var square3 = new createjs.Sprite(spriteSheet, "square2");
				_this.stage.addChild(square3).set({x: 80});

				_this.compareBaseLine("assets/SpriteSheetBuilder.png", done, expect, 0.0075);
			});

			this.builder.buildAsync();
		});
	});
});
