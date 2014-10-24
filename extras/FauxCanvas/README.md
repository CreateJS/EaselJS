# FauxCanvas

Can be passed to a Stage in place of a Canvas element in order to eliminate the browser-specific cost of drawing graphics to screen, and thereby isolate the time spent in EaselJS.
Still rough, and may be missing methods or properties that are necessary for certain features in EaselJS. See the code and example for more details.

	var stage = new createjs.Stage(new FauxCanvas(500, 400));
