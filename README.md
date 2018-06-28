### 2.0 BETA

**This branch is in beta. Reporting issues is appreciated, please mention that it is for 2.0 in the issue body.**

The `StageGL` class went under a heavy rewrite in 1.1 which has not been ported to ES2015 syntax. We have excluded it from this branch for the time being. It will be added back when the class is finalized.

Canvas-based image comparison unit tests are known to be failing, please don't report issues for this.

<p align="center">
  <a href="https://createjs.com/easeljs">
    <img alt="easeljs" src="https://raw.githubusercontent.com/createjs/easeljs/2.0/assets/github-header.png" width="546">
  </a>
</p>

EaselJS is a library for building high-performance interactive 2D content in HTML5. It provides a feature-rich display
list to allow you to manipulate and animate graphics. It also provides a robust interactive model for mouse and touch
interactions.

It is excellent for building games, generative art, ads, data visualization, and other highly graphical experiences. It
works well alone, or with the rest of the [CreateJS](https://createjs.com/) suite: [SoundJS](https://github.com/createjs/soundjs),
[PreloadJS](https://github.com/createjs/preloadjs), and [TweenJS](https://github.com/createjs/tweenjs).

It has no external dependencies, and should be compatible with virtually any framework you enjoy using.

## Installation

#### NPM

`npm install @createjs/easeljs --save`

#### CDN

`<script src="https://code.createjs.com/2.0/easeljs.min.js"></script>`

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
- Read the [documentation](http://createjs.com/easeljs/docs).
- Discuss, share projects, and interact with other users on [reddit](http://www.reddit.com/r/createjs/).
- Ask technical questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/easeljs).
- File verified bugs or formal feature requests using Issues on [GitHub](https://github.com/createjs/easeljs/issues).
- There is a [Google Group](http://groups.google.com/group/createjs-discussion) for discussions and support.
- Have a look at the included [examples](https://github.com/createjs/easeljs/tree/master/examples) for more in-depth instructions.

It was built by [gskinner.com](http://www.gskinner.com), and is released for free under the MIT license, which means you
can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a
requirement.
