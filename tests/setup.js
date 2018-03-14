// run the master setup file first
require("@createjs/build/tests/setup");

const imagediff = require("imagediff");
const Canvas = require("canvas-prebuilt");
const { resolve } = require("path");

expect.extend(imagediff.jasmine);

module.exports = {
	rootPath: resolve(__dirname, "../") + "\\",
	sColor: "#000",
	fColor: "#ff0000",
	/**
	 * Compare each drawing to a pre-saved base line image.
	 * Needs to have a small tolerance (100),
	 * to account for antialiasing differnces between the saved images also browser to browser differences.
	 *
	 * @param {string} path
	 * @param {Function} done
	 * @param {Function} expect
	 * @param {HTMLCanvasElement|Canvas} canvas
	 * @param {number} [pixelTolerance=0.005]
	 */
	compareBaseLine (path, done, expect, canvas, pixelTolerance = 0.005) {
		const img = new Canvas.Image();
		img.onload = () => {
			/*console.log(canvas.toBuffer());
			require('fs').writeFile(this.rootPath + "tests/_output/canvas.png", canvas.toBuffer(), done);
			return;*/
			const canvasData = imagediff.toImageData(canvas);
			const imageData = imagediff.toImageData(img);
			const isEqual = imagediff.equal(canvasData, imageData, (img.height * img.width) * pixelTolerance);
			if (!isEqual) {
				imagediff.imageDataToPNG(canvasData, this.rootPath + "tests/_output/canvas.png", () => {
					imagediff.imageDataToPNG(imageData, this.rootPath + "tests/_output/image.png", () => {
						done('Images not equal.');
					});
				});
			} else {
				expect(isEqual).toBeTruthy();
				done();
			}
		};
		img.onerror = () => done(`${img.src} failed to load`);
		img.src = path;
	},
	merge (dest, src) {
		for (let n in src) {
			dest[n] = src[n];
		}
		return dest;
	}
};
