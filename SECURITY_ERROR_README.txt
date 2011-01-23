When working with loaded images and canvas on your local file system, some browsers will throw security errors. This may occur when using SpriteSheetUtils or getObjectsUnderPoint, and lead to a number of other repeating errors.

To avoid this, test on a web server (a local web server should work fine), or test with a browser that doesn't throw these errors (Safari seems to work).