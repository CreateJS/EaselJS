var customMatchers = {
	toBeInRange: function(util, customEqualityTesters) {
		return {
			compare: function(actual, excpected, range) {
				var result = {};
				range = range || 0;

				if (actual <= (excpected + range) && actual >= (excpected - range)) {
					result.pass = true;
				} else {
					result.pass = false;
				}
				return result;
			}
		};
	}
};

beforeAll(function(done) {
	this.assetsBasePath = "_assets/art/";
	this.sColor = "#000";
	this.fColor = "#ff0000";

	this.stageWidth = 200;
	this.stageHeight = 200;

	/**
	 * Compare each drawing to a pre-saved base line image.
	 * Need to have a small tolerance (100) to account for antialiasing differences between the saved images
	 * as well as browser to browser differences.
	 *
	 * @param path
	 * @param done
	 * @param expect
	 */
	this.compareBaseLine = function (path, done, expect, pixelTolerance) {
		var stage = this.stage;
		stage.update();

		var img = new Image();
		img.src = path;
		img.onload = function () {
			var pixels = this.width * this.height;
			var tolerance = pixels * (typeof pixelTolerance === 'undefined' ? 0.005 : pixelTolerance);
			expect(stage.canvas).toImageDiffEqual(this, tolerance);
			done();
		};
		img.onerror = function(){
			fail(img.src + ' failed to load');
			done();
		};
	};
	
	this.merge = function(dest, src) {
		for (var n in src) {
			dest[n] = src[n];
		}
		return dest;
	};

	var img = this.img = new Image();

	img.onload = function () {
		done();
	};

	img.onerror = function () {
		fail(img.src + ' failed to load');
		done();
	};

	img.src = "_assets/art/" + "daisy.png";
}, 5000);

beforeEach(function () {

	this.stage = new createjs.Stage(imagediff.createCanvas(200, 200));

	jasmine.addMatchers(imagediff.jasmine);
	jasmine.addMatchers(customMatchers);
});
