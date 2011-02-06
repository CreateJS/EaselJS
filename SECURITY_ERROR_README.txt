When working with loaded images and canvas on your local file system, some browsers 
will throw security errors. This may occur when using SpriteSheetUtils or getObjectsUnderPoint, 
and lead to a number of other repeating errors.

To avoid this, test on a web server (a local web server should work fine), or test with a browser 
that doesn't throw these errors (Safari seems to work).

If you have python installed on your system you can enable a simple web server that's fine for 
local testing by navigating to the directory where your project resides typing the following
at your command line:

python -m SimpleHTTPServer

Your project is now available at:

http://localhost:8000/