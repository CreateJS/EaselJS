describe("Events", function () {

	var eventDispatcher;

	beforeEach(function () {
		eventDispatcher = new createjs.EventDispatcher();
	});

	afterEach(function() {
		eventDispatcher.removeAllEventListeners();
	});

	it("dispatchEvent() and addEventListener() should work", function (done) {
		eventDispatcher.addEventListener("test", function(data) {
			expect(data.data).toBe("bar");
			done(true);
		});
		eventDispatcher.dispatchEvent({type:"test", target:this, data:"bar"});
	});

	it("dispatchEvent() and on() should work", function (done) {
		eventDispatcher.on("test", function(data) {
			expect(data.data).toBe("bar");
			done(true);
		});
		eventDispatcher.dispatchEvent({type:"test", target:this, data:"bar"});
	});

	it("hasEventlistener() should be true.", function () {
		eventDispatcher.addEventListener("test", function() { });
		expect(eventDispatcher.hasEventListener("test")).toBe(true);
	});

	it("removeEventListener() should work", function () {
		var foo = function() { };
		eventDispatcher.addEventListener("test", foo);
		eventDispatcher.removeEventListener("test", foo);
		expect(eventDispatcher.hasEventListener("test")).toBe(false);
	});

	it("off() should work", function () {
		var foo = function() { };
		eventDispatcher.addEventListener("test", foo);
		eventDispatcher.off("test", foo);
		expect(eventDispatcher.hasEventListener("test")).toBe(false);
	});

	it("removeAllEventListeners() should work", function () {
		eventDispatcher.addEventListener("test", function() { });
		eventDispatcher.addEventListener("test2", function() { });
		eventDispatcher.addEventListener("test3", function() { });

		eventDispatcher.removeAllEventListeners();

		expect(eventDispatcher.hasEventListener("test")).toBe(false);
		expect(eventDispatcher.hasEventListener("test2")).toBe(false);
		expect(eventDispatcher.hasEventListener("test3")).toBe(false);
	});

	it("willTrigger() should work", function () {
		var foo =  new createjs.Container();
		var bar =  new createjs.Container();

		foo.addChild(bar);

		foo.addEventListener("test", function() { });
		expect(bar.willTrigger("test")).toBe(true);
	});

	it("enableMouseOver() should work", function () {
		var stage = new createjs.Stage();
		stage.enableMouseOver(true);

		expect(stage._mouseOverIntervalID).not.toBe(null);
	});

});
