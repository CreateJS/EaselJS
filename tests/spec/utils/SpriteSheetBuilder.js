import Container from "../../../src/display/Container";
import Shape from "../../../src/display/Shape";
import Sprite from "../../../src/display/Sprite";
import Stage from "../../../src/display/Stage";
import Text from "../../../src/display/Text";
import Rectangle from "../../../src/geom/Rectangle";
import SpriteSheetBuilder from "../../../src/utils/SpriteSheetBuilder";

import globals from "../../setup";
import Canvas from "canvas-prebuilt";

describe("SpriteSheetBuilder", () => {

	let stage, canvas, builder;

  beforeEach(() => {
		canvas = new Canvas();
		canvas.width = canvas.height = 200;
		stage = new Stage(canvas);
    let circle = new Shape();
    circle.graphics.beginFill("#F00").drawCircle(0, 0, 30).beginFill("#C00").drawCircle(0, 0, 10);
    circle.setTransform(0, 0);

    let square = new Container();
    let squareBg = square.addChild(new Shape());
    squareBg.graphics.beginFill("#00F").drawRect(0, 0, 80, 80);

    let squareFld = square.addChild(new Text("1", "bold 72px Arial", "#9BF"));
    squareFld.textBaseline = "top";
    squareFld.textAlign = "center";
    squareFld.x = 40;
    square.bounds = new Rectangle(0, 0, 80, 80);

    // create the sprite sheet builder:
    builder = new SpriteSheetBuilder();

    let index = builder.addFrame(circle, new Rectangle(-30, -30, 60, 60));
    builder.addAnimation("circle", index);

    let frames = [];
    for (let i = 0; i < 5; i++) {
      index = builder.addFrame(square, null, 1, (target, data) => {
        squareFld.text = data;
      }, i);
      frames.push(index);
    }

    builder.addAnimation("square", [1], true);
    builder.addAnimation("square2", [2], true);
  });

  it("should build synchronously", done => {
    let spriteSheet = builder.build();

    let circle2 = new Sprite(spriteSheet, "circle");
    stage.addChild(circle2).set({x: 40, y: 120});

    let circle3 = new Sprite(spriteSheet, "circle");
    stage.addChild(circle3).set({x: 120, y: 120});

    let square2 = new Sprite(spriteSheet, "square");
    stage.addChild(square2);

    let square3 = new Sprite(spriteSheet, "square2");
    stage.addChild(square3).set({x: 80});

    globals.compareBaseLine(globals.rootPath + "tests/assets/SpriteSheetBuilder.png", done, expect, canvas, 0.0075);
  });

  it("should build async", done => {
    builder.addEventListener("complete", () => {
      let spriteSheet = builder.spriteSheet;
      let circle2 = new Sprite(spriteSheet, "circle");
      stage.addChild(circle2).set({x: 40, y: 120});

      let circle3 = new Sprite(spriteSheet, "circle");
      stage.addChild(circle3).set({x: 120, y: 120});

      let square2 = new Sprite(spriteSheet, "square");
      stage.addChild(square2);

      let square3 = new Sprite(spriteSheet, "square2");
      stage.addChild(square3).set({x: 80});

      globals.compareBaseLine(globals.rootPath + "tests/assets/SpriteSheetBuilder.png", done, expect, canvas, 0.0075);
    });

    builder.buildAsync();
  });
});
