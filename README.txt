EASEL JS LIBRARY:

Easel is a library to make working with the Canvas element easier. It provides a display list to allow you to work with display elements on a canvas as nested objects. It also provides a simple framework for providing shape based mouse interactions on elements in the display list. This is useful for games, generative art, and other highly graphical experiences.

It was built by gskinner.com, and is released for free under the MIT license, which means you can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a requirement.

The latest version of Easel can be found at http://easeljs.com/

Easel is currently in alpha. We will be making significant improvements to the library, samples, and documentation over the coming weeks. Please be aware that this may necessitate changes to the existing API.


The API is inspired by Flash's display list, and should be easy to pick up for both JS and AS3 developers. The key classes are:

DisplayObject
Abstract base class for all display elements in Easel. Exposes all of the display properties (ex. x, y, rotation, scaleX, scaleY, alpha, shadow, etc) that are common to all display objects.

Stage
The root level display container for display elements. Each time tick() is called on Stage, it will update and render the display list to its associated canvas.

Container
A nestable display container, which lets you aggregate display objects and manipulate them as a group.

Bitmap
Draws an image, video or canvas to the canvas according to its display properties.

BitmapSequence
Displays animated or dynamic sprite sheets (images with multiple frames on a grid), and provides APIs for managing playback and sequencing.

Shape
Renders a Graphics object within the context of the display list.

Graphics
Provides an easy to use API for drawing vector data. Can be used with Shape, or completely stand alone.

Text
Renders a single line of text to the stage.


There are also a few helper classes included:

Shadow
Defines all of the properties needed to display a shadow on a display object.

Ticker
Provides a pausable centralized tick manager for ticking Stage instances or other time based code.

UID
Very simple class that provides global, incremental unique numeric IDs.

SpriteSheetUtils
Contains utility methods for extending existing sprite sheets with flipped frames, and for outputting/debugging frame data objects.

SpriteSheet
Encapsulates all the data associated with a sprite sheet to be used with BitmapSequence.

CoordTransform
Contains methods for transforming positions between different coordinate spaces.

Matrix2D
Represents a 3x3 affine transformation matrix. Used internally for calculating concatenated transformations.

Rectangle & Point
Represent geometric data.


Have a look at the included examples and API documentation for more in-depth information.