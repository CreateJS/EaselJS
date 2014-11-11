beforeEach(function (done) {
	this.assetsBasePath = "../examples/assets/";

	this.sColor = "#000";
	this.fColor = "#ff0000";

	this.stage = new createjs.Stage(imagediff.createCanvas(200, 200));

	jasmine.addMatchers(imagediff.jasmine);

	this.img = new Image();
	this.img.onload = function () {
		done();
	}
	this.img.src = this.assetsBasePath+"daisy.png";
	/**
	 * Compare each drawing to a pre-saved base line image.
	 * Need to has a small tolerance (100),
	 * to account for antialiasing differnces between the saved images also browser to browser to browser differnces.
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
			var tolerance = pixels * (pixelTolerance == null ? .005 : pixelTolerance);
			expect(stage.canvas).toImageDiffEqual(this, tolerance);
			done();
		}
	}
});
