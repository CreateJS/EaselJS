### GL Shaders
The `glsl` files in this directory are not meant to be used outside of StageGL.

The CreateJS build process imports them into `shaders.js` as strings, where the
individual fragments are joined together and exported.

The `glsl` files might have comments, noting "prefix" or "suffix". This means
that the final definition of that shader contains the mentioned fragment. These
are not pieced together as part of a build process, but manually concatenated.

Several of the files also have {{templates}} where variables are injected at runtime.
