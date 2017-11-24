let stage = new createjs.Stage("c1");

stage.update();

let noiseMachine = new PerlinNoiseMachine();

// performance testing
/*let total = 0;
let count = 50;

for(let i = 0; i < count; i++){
    let start = performance.now();

    for(let j = 0; j < 1000000; j++){
        noiseMachine.noise(j, j*2.2, j*3.589);
    }

    let end = performance.now();

    console.log(`Run ${i}: ${end-start}`);
    total += end-start;
}

console.log(`Average: ${total/count}`);*/


let graph = new createjs.Shape();
let g =  graph.graphics;
g.beginStroke("#000")
        .moveTo(0, stage.canvas.height/2);
for(let i = 0; i < 960; i ++){
    let y = noiseMachine.noise(i/10000, i/100, 0.0024*i) * stage.canvas.height;
    g.lineTo(i, y);
}
g.endStroke();

stage.addChild(graph);
stage.update();

// 2D greyscale

let c2 = document.getElementById("c2");
let ctx = c2.getContext("2d");
let imgData = ctx.getImageData(0,0,c2.width, c2.height);

for(let i = 0; i < c2.width*c2.height; i++){
    let x = i % c2.width;
    let y = (i-x)/c2.width;
    let val = noiseMachine.noise(x/70, y/70, 0.012523);
    imgData.data[4*i   ] = val*255 | 0; //r
    imgData.data[4*i +1] = val*255 | 0; //g
    imgData.data[4*i +2] = val*255 | 0; //b
    imgData.data[4*i +3] = 255;   //a
}


ctx.putImageData(imgData, 0, 0);

// 2D Color

let c3 = document.getElementById("c3");
ctx = c3.getContext("2d");
imgData = ctx.getImageData(0,0,c3.width, c3.height);

for(let i = 0; i < c3.width*c3.height; i++){
    let x = i % c3.width;
    let y = (i-x)/c3.width;
    let scale = 413;
    let offsetRed = 240;
    let offsetGreen = 17;
    let offsetBlue = 0.0027472;
    let r = noiseMachine.noise(x/scale, y/scale, offsetRed);
    let g = noiseMachine.noise(x/scale, y/scale, offsetGreen);
    let b = noiseMachine.noise(x/scale, y/scale, offsetBlue);
    imgData.data[4*i   ] = r*255 | 0; //r
    imgData.data[4*i +1] = g*255 | 0; //g
    imgData.data[4*i +2] = b*255 | 0; //b
    imgData.data[4*i +3] = 255;   //a
}

ctx.putImageData(imgData, 0, 0);

// RGB

/*let c4 = document.getElementById("c4");
ctx = c4.getContext("2d");
imgData = ctx.getImageData(0,0,c4.width, c4.height);

for(let i = 0; i < c4.width*c4.height; i++){
    let x = i % c4.width;
    let y = (i-x)/c4.width;
    let scale = 413;
    let offsetRed = 17;
    let offsetGreen = 240;
    let offsetBlue = 0.0027472;
    let r = noiseMachine.noise(x/scale, y/scale, offsetRed);
    let g = noiseMachine.noise(x/scale, y/scale, offsetGreen);
    let b = noiseMachine.noise(x/scale, y/scale, offsetBlue);
    imgData.data[4*i   ] = r*255 | 0; //r
    imgData.data[4*i +1] = g*255 | 0; //g
    imgData.data[4*i +2] = b*255 | 0; //b
    imgData.data[4*i +3] = 255;   //a
}

ctx.putImageData(imgData, 0, 0);
let dataurl = c4.toDataURL();
document.getElementById("canvasOutput").src = dataurl;*/

// HSL

let c4 = document.getElementById("c4");
ctx = c4.getContext("2d");
imgData = ctx.getImageData(0,0,c4.width, c4.height);

for(let i = 0; i < c4.width*c4.height; i++){
    let x = i % c4.width;
    let y = (i-x)/c4.width;
    let scale = 413;
    let offsetH = 200;
    let offsetS = 240;
    let offsetL = 160;
    let h = (noiseMachine.noise(x/(scale/2), y/(scale/2), offsetH)*3/2)%360 ;
    let s = noiseMachine.noise(x/(scale/2), y/(scale/2), offsetS)/2 + 0.5;
    let l = noiseMachine.noise(x/(scale), y/(scale), offsetL)*2/3+0.1;

    let rgb = hslToRgb(h, s, l);

    imgData.data[4*i   ] = rgb[0] | 0; //r
    imgData.data[4*i +1] = rgb[1] | 0; //g
    imgData.data[4*i +2] = rgb[2] | 0; //b
    imgData.data[4*i +3] = 255;   //a
}

ctx.putImageData(imgData, 0, 0);
/*let dataurl = c4.toDataURL();
document.getElementById("canvasOutput").src = dataurl;*/

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        let hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}