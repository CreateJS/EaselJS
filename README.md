# EaselJS

EaselJS is a library for building high-performance interactive 2D content in HTML5. It provides a feature-rich display 
list to allow you to manipulate and animate graphics. It also provides a robust interactive model for mouse and touch 
interactions.

It is excellent for building games, generative art, ads, data visualization, and other highly graphical experiences. It 
works well alone, or with the rest of the [CreateJS](http://createjs.com/) suite: [SoundJS](http://createjs.com/soundjs), 
[PreloadJS](http://createjs.com/preloadjs), and [TweenJS](http://createjs.com/tweenjs).

It has no external dependencies, and should be compatible with virtually any framework you enjoy using.

## Simple Example

```javascript
//Draw a square on screen.
var stage = new createjs.Stage('myCanvas');
var shape = new createjs.Shape();
shape.graphics.beginFill('red').drawRect(0, 0, 120, 120);
stage.addChild(shape);
stage.update();
```

## Sprite Animation Example
```javascript
var ss = new createjs.SpriteSheet({
	frames: {
		width: 32,
		height: 64,
		numFrames: 19
	},
	animations: {run: [0, 25], jump: [26, 63, "run"]},
	images: ["./assets/runningGrant.png"]
});
	
var sprite = new createjs.Sprite(ss, "run");
sprite.scaleY = sprite.scaleX = 0.4;
stage.addChild(sprite);
	
sprite.on("click", function() { sprite.gotoAndPlay("jump"); });
	
createjs.Ticker.on("tick", stage);
```

## Support and Resources
* Find examples and more information at the [EaselJS web site](http://easeljs.com/).
* Read the [documentation](http://createjs.com/docs/easeljs).
* Discuss, share projects, and interact with other users on [reddit](http://www.reddit.com/r/createjs/).
* Ask technical questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/easeljs).
* File verified bugs or formal feature requests using Issues on [GitHub](https://github.com/createjs/EaselJS/issues).
* There is a [Google Group](http://groups.google.com/group/createjs-discussion) for discussions and support.
* Have a look at the included [examples](https://github.com/CreateJS/EaselJS/tree/master/examples) and 
[API documentation](http://createjs.com/docs/easeljs/) for more in-depth information.

It was built by [gskinner.com](http://www.gskinner.com), and is released for free under the MIT license, which means you
can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a 
requirement.


## Classes

The API is inspired in part by Flash's display list, and should be easy to pick up for both JS and AS3 developers. Check 
out the [docs](http://createjs.com/docs/easeljs/) for more information.

**DisplayObject**
Abstract base class for all display elements in EaselJS. Exposes all of the display properties (ex. x, y, rotation, 
scaleX, scaleY, skewX, skewY, alpha, shadow, etc) that are common to all display objects.

**Stage**
The root level display container for display elements. Each time tick() is called on Stage, it will update and render 
the display list to its associated canvas.

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

**BitmapText**
Renders text using a SpriteSheet of letter.

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

A WebGL implementation currently exists, but is limited.

**StageGL**
A drop-in replacement for the EaselJS Stage class that fully supports a WebGL pipeline. StageGL will draw most Bitmap-
based content, including any cached DisplayObjects.

**WebGLInspector**
A utility and helper class designed to work with StageGL to help investigate and test performance or display problems. 
