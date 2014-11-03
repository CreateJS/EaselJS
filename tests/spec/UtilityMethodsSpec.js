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
			expect(createjs.Ticker.getTicks()).not.toBe(null);
		});

		it("getEventTime", function () {
			expect(createjs.Ticker.getTicks()).not.toBe(null);
		});

	});
});
