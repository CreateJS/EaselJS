    var Canvas   = require('canvas');
    Canvas.prototype.addEventListener = function() {};

    module.exports = {
        getElementById: function(canvas) {
            return canvas;
        },
        createElement: function() {
            return new Canvas();
        },
        addEventListener: function() {}
    };