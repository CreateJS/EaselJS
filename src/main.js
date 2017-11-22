/**
 * The Easel Javascript library provides a retained graphics mode for canvas including a full hierarchical display
 * list, a core interaction model, and helper classes to make working with 2D graphics in Canvas much easier.
 * EaselJS provides straight forward solutions for working with rich graphics and interactivity with HTML5 Canvas...
 *
 * <h4>Getting Started</h4>
 * To get started with Easel, create a {{#crossLink "Stage"}}{{/crossLink}} that wraps a CANVAS element, and add
 * {{#crossLink "DisplayObject"}}{{/crossLink}} instances as children. EaselJS supports:
 * <ul>
 *      <li>Images using {{#crossLink "Bitmap"}}{{/crossLink}}</li>
 *      <li>Vector graphics using {{#crossLink "Shape"}}{{/crossLink}} and {{#crossLink "Graphics"}}{{/crossLink}}</li>
 *      <li>Animated bitmaps using {{#crossLink "SpriteSheet"}}{{/crossLink}} and {{#crossLink "Sprite"}}{{/crossLink}}
 *      <li>Simple text instances using {{#crossLink "Text"}}{{/crossLink}}</li>
 *      <li>Containers that hold other DisplayObjects using {{#crossLink "Container"}}{{/crossLink}}</li>
 *      <li>Control HTML DOM elements using {{#crossLink "DOMElement"}}{{/crossLink}}</li>
 * </ul>
 *
 * All display objects can be added to the stage as children, or drawn to a canvas directly.
 *
 * <b>User Interactions</b><br />
 * All display objects on stage (except DOMElement) will dispatch events when interacted with using a mouse or
 * touch. EaselJS supports hover, press, and release events, as well as an easy-to-use drag-and-drop model. Check out
 * {{#crossLink "MouseEvent"}}{{/crossLink}} for more information.
 *
 * <h4>Simple Example</h4>
 * This example illustrates how to create and position a {{#crossLink "Shape"}}{{/crossLink}} on the {{#crossLink "Stage"}}{{/crossLink}}
 * using EaselJS' drawing API.
 *
 *	    //Create a stage by getting a reference to the canvas
 *	    stage = new createjs.Stage("demoCanvas");
 *	    //Create a Shape DisplayObject.
 *	    circle = new createjs.Shape();
 *	    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
 *	    //Set position of Shape instance.
 *	    circle.x = circle.y = 50;
 *	    //Add Shape instance to stage display list.
 *	    stage.addChild(circle);
 *	    //Update stage will render next frame
 *	    stage.update();
 *
 * <b>Simple Interaction Example</b><br>
 *
 *      displayObject.addEventListener("click", handleClick);
 *      function handleClick(event){
 *          // Click happenened
 *      }
 *
 *      displayObject.addEventListener("mousedown", handlePress);
 *      function handlePress(event) {
 *          // A mouse press happened.
 *          // Listen for mouse move while the mouse is down:
 *          event.addEventListener("mousemove", handleMove);
 *      }
 *      function handleMove(event) {
 *          // Check out the DragAndDrop example in GitHub for more
 *      }
 *
 * <b>Simple Animation Example</b><br />
 * This example moves the shape created in the previous demo across the screen.
 *
 *	    //Update stage will render next frame
 *	    createjs.Ticker.addEventListener("tick", handleTick);
 *
 *	    function handleTick() {
 *          //Circle will move 10 units to the right.
 *	    	circle.x += 10;
 *	    	//Will cause the circle to wrap back
 * 	    	if (circle.x > stage.canvas.width) { circle.x = 0; }
 *	    	stage.update();
 *	    }
 *
 * <h4>Other Features</h4>
 * EaselJS also has built in support for
 * <ul><li>Canvas features such as {{#crossLink "Shadow"}}{{/crossLink}} and CompositeOperation</li>
 *      <li>{{#crossLink "Ticker"}}{{/crossLink}}, a global heartbeat that objects can subscribe to</li>
 *      <li>Filters, including a provided {{#crossLink "ColorMatrixFilter"}}{{/crossLink}}, {{#crossLink "AlphaMaskFilter"}}{{/crossLink}},
 *      {{#crossLink "AlphaMapFilter"}}{{/crossLink}}, and {{#crossLink "BlurFilter"}}{{/crossLink}}. See {{#crossLink "Filter"}}{{/crossLink}}
 *      for more information</li>
 *      <li>A {{#crossLink "ButtonHelper"}}{{/crossLink}} utility, to easily create interactive buttons</li>
 *      <li>{{#crossLink "SpriteSheetUtils"}}{{/crossLink}} and a {{#crossLink "SpriteSheetBuilder"}}{{/crossLink}} to
 *      help build and manage {{#crossLink "SpriteSheet"}}{{/crossLink}} functionality at run-time.</li>
 * </ul>
 *
 * <h4>Browser Support</h4>
 * All modern browsers that support Canvas will support EaselJS (<a href="http://caniuse.com/canvas">http://caniuse.com/canvas</a>).
 * Browser performance may vary between platforms, for example, Android Canvas has poor hardware support, and is much
 * slower on average than most other browsers.
 *
 * @main EaselJS
 */

/**
 * README: Export Order
 *
 * Due to some classes having circular import bindings (whether at the top of the import chain or deeper in),
 * some exports here are in reverse order (such as Container being exported before DisplayObject).
 * This is explained here: https://github.com/rollup/rollup/issues/845#issuecomment-240277194
 */

// re-export shared classes
export { default as EventDispatcher } from "createjs/src/events/EventDispatcher";
export { default as Event } from "createjs/src/events/Event";
export { default as Ticker } from "createjs/src/utils/Ticker";
// display
export { default as StageGL } from "./display/StageGL";
export { default as Stage } from "./display/Stage";
export { default as Container } from "./display/Container";
export { default as DisplayObject } from "./display/DisplayObject";
export { default as Bitmap } from "./display/Bitmap";
export { default as BitmapText } from "./display/BitmapText";
export { default as DOMElement } from "./display/DOMElement";
export {
  default as Graphics,
  Arc,
  ArcTo,
  BeginPath,
  BezierCurveTo,
  Circle,
  ClosePath,
  Ellipse,
  Fill,
  LineTo,
  MoveTo,
  PolyStar,
  QuadraticCurveTo,
  Rect,
  RoundRect,
  Stroke,
  StrokeDash,
  StrokeStyle
} from "./display/Graphics";
// export { default as MovieClip } from "./display/MovieClip";
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
export { default as UID } from "./utils/UID";
export { default as WebGLInspector } from "./utils/WebGLInspector";
// version (templated in gulpfile, pulled from package).
export const version = "<%= version %>";
