# @createjs/easeljs

EaselJS is a library for building high-performance interactive 2D content in HTML5. It provides a feature-rich display
list to allow you to manipulate and animate graphics. It also provides a robust interactive model for mouse and touch
interactions.

It is excellent for building games, generative art, ads, data visualization, and other highly graphical experiences. It
works well alone, or with the rest of the [CreateJS](http://createjs.com/) suite: [SoundJS](http://github.com/createjs/soundjs),
[PreloadJS](http://github.com/createjs/preloadjs), and [TweenJS](http://github.com/createjs/tweenjs).

It has no external dependencies, and should be compatible with virtually any framework you enjoy using.

## Simple Example

```javascript
// Draw a square on screen.
import { Stage, Shape } from "@createjs/easeljs";
let stage = new Stage("myCanvas");
let shape = new Shape();
shape.graphics.beginFill("red").drawRect(0, 0, 120, 120);
stage.addChild(shape);
stage.update();
```

## Sprite Animation Example
```javascript
import { Sprite, SpriteSheet, Ticker } from "@createjs/easeljs";
let ss = new SpriteSheet({
  frames: {
    width: 32,
    height: 64,
    numFrames: 19
  },
  animations: {run: [0, 25], jump: [26, 63, "run"]},
  images: ["./assets/runningGrant.png"]
});

let sprite = new Sprite(ss, "run");
sprite.scaleY = sprite.scaleX = 0.4;
stage.addChild(sprite);

sprite.on("click", evt => sprite.gotoAndPlay("jump"));

Ticker.on("tick", stage);
```

## Support and Resources
- Find examples and more information at the [EaselJS web site](http://createjs.com/easeljs).
- Read the [documentation](http://createjs.com/docs).
- Discuss, share projects, and interact with other users on [reddit](http://www.reddit.com/r/createjs/).
- Ask technical questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/easeljs).
- File verified bugs or formal feature requests using Issues on [GitHub](https://github.com/createjs/easeljs/issues).
- There is a [Google Group](http://groups.google.com/group/createjs-discussion) for discussions and support.
- Have a look at the included [examples](https://github.com/createjs/easeljs/tree/master/examples) for more in-depth instructions.



It was built by [gskinner.com](http://www.gskinner.com), and is released for free under the MIT license, which means you
can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a
requirement.
