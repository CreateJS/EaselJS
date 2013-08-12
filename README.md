# EaselJS

EaselJS is a library to make working with the Canvas element easier. It provides a display list to allow you to work with display elements on a canvas as nested objects. It also provides a simple framework for providing shape based mouse interactions on elements in the display list. This is useful for games, generative art, and other highly graphical experiences.

## Simple Example

	//Draw a square on screen.
	var canvas = document.getElementById('canvas');
	var stage = new createjs.Stage(canvas);
	var shape = new createjs.Shape();
	shape.graphics.beginFill('rgba(255,0,0,1)').drawRoundRect(0, 0, 120, 120, 10);
	stage.addChild(shape);
	stage.update();

## Animation Example
	var ss = new createjs.SpriteSheet({
		"frames": {
			"width": 200,
			"numFrames": 64,
			"regX": 2,
			"regY": 2,
			"height": 361
		},
		"animations": {"jump": [26, 63], "run": [0, 25]},
		"images": ["./assets/runningGrant.png"]
	});
	
	ss.getAnimation("run").speed = 2;
	ss.getAnimation("run").next = "jump";
	ss.getAnimation("jump").next = "run";
	
	var sprite = new createjs.Sprite(ss, "run");
	sprite.scaleY = sprite.scaleX = 0.4;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);
	stage.addChild(sprite);


## Support and Resources
* Find examples and more information at the [EaselJS web site](http://easeljs.com/)
* Read the [documentation](http://createjs.com/Docs/EaselJS)
* Post questions and interact with other users at our [Community](http://community.createjs.com) site.
* There is a [Google Group](http://groups.google.com/group/createjs-discussion) for discussions and support.
* Have a look at the included [examples](https://github.com/CreateJS/EaselJS/tree/master/examples) and [API documentation](http://createjs.com/Docs/EaselJS/) for more in-depth information.

It was built by [gskinner.com](http://www.gskinner.com), and is released for free under the MIT license, which means you
can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a requirement.


## Classes

The API is inspired by Flash's display list, and should be easy to pick up for both JS and AS3 developers. Check out the [docs](http://createjs.com/Docs/EaselJS/) for more information.

**DisplayObject**
Abstract base class for all display elements in EaselJS. Exposes all of the display properties (ex. x, y, rotation, scaleX, scaleY, skewX, skewY, alpha, shadow, etc) that are common to all display objects.

**Stage**
The root level display container for display elements. Each time tick() is called on Stage, it will update and render the display list to its associated canvas.

**Container**
A nestable display container, which lets you aggregate display objects and manipulate them as a group.

**Bitmap**
Draws an image, video or canvas to the canvas according to its display properties.

**Sprite**
Displays single frames or animations from sprite sheets, and provides APIs for managing playback and sequencing.

**Shape**
Renders a Graphics object within the context of the display list.

**Graphics**
Provides an easy to use API for drawing vector data. Can be used with Shape, or completely stand alone.

**Text**
Renders a single line of text to the stage.

**DOMElement**
An experimental display object that allows you to manage an HTML element as a part of the display list.

**Filter**
The base filter class that other filters (ex. BlurFilter, ColorMatrixFilter, etc) extend.


There are also a few helper classes included:

**Shadow**
Defines all of the properties needed to display a shadow on a display object.

**Ticker**
Provides a pausable centralized tick manager for ticking Stage instances or other time based code.

**UID**
Very simple class that provides global, incremental unique numeric IDs.

**SpriteSheet**
Encapsulates all the data associated with a sprite sheet to be used with Sprite.

**SpriteSheetUtils**
Contains utility methods for extending existing sprite sheets with flipped frames and extracting individual frames.

**SpriteSheetBuilder**
Build a bitmap SpriteSheet from vector graphics at run time. Get the filesize savings of vector, with the performance
of a SpriteSheet.

**Matrix2D**
Represents a 3x3 affine transformation matrix. Used internally for calculating concatenated transformations.

**Rectangle**
Represents a rectangle as defined by the points (x, y) and (x+width, y+height).

**Point**
Represents a point on a 2 dimensional x / y coordinate system.