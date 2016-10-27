module.exports = function (config) {
  // browsers and reporters set in gulpfile
  config.set({
    frameworks: [ "jasmine" ],
    basePath: "../",
    files: [
      // assets
      { pattern: "_assets/art/**/*.png", included: false },
      { pattern: "tests/assets/**/*", included: false },
      // deps
      "_assets/libs/tweenjs-NEXT.min.js",
      "_assets/libs/preloadjs-NEXT.min.js",
      // lib and sourcemaps
      /*"dist/easeljs.old.js",
      "dist/webgl.old.js",*/
       "dist/easeljs-NEXT.js",
      { pattern: "src/**/*.js", included: false },
      { pattern: "dist/easeljs-NEXT.map", included: false },
      // helpers
      "tests/helpers/helpers.js",
      "tests/helpers/js-imagediff/imagediff.js",
      // specs
      "tests/spec/*.js"
    ],
    proxies: {
      '/_assets/': '/base/_assets/',
      '/assets/': '/base/tests/assets/'
    }
  });
};
