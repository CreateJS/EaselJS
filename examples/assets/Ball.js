(function(window) {

function Ball(imageSource) {
    this.oldX = 0;
    this.oldY = 0;
    this.radius = 38;
    this.scale = 1;
    this.imageSource = imageSource;
    this.initialize();


}

Ball.prototype = new Container();

Ball.prototype.vx = 0;
Ball.prototype.vy = 0;
Ball.prototype.oldX;
Ball.prototype.oldY;
Ball.prototype.radius;
Ball.prototype.scale;
Ball.prototype.bounce;
Ball.prototype.imageSource;

Ball.prototype.Container_initialize = Ball.prototype.initialize;
    Ball.prototype.initialize = function() {
        this.Container_initialize();
        var bmp = new Bitmap(this.imageSource.result);
        this.addChild(bmp);

    }

    function handleImageLoad() {
       var bmp = new Bitmap(this.img);
       this.addChild(bmp);
    }

window.Ball = Ball;
}(window));