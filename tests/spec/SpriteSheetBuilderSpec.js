describe("SpriteSheetBuilder", function () {
  beforeEach(function () {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("#F00").drawCircle(0, 0, 30).beginFill("#C00").drawCircle(0, 0, 10);
    circle.setTransform(0, 0);

    var square = new createjs.Container();
    var squareBg = square.addChild(new createjs.Shape());
    squareBg.graphics.beginFill("#00F").drawRect(0, 0, 80, 80);

    var squareFld = square.addChild(new createjs.Text("1", "bold 72px Arial", "#9BF"));
    squareFld.textBaseline = "top";
    squareFld.textAlign = "center";
    squareFld.x = 40;
    square.bounds = new createjs.Rectangle(0, 0, 80, 80);

    // create the sprite sheet builder:
    this.builder = new createjs.SpriteSheetBuilder();

    var index = this.builder.addFrame(circle, new createjs.Rectangle(-30, -30, 60, 60));
    this.builder.addAnimation("circle", index);

    var frames = [];
    for (var i = 0; i < 5; i++) {
      index = this.builder.addFrame(square, null, 1, function (target, data) {
        squareFld.text = data;
      }, i);
      frames.push(index);
    }

    this.builder.addAnimation("square", [1], true);
    this.builder.addAnimation("square2", [2], true);
  });

  it("should build synchronously", function (done) {
    var spriteSheet = this.builder.build();

    var circle2 = new createjs.Sprite(spriteSheet, "circle");
    this.stage.addChild(circle2).set({x: 40, y: 120});

    var circle3 = new createjs.Sprite(spriteSheet, "circle");
    this.stage.addChild(circle3).set({x: 120, y: 120});

    var square2 = new createjs.Sprite(spriteSheet, "square");
    this.stage.addChild(square2);

    var square3 = new createjs.Sprite(spriteSheet, "square2");
    this.stage.addChild(square3).set({x: 80});

    this.compareBaseLine("test_assets/SpriteSheetBuilder.png", done, expect, 0.0075);
  });

  it("should build async", function (done) {
    var _this = this;
    this.builder.addEventListener("complete", function () {
      var spriteSheet = _this.builder.spriteSheet;
      var circle2 = new createjs.Sprite(spriteSheet, "circle");
      _this.stage.addChild(circle2).set({x: 40, y: 120});

      var circle3 = new createjs.Sprite(spriteSheet, "circle");
      _this.stage.addChild(circle3).set({x: 120, y: 120});

      var square2 = new createjs.Sprite(spriteSheet, "square");
      _this.stage.addChild(square2);

      var square3 = new createjs.Sprite(spriteSheet, "square2");
      _this.stage.addChild(square3).set({x: 80});

      _this.compareBaseLine("test_assets/SpriteSheetBuilder.png", done, expect, 0.0075);
    });

    this.builder.buildAsync();
  });
});
