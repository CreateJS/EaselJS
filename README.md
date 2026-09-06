# EaselJS

EaselJS is a library for building high-performance interactive 2D content in HTML5. It provides a feature-rich display 
list to allow you to manipulate and animate graphics. It also provides a robust interactive model for mouse and touch 
interactions.

It is excellent for building games, generative art, ads, data visualization, and other highly graphical experiences. It 
works well alone, or with the rest of the [CreateJS](http://createjs.com/) suite: [SoundJS](http://createjs.com/soundjs), 
[PreloadJS](http://createjs.com/preloadjs), and [TweenJS](http://createjs.com/tweenjs).

It has no external dependencies, and should be compatible with virtually any framework you enjoy using.

## Simple Example

```javascript
//Draw a square on screen.
var stage = new createjs.Stage('myCanvas');
var shape = new createjs.Shape();
shape.graphics.beginFill('red').drawRect(0, 0, 120, 120);
stage.addChild(shape);
stage.update();
```

## Sprite Animation Example
```javascript
var ss = new createjs.SpriteSheet({
	frames: {
		width: 32,
		height: 64,
		numFrames: 19
	},
	animations: {run: [0, 25], jump: [26, 63, "run"]},
	images: ["./assets/runningGrant.png"]
});
	
var sprite = new createjs.Sprite(ss, "run");
sprite.scaleY = sprite.scaleX = 0.4;
stage.addChild(sprite);
	
sprite.on("click", function() { sprite.gotoAndPlay("jump"); });
	
createjs.Ticker.on("tick", stage);
```

## Support and Resources
* Find examples and more information at the [EaselJS web site](http://easeljs.com/).
* Read the [documentation](http://createjs.com/docs/easeljs).
* Discuss, share projects, and interact with other users on [reddit](http://www.reddit.com/r/createjs/).
* Ask technical questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/easeljs).
* File verified bugs or formal feature requests using Issues on [GitHub](https://github.com/createjs/EaselJS/issues).
* There is a [Google Group](http://groups.google.com/group/createjs-discussion) for discussions and support.
* Have a look at the included [examples](https://github.com/CreateJS/EaselJS/tree/master/examples) and 
[API documentation](http://createjs.com/docs/easeljs/) for more in-depth information.

It was built by [gskinner.com](http://www.gskinner.com), and is released for free under the MIT license, which means you
can use it for almost any purpose (including commercial projects). We appreciate credit where possible, but it is not a 
requirement.


## Classes

The API is inspired in part by Flash's display list, and should be easy to pick up for both JS and AS3 developers. Check 
out the [docs](http://createjs.com/docs/easeljs/) for more information.

**DisplayObject**
Abstract base class for all display elements in EaselJS. Exposes all of the display properties (ex. x, y, rotation, 
scaleX, scaleY, skewX, skewY, alpha, shadow, etc) that are common to all display objects.

**Stage**
The root level display container for display elements. Each time tick() is called on Stage, it will update and render 
the display list to its associated canvas.

**Container**
A nestable display container, which lets you aggregate display objects and manipulate them as a group.

**Bitmap**
Draws an image, video or canvas to the canvas according to its display properties.

**Sprite**
Displays single frames or animations from sprite sheets, and provides APIs for managing playback and sequencing.

**Shape**
Renders a Graphics object within the context of the display list.

**Graphics**
Provides an easy to use API for drawing vector data. Can be used with Shape, or completely stand alone.

**Text**
Renders a single line of text to the stage.

**BitmapText**
Renders text using a SpriteSheet of letter.

**DOMElement**
An experimental display object that allows you to manage an HTML element as a part of the display list.

**Filter**
The base filter class that other filters (ex. BlurFilter, ColorMatrixFilter, etc) extend.


There are also a few helper classes included:

**Shadow**
Defines all of the properties needed to display a shadow on a display object.

**Ticker**
Provides a pausable centralized tick manager for ticking Stage instances or other time based code.

**UID**
Very simple class that provides global, incremental unique numeric IDs.

**SpriteSheet**
Encapsulates all the data associated with a sprite sheet to be used with Sprite.

**SpriteSheetUtils**
Contains utility methods for extending existing sprite sheets with flipped frames and extracting individual frames.

**SpriteSheetBuilder**
Build a bitmap SpriteSheet from vector graphics at run time. Get the filesize savings of vector, with the performance
of a SpriteSheet.

**Matrix2D**
Represents a 3x3 affine transformation matrix. Used internally for calculating concatenated transformations.

**Rectangle**
Represents a rectangle as defined by the points (x, y) and (x+width, y+height).

**Point**
Represents a point on a 2 dimensional x / y coordinate system.

A WebGL implementation currently exists, but is limited.

**StageGL**
A drop-in replacement for the EaselJS Stage class that fully supports a WebGL pipeline. StageGL will draw most Bitmap-
based content, including any cached DisplayObjects.

**WebGLInspector**
A utility and helper class designed to work with StageGL to help investigate and test performance or display problems. 


## 🌐 Web Resources & Interactive Index
- [GOTHIC KNIFE](https://studyplayings.web.app/gothic-knife.html)
- [COMBINE PICKAXES](https://themindplays.pages.dev/combine-pickaxes.html)
- [CATEGORY BASKETBALL](https://studyquests.github.io/category-basketball.html)
- [MATCH FACTORY](https://studyplaying.github.io/match-factory.html)
- [DOGE MATCH](https://quizverses-9d2f2.web.app/doge-match.html)
- [NINE CARDS OF WINTER](https://quizverses.github.io/nine-cards-of-winter.html)
- [OBBY PARKOUR RACING](https://themindzone.pages.dev/obby-parkour-racing.html)
- [INDEX19](https://studyquests.pages.dev/index19.html)
- [CHICKEN WILD RUN](https://thequizzone.pages.dev/chicken-wild-run.html)
- [FESTIVAL VIBES MAKEUP](https://learnquester.pages.dev/festival-vibes-makeup.html)
- [BLOXDHOP IO](https://learnquester.pages.dev/bloxdhop-io.html)
- [GOING BALLS 3D](https://studyplaying.github.io/going-balls-3d.html)
- [CATEGORY AGILITY 2](https://thequizzone.pages.dev/category-agility-2.html)
- [TAP TO COLOR PAINTING BOOK](https://studyplaying.github.io/tap-to-color-painting-book.html)
- [MERGE MASTER SKIBIDI BOP](https://studyplaying.github.io/merge-master-skibidi-bop.html)
- [HOME RUN BOY](https://learnquester.pages.dev/home-run-boy.html)
- [AVATAR LIFE MY TOWN](https://studyplaying.github.io/avatar-life-my-town.html)
- [INFINITE CRAFT](https://studyquesthub.web.app/infinite-craft.html)
- [LOVIE CHICS COACHELLA FESTIVAL](https://thequizzone.pages.dev/lovie-chics-coachella-festival.html)
- [BFFS CHERRY BLOSSOM CELEBRATION](https://quizverses.github.io/bffs-cherry-blossom-celebration.html)
- [CATEGORY FIGHTING](https://studyplaying.github.io/category-fighting.html)
- [CATEGORY HORROR](https://quizverses.github.io/category-horror.html)
- [JUST DICE RANDOM TOWER DEFENCE](https://studyquesthub.web.app/just-dice-random-tower-defence.html)
- [INDEX16](https://quizverses.github.io/index16.html)
- [TERMS](https://brainquests.github.io/terms.html)
- [SCHOOLBOY RUNAWAY ROOM ESCAPE](https://thelearnquesters.pages.dev/schoolboy-runaway-room-escape.html)
- [PRINCESSES OF QUADROBICS](https://thelearnquester.web.app/princesses-of-quadrobics.html)
- [CHECKERS DELUXE EDITION](https://studyplaying.github.io/checkers-deluxe-edition.html)
- [ALOHA MAHJONG](https://studyquests.pages.dev/aloha-mahjong.html)
- [CATEGORY CONTROLLER](https://thelearnquester.web.app/category-controller.html)
- [PLANE CRASH RAGDOLL SIMULATOR](https://learnquester.pages.dev/plane-crash-ragdoll-simulator.html)
- [PUZZLE BLOCKS ASMR MATCH](https://learnquester.pages.dev/puzzle-blocks-asmr-match.html)
- [GYM MUSCLE MERGE TYCOON](https://thelearnquester.web.app/gym-muscle-merge-tycoon.html)
- [PIMPLE SQUEEZE](https://studyquests.pages.dev/pimple-squeeze.html)
- [CATEGORY MATCH 3 3](https://quizverses.github.io/category-match-3-3.html)
- [CARDS 2048](https://learnquester.pages.dev/cards-2048.html)
- [COSMO PET STARRY CARE](https://thequizzone.pages.dev/cosmo-pet-starry-care.html)
- [BRAINROT BRIDGE RACE 3D](https://studyquests.pages.dev/brainrot-bridge-race-3d.html)
- [MATCHING PUZZLE](https://studyplaying.github.io/matching-puzzle.html)
- [FISH RAIN 2](https://quizverses-9d2f2.web.app/fish-rain-2.html)
- [BUBBLE AROUND](https://quizverses-9d2f2.web.app/bubble-around.html)
- [COINS](https://thequizzone.pages.dev/coins.html)
- [CATEGORY GUN238](https://quizverses.github.io/category-gun238.html)
- [SCARY BANBAN ESCAPE](https://thelearnquesters.pages.dev/scary-banban-escape.html)
- [CATEGORY CASUAL 10](https://quizverses.github.io/category-casual-10.html)
- [DEAD LAND SURVIVAL](https://quizverses-9d2f2.web.app/dead-land-survival.html)
- [FOOD TOWER DEFENSE](https://thelearnquester.web.app/food-tower-defense.html)
- [BLOCK CRAFT 3D](https://quizverses-9d2f2.web.app/block-craft-3d.html)
- [THE NOOB AVENTURES](https://thequizzone.pages.dev/the-noob-aventures.html)
- [MINI GAMES RELAX COLLECTION 2](https://studyquesthub.web.app/mini-games-relax-collection-2.html)
- [TRIANGLE WAY](https://thequizzone.pages.dev/triangle-way.html)
- [COLOR NONOGRAM PUZZLE 2](https://learnquester.pages.dev/color-nonogram-puzzle-2.html)
- [CATEGORY PUZZLE 5](https://learnquesters.pages.dev/category-puzzle-5.html)
- [FOOTBALL HEADS 2025](https://studyquesthub.web.app/football-heads-2025.html)
- [CATEGORY CLASSIC98](https://thelearnquester.web.app/category-classic98.html)
- [INDEX23](https://quizverses.github.io/index23.html)
- [HORROR MINECRAFT PARTYTIME](https://thequizzone.pages.dev/horror-minecraft-partytime.html)
- [NUMBER DOMINATION](https://studyquests.pages.dev/number-domination.html)
- [BUBBLE CLASSIC](https://thelearnquester.web.app/bubble-classic.html)
- [EXIT PUZZLE](https://thequizzone.pages.dev/exit-puzzle.html)
- [MAGNET TRUCK](https://learnquesters.pages.dev/magnet-truck.html)
- [PRINCESS VALENTINES CRUSH](https://thequizzone.pages.dev/princess-valentines-crush.html)
- [CATEGORY BATTLE 2](https://studyplaying.github.io/category-battle-2.html)
- [FILLWORDS FIND ALL THE WORDS](https://learnquesters.pages.dev/fillwords-find-all-the-words.html)
- [CATEGORY STICKMAN](https://thequizzone.pages.dev/category-stickman.html)
- [PLANT MERGE ZOMBIE WAR](https://studyquesthub.web.app/plant-merge-zombie-war.html)
- [HAMSTER COMBO IDLE](https://quizverses.pages.dev/hamster-combo-idle.html)
- [SAVE HER TOUR](https://thequizzone.pages.dev/save-her-tour.html)
- [FRIDAY NIGHT SPRUNKI](https://thelearnquesters.pages.dev/friday-night-sprunki.html)
- [CAR PARKING SIMULATOR](https://quizverses.pages.dev/car-parking-simulator.html)
- [HEXON RUSH](https://learnquesters.pages.dev/hexon-rush.html)
- [REAL GT RACING SIMULATOR](https://learnquester.pages.dev/real-gt-racing-simulator.html)
- [ICE FISHING 3D](https://studyplaying.github.io/ice-fishing-3d.html)
- [PAPER DOLL DIARY CHIBI DOLLS](https://thelearnquesters.pages.dev/paper-doll-diary-chibi-dolls.html)
- [MEGA LAMBA RAMP](https://quizverses-9d2f2.web.app/mega-lamba-ramp.html)
- [HAPPY TOWN](https://thelearnquester.web.app/happy-town.html)
- [CATEGORY RACING DRIVING](https://thelearnquester.web.app/category-racing-driving.html)
- [CATEGORY MAHJONG GAMES](https://thelearnquester.web.app/category-mahjong-games.html)
- [GLOBAL CITY QKK](https://quizverses.pages.dev/global-city-qkk.html)
- [ROOFTOP CHALLENGE](https://learnquester.github.io/rooftop-challenge.html)
- [HERO TOWER WARS MERGE PUZZLE](https://studyquesthub.web.app/hero-tower-wars-merge-puzzle.html)
- [FEED THE PARROT](https://quizverses.pages.dev/feed-the-parrot.html)
- [CATEGORY JUMPING147](https://quizverses.github.io/category-jumping147.html)
- [CATEGORY ONE BUTTON84](https://quizverses.github.io/category-one-button84.html)
- [SHIP PARKING GAME](https://thelearnquesters.pages.dev/ship-parking-game.html)
- [1945 AIR FORCE AIRPLANE](https://learnquester.pages.dev/1945-air-force-airplane.html)
- [YUMMY TALES 4](https://thelearnquester.web.app/yummy-tales-4.html)
- [ONU LIVE](https://thequizzone.pages.dev/onu-live.html)
- [CATEGORY STICKMAN 2](https://quizverses.pages.dev/category-stickman-2.html)
- [ONE LINE DRAWING](https://learnquester.pages.dev/one-line-drawing.html)
- [YUMMY TALES 3](https://learnquester.github.io/yummy-tales-3.html)
- [CATEGORY PARTY23](https://thelearnquester.web.app/category-party23.html)
- [CANDY SMASH](https://studyplaying.github.io/candy-smash.html)
- [INDEX6](https://learnquester.github.io/index6.html)
- [CAR DESTRUCTION KING](https://learnquesters.pages.dev/car-destruction-king.html)
- [NOOB VS ZOMBIE APOCALYPSE SHOOTING PRO](https://learnquester.pages.dev/noob-vs-zombie-apocalypse-shooting-pro.html)
- [HIDDEN OBJECT MY HOTEL](https://quizverses.pages.dev/hidden-object-my-hotel.html)
- [CATEGORY PUZZLE 3](https://studyquesthub.web.app/category-puzzle-3.html)
- [TWO STUNT SUPERCARS](https://quizverses.pages.dev/two-stunt-supercars.html)
- [HOME MATCH TILE MASTER](https://thequizzone.pages.dev/home-match-tile-master.html)
- [CATCH THE GOOSE](https://thequizzone.pages.dev/catch-the-goose.html)
- [NUMBER MERGE 10](https://studyplayings.web.app/number-merge-10.html)
- [SHEEP SHEEP DUCK](https://quizverses.pages.dev/sheep-sheep-duck.html)
- [BUBBLY LAB](https://studyplaying.github.io/bubbly-lab.html)
- [CATEGORY ART](https://quizverses.github.io/category-art.html)
- [COLOR SORT PUZZLE](https://thequizzone.pages.dev/color-sort-puzzle.html)
- [GOLDEN FRONTIER](https://studyplayings.pages.dev/golden-frontier.html)
- [SAFE MERGE](https://learnquester.pages.dev/safe-merge.html)
- [SPRUNKI COLORING BOOK](https://thelearnquesters.pages.dev/sprunki-coloring-book.html)
- [CATEGORY CASUAL 5](https://quizverses.github.io/category-casual-5.html)
- [GRANNY GTA VEGAS](https://studyquests.pages.dev/granny-gta-vegas.html)
- [DRAGON YEAR JIGSAW](https://studyplaying.github.io/dragon-year-jigsaw.html)
- [CATEGORY CARDS](https://quizverses.github.io/category-cards.html)
- [100 HIDDEN CAPYBARAS](https://studyquesthub.web.app/100-hidden-capybaras.html)
- [CELEBRITY SPRING FASHION TRENDS](https://studyplayings.web.app/celebrity-spring-fashion-trends.html)
- [CAR MECHANIC SIMULATOR 2025](https://thelearnquesters.pages.dev/car-mechanic-simulator-2025.html)
- [CATEGORY GROW99](https://thequizzone.pages.dev/category-grow99.html)
- [SNIPER WARS FIND THE CRIMINAL](https://studyplaying.github.io/sniper-wars-find-the-criminal.html)
- [CATEGORY MOBILE2 112](https://quizverses.github.io/category-mobile2-112.html)
- [CATEGORY CASUAL971](https://quizverses.pages.dev/category-casual971.html)
- [BUS JAM ESCAPE](https://studyplaying.github.io/bus-jam-escape.html)
- [IDLE BANK](https://learnquesters.pages.dev/idle-bank.html)
- [CATEGORY COOKING](https://thelearnquester.web.app/category-cooking.html)
- [FIND THE SPRUNKI](https://thelearnquester.web.app/find-the-sprunki.html)
- [INDEX18](https://studyquesthub.web.app/index18.html)
- [TAP GO DELUXE](https://quizverses.pages.dev/tap-go-deluxe.html)
- [STUNT CAR EXTREME 2](https://learnquester.github.io/stunt-car-extreme-2.html)
- [SIGMA BOY MUSICAL CLICKER](https://thelearnquester.web.app/sigma-boy-musical-clicker.html)
- [CATEGORY CARDS](https://thelearnquester.web.app/category-cards.html)
- [CATEGORY PUZZLE 3](https://studyplayings.pages.dev/category-puzzle-3.html)
