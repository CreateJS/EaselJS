describe("Utlity Methods", function () {

	beforeEach(function () {
		createjs.Ticker.reset();
	});

	it("indexOf()", function () {
		var arr = [1, 2, 3, 4, 5];
		expect(createjs.indexOf(arr, 3)).toBe(2);
	});

	describe("Ticker", function (done) {

		it("createjs.Ticker.addEventListener(tick)", function (done) {
			var tick = function () {
				expect(true).toBe(true);
				done();

				createjs.Ticker.removeEventListener("tick", tick);
			}
			createjs.Ticker.addEventListener("tick", tick);
		});

		it("setPaused", function () {
			createjs.Ticker.setPaused(true);
			expect(createjs.Ticker.getPaused()).toBe(true);
		});

		it("getFPS", function () {
			createjs.Ticker.setInterval(40);
			expect(createjs.Ticker.getFPS()).toBe(25);
			expect(createjs.Ticker.getInterval()).toBe(40);
		});

		it("setFPS", function () {
			createjs.Ticker.setFPS(40);
			expect(createjs.Ticker.getFPS()).toBe(40);
		});

		it("getMeasuredFPS", function () {
			expect(createjs.Ticker.getMeasuredFPS()).not.toBe(null);
		});

		it("getMeasuredTickTime", function () {
			expect(createjs.Ticker.getMeasuredTickTime()).not.toBe(null);
		});

		it("getTicks", function () {
			expect(createjs.Ticker.getTicks()).not.toBe(null);
		});

		it("getTime", function () {
			expect(createjs.Ticker.getTime()).not.toBe(null);
		});

		it("getEventTime", function () {
			expect(createjs.Ticker.getEventTime()).not.toBe(null);
		});
	});

	it("SpriteSheetBuilder", function(done) {
		var circle = new createjs.Shape();
		circle.graphics.beginFill("#F00").drawCircle(0,0,30).beginFill("#C00").drawCircle(0,0,10);
		circle.setTransform(0,0);

		var square = new createjs.Container();
		var squareBg = square.addChild(new createjs.Shape());
		squareBg.graphics.beginFill("#00F").drawRect(0,0,80,80);

		var squareFld = square.addChild(new createjs.Text("1", "bold 72px Arial", "#9BF"));
		squareFld.textBaseline = "top";
		squareFld.textAlign = "center";
		squareFld.x = 40;
		square.bounds = new createjs.Rectangle(0,0,80,80);

		// create the sprite sheet builder:
		var builder = new createjs.SpriteSheetBuilder();

		var index = builder.addFrame(circle, new createjs.Rectangle(-30, -30,60,60));
		builder.addAnimation("circle", index);

		var frames = [];
		for (var i=0; i<5; i++) {
			index = builder.addFrame(square, null, 1, function(target, data) { squareFld.text=data; }, i);
			frames.push(index);
		}

		builder.addAnimation("square", [1], true);
		builder.addAnimation("square2", [2], true);

		var spriteSheet = builder.build();

		var circle2 = new createjs.Sprite(spriteSheet, "circle");
		this.stage.addChild(circle2).set({x:40, y:120});

		var circle3 = new createjs.Sprite(spriteSheet, "circle");
		this.stage.addChild(circle3).set({x:120, y:120});

		var square2 = new createjs.Sprite(spriteSheet, "square");
		this.stage.addChild(square2);

		var square3 = new createjs.Sprite(spriteSheet, "square2");
		this.stage.addChild(square3).set({x:80});

		this.compareBaseLine("assets/SpriteSheetBuilder.png", done, expect, 0.001);
	});
});
