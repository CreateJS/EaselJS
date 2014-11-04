describe("MovieClip", function () {
	beforeEach(function () {
		this.mc = new createjs.MovieClip(null, 0, true, {
			start: 24,
			end: 0
		});
		this.stage.addChild(this.mc);

		var child1 = new createjs.Shape();
		child1.graphics.beginFill("#999999").drawCircle(30, 30, 30);

		var child2 = new createjs.Shape();
		child2.graphics.beginFill("#5a9cfb").drawCircle(30, 30, 30);

		this.mc.timeline.addTween(createjs.Tween.get(child1).to({x: 0}).to({x: 60}, 50).to({x: 0}, 50));
		this.mc.timeline.addTween(createjs.Tween.get(child2).to({x: 60}).to({x: 0}, 50).to({x: 60}, 50));
		this.mc.timeline.setLabels({start: "startLbl", end: "endLbl"});
	});

	it("getCurrentLabel", function () {
		this.mc.gotoAndStop("end");
		var lbl = this.mc.timeline.getCurrentLabel();
		expect(lbl).toBe("end");
	});

	it("getLabels", function () {
		var lbls = this.mc.timeline.getLabels();
		expect(lbls[0].position).toBe("startLbl");
	});

	it("gotoAndPlay", function (done) {
		this.mc.gotoAndPlay("start");

		this.compareBaseLine("assets/gotoAndPlay.png", done, expect, .01);
	});

	it("gotoAndStop", function (done) {
		this.mc.gotoAndStop("end");

		this.compareBaseLine("assets/gotoAndStop.png", done, expect, .01);
	});

	it("play", function (done) {
		this.mc.play();

		// Manually move the playhead forward a few frames.
		for (var i = 0; i < 10; i++) {
			this.stage.update();
		}

		this.compareBaseLine("assets/play.png", done, expect, .01);
	});

	it("stop", function (done) {
		this.mc.play();
		createjs.Ticker.addEventListener("tick", this.stage);

		var _this = this;
		setTimeout(function () {
			var frame = _this.mc.currentFrame;
			_this.mc.stop();

			setTimeout(function () {
				expect(_this.mc.currentFrame).toBe(frame);
				createjs.Ticker.removeEventListener("tick", _this.stage);
				done();
			}, 100);
		}, 100);
	});
});
