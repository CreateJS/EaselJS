This directory contains a compressed version of the EaselJS library.

It is recommended that you use this version in almost all cases, unless you need to modify the original code. It is much smaller, results in less http requests, and you don't have to worry about the order in which you include the js files.

easeljs-VERSION.min.js is a single file that contains compacted versions of all of the EaselJS classes (comments and white space stripped) except the contents of easeljs/filters and easeljs/display/MovieClip.

movieclip-VERSION.min.js contains a compact version of the MovieClip class. This class is not commonly used for hand coded projects so it is packaged separately.

You can also gzip the file to further reduce its size (by about 75%). Many servers do this automatically.
