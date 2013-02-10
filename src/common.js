var initialized,
    hasDocument = typeof document !== 'undefined',
    canvasSupported = hasDocument;

function createCanvasError() {
    throw new Error('createCanvas function is required when running in this context');
}

module.exports = function initalize(createCanvasFn) {
    if (initialized) return initialized;

    if (hasDocument) {
        window.createjs = window.createjs || {};
        try {
            var canvas = document.createElement('canvas');
            canvasSupported = !!(canvas.getContext && canvas.getContext('2d'));
        } catch (e) {
            canvasSupported = false;
        }
    } else {
        global.window = global.window || global;
        global.createjs = global.createjs || {};
    }

    createjs.createCanvas = (!canvasSupported && !createCanvasFn) ? createCanvasError : createCanvasFn;

    //require('./easeljs/utils/Log'); // no deps
    require('./easeljs/utils/UID'); // no deps
    require('./easeljs/events/EventDispatcher'); // no deps
    require('./easeljs/utils/Ticker'); // ../events/EventDispatcher
    require('./easeljs/events/MouseEvent'); // ./EventDispatcher
    require('./easeljs/geom/Matrix2D'); // no deps
    require('./easeljs/geom/Point'); // no deps
    require('./easeljs/geom/Rectangle'); // no deps
    require('./easeljs/ui/ButtonHelper'); // no deps
    require('./easeljs/display/Shadow'); // no deps
    require('./easeljs/display/Graphics'); // no deps
    require('./easeljs/display/DisplayObject'); // ../EventDispatcher, ../utils/UID, ../geom/Matrix2D, ./Stage, , ../geom/point
    require('./easeljs/display/Container'); // ./DisplayObject
    require('./easeljs/display/Stage'); // ./DisplayObject, ./Container, ../events/MouseEvent
    require('./easeljs/display/Bitmap'); // ./DisplayObject
    require('./easeljs/display/BitmapAnimation'); // ./DisplayObject, ../events/EventDispatcher
    require('./easeljs/display/Shape'); // ./DisplayObject, ./Graphics
    require('./easeljs/display/Text'); // ./DisplayObject
    require('./easeljs/display/SpriteSheet'); // ./DisplayObject, ../events/EventDispatcher, ../geom/Rectangle
    require('./easeljs/utils/SpriteSheetUtils');
    require('./easeljs/utils/SpriteSheetBuilder');
    require('./easeljs/display/DOMElement'); // ./DisplayObject
    require('./easeljs/filters/Filter'); // ../geom/Rectangle
    require('./easeljs/filters/AlphaMapFilter'); // ./Filter, ../geom/Rectangle
    require('./easeljs/filters/AlphaMaskFilter'); // ./Filter
    require('./easeljs/filters/BoxBlurFilter'); // ./Filter, ../geom/Rectangle
    require('./easeljs/filters/ColorFilter'); // ./Filter
    require('./easeljs/filters/ColorMatrix'); // ./Filter
    require('./easeljs/filters/ColorMatrixFilter'); // ./Filter
    require('./easeljs/ui/Touch'); // no deps

    // Prevent initializing again
    initialized = createjs;
    return initialized;
};
