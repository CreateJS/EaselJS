xdescribe("Deprecated Methods and Properties", function () {


	describe("Deprecated Functions", function() {

		beforeEach(function() {
			this.stage = new createjs.Stage("canvas");
			this.container = new createjs.Container();
			this.stage.addChild(this.container);
			this.shape = new createjs.Shape();
			this.graphics = this.shape.graphics.f("red").dc(0,0,50);
			this.container.addChild(this.shape, new createjs.Shape());

			this.movieclip = new createjs.MovieClip(null, 0, true, {start:1, end:5});
			this.movieclip.timeline.addTween(createjs.Tween.get(s).to({x:60}).to({x:0}, 50).to({x:60}, 50));
			this.movieclip.gotoAndStop(5);

			this.spritesheet = new createjs.SpriteSheet({
				images: ["image.png"],
				frames: {width:50, height:50},
				animations: { stand:0, run:[1,5], jump:[6,8,"run"] }
			});
			this.helper = new createjs.ButtonHelper(this.movieclip, "out", "over", "down", false, this.movieclip, "hit");
		});

		it("Ticker setInterval/getInterval", function() {
			createjs.Ticker.setInterval(300);
			expect(createjs.Ticker.getInterval()).toBe(300);
		});

		it("Ticker setFPS/getFPS", function() {
			createjs.Ticker.setFPS(60);
			expect(createjs.Ticker.getFPS()).toBeCloseTo(60);
		});

		it("Container numChildren", function() {
			expect(this.container.getNumChildren()).toBe(2);
		});

		it("DisplayObject getStage", function() {
			expect(this.container.getStage()).toBe(this.stage);
		});

		it ("Graphics getInstructions", function() {
			expect(this.graphics.getInstructions().length).toBe(3);
		});

		it("MovieClip getLabels", function() {
			expect(this.movieclip.getLabels().length).toBe(2);
		});

		it("MovieClip getCurrentLabel", function() {
			expect(this.movieclip.getCurrentLabel()).toBe("end");
		});

		it("MovieClip getDuration", function() {
			expect(this.movieclip.getDuration()).toBe(100);
		});

		it("SpriteSheet getAnimations", function() {
			expect(this.spriteSheet.getAnimations().length).toBe(3);
		});

		it("ButtonHelper getEnabled/setEnabled", function() {
			helper.setEnabled(false);
			expect(helper.getEnabled()).toBe(false);
		});

		it("SpriteSheetUtils addFlippedFrames", function() {
			expect(createjs.SpriteSheetUtils.addFlippedFrames()).toBeNull();
		});

		it("SpriteSheetUtils mergeAlpha", function() {
			expect(createjs.SpriteSheetUtils.mergeAlpha()).toBeNull();
		});


	});

});
