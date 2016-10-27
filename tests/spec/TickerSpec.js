// TODO: Move this test to the Combined repo.

describe("Ticker", function () {

	beforeEach(function () {
		createjs.Ticker.reset();
		createjs.Ticker.init();
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
					expect(evt.delta).toBeInRange(createjs.Ticker.interval, 5);
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

		it("paused", function (done) {
			createjs.Ticker.paused = true;

			// tick event should also also be paused.
			var func = function (evt) {
				expect(evt.paused).toBe(true);
				createjs.Ticker.removeEventListener("tick", func);
				done();
			};
			createjs.Ticker.addEventListener("tick", func);
		});

		it("get framerate", function () {
			createjs.Ticker.interval = 40;
			expect(createjs.Ticker.framerate).toBe(25);
		});

		it("set framerate", function (done) {
			createjs.Ticker.framerate = 40;
			setTimeout(function () {
				expect(createjs.Ticker.getTime() | 0).toBeInRange(40 * 2, 3);
				done();
			}, 40 * 2);
		});

		it("getMeasuredFPS", function (done) {
			setTimeout(function () {
				expect(createjs.Ticker.getMeasuredFPS()).toBeInRange(createjs.Ticker.framerate, 5);
				done();
			}, 1000);
		});

		it("getMeasuredTickTime", function () {
			expect(createjs.Ticker.getMeasuredTickTime() | 0).not.toBe(null);
		});

		it("getTicks", function (done) {
			setTimeout(function () {
				expect(createjs.Ticker.getTicks()).toBeInRange(createjs.Ticker.framerate, 5);
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
				var expected = (createjs.Ticker.interval * createjs.Ticker.framerate) - createjs.Ticker.interval;

				// Firefox needs the higest range (on average)
				expect(createjs.Ticker.getEventTime() | 0).toBeInRange(expected, 40);
				done();
			}, 1000);
		});
	});
});
