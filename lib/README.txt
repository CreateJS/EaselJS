This directory contains a compressed version of the EaselJS library.

It is recommended that you use this version in almost all cases, unless you need to modify the original code. It is much smaller, results in less http requests, and you don't have to worry about the order in which you include the js files.

easeljs-VERSION.min.js is a single file that contains compacted versions of all of the EaselJS classes (comments and white space stripped) except the contents of easeljs/filters and easeljs/display/MovieClip.

movieclip-VERSION.min.js contains a compact version of the MovieClip class. This class is not commonly used for hand coded projects so it is packaged separately. Its version number is updated with EaselJS's version, but ONLY when the MovieClip class changes. For example, if MovieClip is updated when EaselJS is at version 0.5.0, but not when EaselJS is updated to 0.5.1, the minified version of MovieClip will remain at 0.5.0.

You can also gzip the file to further reduce its size (by about 75%). Many servers do this automatically.
