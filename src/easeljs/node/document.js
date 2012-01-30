    var Canvas   = require('canvas');

    module.exports = {
        getElementById: function(canvas) {
            canvas.addEventListener = function() {};
            return canvas;
        },
        createElement: function() {
            return new Canvas();
        },
        addEventListener: function() {}
    };