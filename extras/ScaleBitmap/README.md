# ScaleBitmap

Renders a bitmap texture by breaking up an image into a 3x3 grid to create a scaleable shape. Commonly referred to as a "Scale9" approach.

* Corners are rendered at 100% scale in their current container
* Top and bottom edges are stretched horizontally
* Left and right edges are stretched vertically
* The center region is stretched in both directions

Example using a 100x100 image:

	var sb = new createjs.ScaleBitmap(imagePathOrSrc, new createjs.Rectangle(10,10,80,80));
	sb.setDrawSize(newWidth, newHeight);
	stage.addChild(sb);


The second parameter (rectangle) defines the center rectangle (x, y, w, h) of the grid.

Check out the [ScaleBitmap.html](ScaleBitmap.html) file for example usage, which uses the following image:

![Sample Image](ScaleBitmapImage.png)

