/**
 * The core classes of EaselJS.
 * @namespace easeljs
 *
 * @example
 * import { Stage, Shape } from "@createjs/easeljs";
 * const stage = new Stage("myCanvas");
 * const shape = new Shape();
 * shape.graphics.beginFill("red").drawCircle(0, 0, 50);
 * stage.addChild(shape);
 * stage.update();
 */

/**
 * README: Export Order
 *
 * Due to some classes having circular import bindings (whether at the top of the import chain or deeper in),
 * some exports here are in reverse order (such as Container being exported before DisplayObject).
 * This is explained here: https://github.com/rollup/rollup/issues/845#issuecomment-240277194
 */

// core
export { Event, EventDispatcher, Ticker } from "@createjs/core";

// display
export { default as StageGL } from "./display/StageGL";
export { default as Stage } from "./display/Stage";
export { default as Container } from "./display/Container";
export { default as DisplayObject } from "./display/DisplayObject";
export { default as Bitmap } from "./display/Bitmap";
export { default as BitmapText } from "./display/BitmapText";
export { default as DOMElement } from "./display/DOMElement";
export { default as Graphics } from "./display/Graphics";
export { default as MovieClip } from "./display/MovieClip";
export { default as Shadow } from "./display/Shadow";
export { default as Shape } from "./display/Shape";
export { default as Sprite } from "./display/Sprite";
export { default as SpriteSheet } from "./display/SpriteSheet";
export { default as Text } from "./display/Text";
// events
export { default as MouseEvent } from "./events/MouseEvent";
// filters
export { default as AlphaMapFilter } from "./filters/AlphaMapFilter";
export { default as AlphaMaskFilter } from "./filters/AlphaMaskFilter";
export { default as BitmapCache } from "./filters/BitmapCache";
export { default as BlurFilter } from "./filters/BlurFilter";
export { default as ColorFilter } from "./filters/ColorFilter";
export { default as ColorMatrix } from "./filters/ColorMatrix";
export { default as ColorMatrixFilter } from "./filters/ColorMatrixFilter";
export { default as Filter } from "./filters/Filter";
// geom
export { default as DisplayProps } from "./geom/DisplayProps";
export { default as Matrix2D } from "./geom/Matrix2D";
export { default as Point } from "./geom/Point";
export { default as Rectangle } from "./geom/Rectangle";
// ui
export { default as ButtonHelper } from "./ui/ButtonHelper";
export { default as Touch } from "./ui/Touch";
// utils
export { default as SpriteSheetBuilder } from "./utils/SpriteSheetBuilder";
export { default as SpriteSheetUtils } from "./utils/SpriteSheetUtils";
export { default as uid } from "./utils/uid";
export { default as createCanvas } from "./utils/Canvas";
export { default as WebGLInspector } from "./utils/WebGLInspector";
