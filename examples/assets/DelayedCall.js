(function(window) {

	var DelayedCall = function (scope, handler, time, params) { this.init(scope, handler, time, params); }
	var p = DelayedCall.prototype = {};

	p.init = function(scope, handler, time, params) {
		this.scope = scope;
		this.handler = handler;
		this.time = time;
		this.params = params;

		var _this = this;
		setTimeout(function() { _this._handleDelay(); }, time);
	}

	p._handleDelay = function() {
		this.handler.apply(this.scope, this.params);
	}

	window.DelayedCall = DelayedCall;

})(window);