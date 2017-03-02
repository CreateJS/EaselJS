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
      // lib and sourcemap
      "dist/easeljs-NEXT.js",
      { pattern: "src/**/*.js", included: false },
      { pattern: "dist/easeljs-NEXT.js.map", included: false },
      // helpers
      "tests/helpers/helpers.js",
      "node_modules/imagediff/js/imagediff.js",
      // specs
      "tests/spec/*.js"
    ],
    preprocessors: {
      "**/*.js": [ "sourcemap" ]
    },
    proxies: {
      '/_assets/': '/base/_assets/',
      '/assets/': '/base/tests/assets/'
    }
  });
};
