# Context2DLog

Logs all method calls and property changes on a Context2D object. Useful for tracking how different EaselJS features are translated into Context2D to resolve bugs or identify opportunities for optimization.

	// setup:
	var myCanvas = document.getElementById("foo");
	var logger = new Context2DLog(myCanvas);
	
	// enable or disable:
	logger.setEnabled(false);
	
	// implement custom logging:
	logger.logMethod = function(method, args, returned) { ... }
	logger.logProperty = function(prop, oldVal, newVal) { ... }
