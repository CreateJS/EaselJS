(function() {

	var SimpleScroller = function(width, height, displayLabel) {
		this.initialize(width, height, displayLabel);
	};
	var p = SimpleScroller.prototype = new createjs.Container(); // inherit from Container
	p.bar;
	p.track;
	p.width;
	p.height;
	p.max;
	p.min;
	p.value;
	p.label;
	p.displayLabel;

	p.Container_initialize = p.initialize;
	p.initialize = function(width, height, displayLabel) {
		this.Container_initialize();

		this.width = width;
		this.height = height;
		this.displayLabel = displayLabel;
		this.bar = new createjs.Shape();
		this.bar.graphics.f("#3281FF").dr(0, 0, height, height).ef();

		this.track = new createjs.Shape();
		this.track.graphics.f("#000000").dr(0, 0, width, height).ef();

		this.bar.x = this.x;
		this.bar.y = this.y;
		this.track.x = this.x;
		this.track.y = this.y;
		this.max = 1;
		this.min = 0;

		this.addChild(this.track, this.bar);
		if (this.displayLabel != null) {
			this.label = new createjs.Text("Amount:0", "bold 30px Arial", "#777777");
			this.label.y = this.height;
			this.addChild(this.label);
		}

		this.addEventListener("click", this.updatePosition);
		this.addEventListener("pressmove", this.updatePosition);

		this.bar.x = this.width - this.height >> 1;
	};

	p.updateLabel = function () {

		this.label.text = this.displayLabel + ":" + this.value;
	};

	p.updatePosition = function (evt) {
		var target = (evt&&evt.currentTarget)||this;
        var pt = target.globalToLocal(evt.rawX, evt.rawY);
		target.bar.x = Math.max(0, Math.min(pt.x - target.height / 2, (target.track.x+(target.width)) - target.height));
		target.value = (target.bar.x) / ((target.track.x+target.width)-target.height)*(target.max-target.min)+target.min | 0;

		if (target.label != null) {
			target.updateLabel();
		}

		target.dispatchEvent("change");
	};

	window.SimpleScroller = SimpleScroller;
}());
