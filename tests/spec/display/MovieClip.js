import MovieClip from "../../../src/display/MovieClip";
import Shape from "../../../src/display/Shape";
import Stage from "../../../src/display/Stage";

import { Tween } from "@createjs/tweenjs/src/Tween";
import { Ticker } from "@createjs/core/src/utils/Ticker";

import globals from "../../setup";
import Canvas from "canvas-prebuilt";

// skip movieclip tests, MC plugin is incomplete
describe.skip("MovieClip", () => {

	let stage, canvas, mc;

	beforeEach(() => {
		canvas = new Canvas();
		canvas.width = canvas.height = 200;
		stage = new Stage(canvas);
		mc = new MovieClip({
			labels: {
				start: 24,
				end: 0
			}
		});
		stage.addChild(mc);

		let child1 = new Shape();
		child1.graphics.beginFill("#999999").drawCircle(30, 30, 30);

		let child2 = new Shape();
		child2.graphics.beginFill("#5a9cfb").drawCircle(30, 30, 30);

		mc.timeline.addTween(Tween.get(child1).to({x: 0}).to({x: 60}, 50).to({x: 0}, 50));
		mc.timeline.addTween(Tween.get(child2).to({x: 60}).to({x: 0}, 50).to({x: 60}, 50));
		mc.timeline.labels = {start: "startLbl", end: "endLbl"};
	});

	it("getCurrentLabel", () => {
		mc.gotoAndStop("end");
		let lbl = mc.timeline.getCurrentLabel();
		expect(lbl).toBe("end");
	});

	it("getLabels", () => {
		let lbls = mc.labels;
		expect(lbls[0].position).toBe("startLbl");
	});

	it("gotoAndPlay", done => {
		mc.gotoAndPlay("start");

		globals.compareBaseLine("test_assets/gotoAndPlay.png", done, expect, .01);
	});

	it("gotoAndStop", done => {
		mc.gotoAndStop("end");

		globals.compareBaseLine("test_assets/gotoAndStop.png", done, expect, .01);
	});

	it("play", done => {
		mc.play();

		// Manually move the playhead forward a few frames.
		for (let i = 0; i < 10; i++) {
			stage.update();
		}

		globals.compareBaseLine("test_assets/play.png", done, expect, .01);
	});

	it("stop", done => {
		mc.play();
		Ticker.addEventListener("tick", stage);

		let _this = this;
		setTimeout(() => {
			let frame = _mc.currentFrame;
			_mc.stop();

			setTimeout(() => {
				expect(_mc.currentFrame).toBe(frame);
				Ticker.removeEventListener("tick", _stage);
				done();
			}, 100);
		}, 100);
	});
});
