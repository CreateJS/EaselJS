/**
* Easeljs extension
*-----------------
* Adding width and height accessors to Bitmap object
* Author : Youssef
* Created : 03/05/2013
* Updated : 07/05/2013
* Email : mryoussef2012@gmail.com
**/


createjs.Bitmap.prototype.getWidth=function ()
{
  return this.image.width;
}

createjs.Bitmap.prototype.getHeight=function ()
{
	return this.image.height;
}

createjs.Bitmap.prototype.setWidth = function (newWidth)
{
	var image = this.image;
	var oldWidth = image.width;
	this.scaleX = newWidth/oldWidth;
	image.width = newWidth;
}

createjs.Bitmap.prototype.setHeight = function (newHeight)
{
	var image = this.image;
	var oldHeight = image.height;
	alert('newheight:'+newHeight+' - '+'oldheight:'+oldHeight);
	this.scaleY = newHeight/oldHeight;
	image.height = newHeight;
}


