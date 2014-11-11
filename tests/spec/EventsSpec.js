describe("Events", function () {

	var eventDispatcher;

	beforeEach(function () {
		eventDispatcher = new createjs.EventDispatcher();
	});

	afterEach(function () {
		eventDispatcher.removeAllEventListeners();
	});

	it("dispatchEvent() and addEventListener() should work", function (done) {
		eventDispatcher.addEventListener("test", function (data) {
			expect(data.data).toBe("bar");
			done(true);
		});
		eventDispatcher.dispatchEvent({
										  type: "test",
										  target: this,
										  data: "bar"
									  });
	});

	it("dispatchEvent() and on() should work", function (done) {
		eventDispatcher.on("test", function (data) {
			expect(data.data).toBe("bar");
			done(true);
		});
		eventDispatcher.dispatchEvent({
										  type: "test",
										  target: this,
										  data: "bar"
									  });
	});

	it("hasEventlistener() should be true.", function () {
		eventDispatcher.addEventListener("test", function () {
		});
		expect(eventDispatcher.hasEventListener("test")).toBe(true);
	});

	it("removeEventListener() should work", function () {
		var foo = function () {
		};
		eventDispatcher.addEventListener("test", foo);
		eventDispatcher.removeEventListener("test", foo);
		expect(eventDispatcher.hasEventListener("test")).toBe(false);
	});

	it("off() should work", function () {
		var foo = function () {
		};
		eventDispatcher.addEventListener("test", foo);
		eventDispatcher.off("test", foo);
		expect(eventDispatcher.hasEventListener("test")).toBe(false);
	});

	it("removeAllEventListeners() should work", function () {
		eventDispatcher.addEventListener("test", function () {
		});
		eventDispatcher.addEventListener("test2", function () {
		});
		eventDispatcher.addEventListener("test3", function () {
		});

		eventDispatcher.removeAllEventListeners();

		expect(eventDispatcher.hasEventListener("test")).toBe(false);
		expect(eventDispatcher.hasEventListener("test2")).toBe(false);
		expect(eventDispatcher.hasEventListener("test3")).toBe(false);
	});

	it("willTrigger() should work", function () {
		var foo = new createjs.Container();
		var bar = new createjs.Container();

		foo.addChild(bar);

		foo.addEventListener("test", function () {
		});
		expect(bar.willTrigger("test")).toBe(true);
	});

	it("enableMouseOver() should work", function () {
		this.stage.enableMouseOver(true);

		expect(this.stage._mouseOverIntervalID).not.toBe(null);
	});

	it("Events should bubble.", function (done) {
		var a = new createjs.Container();
		var b = new createjs.Container();
		var c = new createjs.Container();

		var timeout = setTimeout(function () {
			expect(true).toBe(false);
			done();
		}, 10);

		a.addEventListener("foo", function () {
			clearTimeout(timeout);
			expect(true).toBe(true);
			done();
		});

		a.addChild(b);
		b.addChild(c);

		c.dispatchEvent(new createjs.Event("foo", true));
	});

	it("Events should not bubble.", function (done) {
		var a = new createjs.Container();
		var b = new createjs.Container();
		var c = new createjs.Container();

		var timeout = setTimeout(function () {
			expect(true).toBe(true);
			done();
		}, 10);

		a.addEventListener("foo", function () {
			clearTimeout(timeout);
			expect(true).toBe(false);
			done();
		});

		a.addChild(b);
		b.addChild(c);

		c.dispatchEvent(new createjs.Event("foo", false));
	});

	it("event.useCapture should work.", function (done) {
		var a = new createjs.Container();
		var b = new createjs.Container();
		var c = new createjs.Container();

		// Fail condition
		var timeout = setTimeout(function () {
			expect(true).toBe(false);
			done();
		}, 10);

		// Success
		a.addEventListener("foo", function (evt) {
			clearTimeout(timeout);
			expect(evt.eventPhase).toBe(1);
			done();
		}, true);

		a.addChild(b);
		b.addChild(c);
		c.dispatchEvent(new createjs.Event("foo", true));
	});

	it("event.stopPropagation() should work.", function (done) {
		var a = new createjs.Container();
		var b = new createjs.Container();
		var c = new createjs.Container();
		var d = new createjs.Container();

		// Success
		var timeout = setTimeout(function () {
			expect(true).toBe(true);
			done();
		}, 10);

		// Should not get called
		c.addEventListener("foo", function (evt) {
			clearTimeout(timeout);
			expect(true).toBe(false);
			done();
		}, false);

		a.addChild(b);

		a.addEventListener("foo", function (evt) {
			evt.stopPropagation();
		}, true);
		b.addChild(c);

		c.addChild(d);

		d.dispatchEvent(new createjs.Event("foo", true));
	});

	it("event.stopImmediatePropagation() should work.", function (done) {
		var a = new createjs.Container();
		var b = new createjs.Container();
		var c = new createjs.Container();
		var d = new createjs.Container();

		// Success
		var timeout = setTimeout(function () {
			expect(true).toBe(true);
			done();
		}, 10);

		// Should not get called
		c.addEventListener("foo", function (evt) {
			clearTimeout(timeout);
			expect(true).toBe(false);
			done();
		}, true);

		a.addChild(b);

		b.addEventListener("foo", function (evt) {
			evt.stopImmediatePropagation();
		}, true);
		b.addChild(c);

		c.addChild(d);

		d.dispatchEvent(new createjs.Event("foo", true));
	});

	it("event.preventDefault() should work.", function (done) {
		var a = new createjs.Container();
		var b = new createjs.Container();
		var c = new createjs.Container();

		var timeout = setTimeout(function () {
			expect(true).toBe(true);
			done();
		}, 10);

		a.addEventListener("foo", function (evt) {
			clearTimeout(timeout);
			expect(evt.defaultPrevented).toBe(true);
			done();
		});

		a.addChild(b);

		b.addEventListener("foo", function (evt) {
			evt.preventDefault();
		});
		b.addChild(c);

		c.dispatchEvent(new createjs.Event("foo", true, true));
	});

});
