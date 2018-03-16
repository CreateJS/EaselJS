// run the master setup file first
require("@createjs/build/tests/setup");

const Canvas = require("canvas-prebuilt");
const { resolve } = require("path");
const fs = require("fs");

function toImageDataFromImage (image) {
	let canvas = new Canvas();
	let context = canvas.getContext("2d");
	canvas.height = image.height;
	canvas.width = image.width;
	context.drawImage(image, 0, 0);
	return context.getImageData(0, 0, canvas.height, image.height);
}
function toImageDataFromCanvas (canvas) {
	return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
}
function equal (a, b, tolerance = 0) {
	if (a.height !== b.height || a.width !== b.width) { return false; }
	for (let i = a.length - 1; i >= 0; i--) {
		if (a[i] !== b[i] && Math.abs(a[i] - b[i]) > tolerance) {
			return false;
		}
	}
	return true;
}
function getBuffer (data) {
	let canvas = new Canvas();
	canvas.getContext("2d").putImageData(data, 0, 0);
	return new Buffer(canvas.toDataURL().replace(/^data:image\/\w+;base64,/,""), "base64");
}

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
	 * @param {Canvas} canvas
	 * @param {number} [pixelTolerance=0.005]
	 */
	compareBaseLine (path, done, expect, canvas, pixelTolerance = 0.005) {
		const img = new Canvas.Image();
		img.onload = () => {
			console.log(canvas, img);
			const canvasData = toImageDataFromCanvas(canvas);
			const imageData = toImageDataFromImage(img);
			const isEqual = equal(canvasData.data, imageData.data, img.height * img.width * pixelTolerance);
			if (!isEqual) {
				let folder = `${this.rootPath}tests/debug/`;
				fs.mkdir(folder, () => {
					folder = `${folder}/${global[Object.getOwnPropertySymbols(global)[1]].state.currentTestName.replace(/(\s|\.)/, "-").replace("()", "")}/`;
					fs.mkdir(folder, () => {
						fs.writeFile(`${folder}/canvas.png`, getBuffer(canvasData), () => {
							fs.writeFile(`${folder}/image.png`, getBuffer(imageData), () => {
								done("Images not equal.");
							});
						});
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
