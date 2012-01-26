# EASELJS

[EaselJS](http://easeljs.com/) is a library to make working with the Canvas element easier. It provides a display list to allow you to work with display elements on a canvas as nested objects. It also provides a simple framework for providing shape based mouse interactions on elements in the display list. This is useful for games, generative art, and other highly graphical experiences.

EaselJS is currently in alpha. We will be making significant improvements to the library, samples, and documentation over the coming weeks. Please be aware that this may necessitate changes to the existing API.

## Community

There is a Google Group for discussions and support at http://groups.google.com/group/easeljs

Submit bug reports to the [project issues page](https://github.com/gskinner/EaselJS/issues).

You can also find more information in the [project wiki](https://github.com/gskinner/EaselJS/wiki).

## Getting Started

You can see a hello world example [here](https://github.com/mindeavor/EaselJS/blob/master/examples/HelloWorld.html).

For more examples visit the project [examples folder](https://github.com/mindeavor/EaselJS/tree/master/examples).

You can also visit the [Articles and Tutorials](https://github.com/gskinner/EaselJS/wiki/Articles-and-Tutorials) wiki page.

## Overview

The API is inspired by Flash's display list, and should be easy to pick up for both JS and AS3 developers.

For more in-depth information, visit the [full API documentation](http://easeljs.com/docs/).

### Main Classes

- [DisplayObject](http://easeljs.com/docs/DisplayObject.html) - Abstract base class for all display elements in EaselJS. Exposes all of the display properties (ex. x, y, rotation, scaleX, scaleY, skewX, skewY, alpha, shadow, etc) that are common to all display objects.

- [Stage](http://easeljs.com/docs/Stage.html) - The root level display container for display elements. Each time tick() is called on Stage, it will update and render the display list to its associated canvas.

- [Container](http://easeljs.com/docs/Container.html) - A nestable display container, which lets you aggregate display objects and manipulate them as a group.

- [Bitmap](http://easeljs.com/docs/Bitmap.html) - Draws an image, video or canvas to the canvas according to its display properties.

- [BitmapAnimation](http://easeljs.com/docs/BitmapAnimation.html) - Displays animated or dynamic sprite sheets (images with multiple frames on a grid), and provides APIs for managing playback and sequencing.

- [Shape](http://easeljs.com/docs/Shape.html) - Renders a Graphics object within the context of the display list.

- [Graphics](http://easeljs.com/docs/Graphics.html) - Provides an easy to use API for drawing vector data. Can be used with Shape, or completely stand alone.

- [Text](http://easeljs.com/docs/Text.html) - Renders a single line of text to the stage.

- [DOMElement](http://easeljs.com/docs/DOMElement.html) - An experimental display object that allows you to manage an HTML element as a part of the display list.

- [Filter](http://easeljs.com/docs/DOMElement.html) - The base filter class that other filters (ex. BoxBlurFilter, ColorMatrixFilter, etc) extend.


### Helper Classes

- [Shadow](http://easeljs.com/docs/Shadow.html) - Defines all of the properties needed to display a shadow on a display object.

- [Ticker](http://easeljs.com/docs/Ticker.html) - Provides a pausable centralized tick manager for ticking Stage instances or other time based code.

- [UID](http://easeljs.com/docs/UID.html) - Very simple class that provides global, incremental unique numeric IDs.

- [SpriteSheetUtils](http://easeljs.com/docs/SpriteSheetUtils.html) - Contains utility methods for extending existing sprite sheets with flipped frames and extracting individual frames.

- [SpriteSheet](http://easeljs.com/docs/SpriteSheet.html) - Encapsulates all the data associated with a sprite sheet to be used with BitmapAnimation.

- [Matrix2D](http://easeljs.com/docs/Matrix2D.html) - Represents a 3x3 affine transformation matrix. Used internally for calculating concatenated transformations.

- [Rectangle](http://easeljs.com/docs/Rectangle.html) & [Point](http://easeljs.com/docs/Point.html) - epresent geometric data.

## About

EaselJS was built by gskinner.com, and is released for free under the MIT license, which means you can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a requirement.
