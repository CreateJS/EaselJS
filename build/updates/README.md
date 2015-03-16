## Important ##

The current YUIDocs does not support @readonly on properties (only attributes). This folder contains an updated 
`builder.js`, which injects this support.

Copy `builder.js` into
 > node_modules/grunt-contrib-yuidoc/node-modules/yuidocjs/lib

Without this file, properties will not show the "readonly" flag.

Last tested with YUIDocs 0.5.2