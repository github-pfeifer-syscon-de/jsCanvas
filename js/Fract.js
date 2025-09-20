/*
 * fractal classes
 *  Param: holds the parameters of a calcuation (the real- and imaginary-start,end,...)
 *  Fract: does the canvas drawing (by animation) and palett generation, calculation is done by FractWorker.js
 */

class Param {
    constructor(width,height) {
        this.width = width;
        this.height = height;
        this.real_start = -2.0;
        this.real_end = 0.5;
        this.real_step = (this.real_end - this.real_start) / (width-1);
        this.imag_start = -1.25;
        this.imag_end = 1.25;
        this.imag_step = (this.imag_end - this.imag_start) / (height-1);
    }
    zoom(x,y,zoomfactor) {
        this.real_start = this.real_start + (x - this.width / (zoomfactor * 2.0)) * this.real_step;
        this.real_end = this.real_start + (this.width / (zoomfactor) * this.real_step);
        this.real_step = (this.real_end - this.real_start) / (this.width-1);
        this.imag_start = this.imag_start + (y - this.height / (zoomfactor * 2.0)) * this.imag_step;
        this.imag_end = this.imag_start  + (this.height / (zoomfactor) * this.imag_step);
        this.imag_step = (this.imag_end - this.imag_start) / (this.height-1);
    }
}

class Fract {

    constructor(id) {
        this.canvas = document.querySelector(id);
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.canvas.width = width;   // as we use css size, required for correct scale
        this.canvas.height = height;
        this.backgroundColor = 'black';
        this.param = new Param(this.canvas.width, this.canvas.height);
        // Add mouse events
        this.canvas.addEventListener("mousedown", this.onMouseDown);

        if (window.Worker) {
            this.fractWorker = new Worker("js/FractWorker.js");
            this.fractWorker.addEventListener("message", this.messagePost);
        } else {
            console.log('Your browser doesn\'t support web workers.');
        }
    }
    draw(depth,colors) {
        this.param.depth = depth;
        this.colors = colors;
        //console.log("depth " + depth);
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.imagedata = this.ctx.createImageData(this.canvas.width, this.canvas.height);
            this.generatePalette(depth,colors);
            this.active = true;
            main(0);    // start animating
            // start calculation
            this.fractWorker.postMessage(this.param);
        } else {
            console.log('Your browser doesn\'t support canvas contexts.');
        }
    }
    messagePost(e) {
        let ret = e.data;
        let y = ret.y;
        let row = ret.row;
        var fract = window.fract;
        var param = fract.param;
        for (var x = 0; x < param.width; x++) {
            // read palette to get color
            var color = fract.palette[row[x]];

            // Apply the color
            var pixelindex = (y * param.width + x) * 4;
            fract.imagedata.data[pixelindex] = color.r;
            fract.imagedata.data[pixelindex + 1] = color.g;
            fract.imagedata.data[pixelindex + 2] = color.b;
            fract.imagedata.data[pixelindex + 3] = 255;
        }
        if (y === param.height - 1) {
            fract.active = false;   // stop animating
        }
    }
    // Generate palette
    generatePalette(depth,colors) {
        // Calculate a gradient
        var step = depth/(colors.length);
        this.palette = [];
        for (var i=0; i<depth; i++) {
            let red = 0;
            let green = 0;
            let blue = 0;
            let n = Math.floor(i/step);
            let s = (i % step) / step;
            //console.log("i: " + i + " n: " + n + " s: " + s);
            if (n > 0) {
                let red1 = Number.parseInt(colors[n-1].substring(1,3),16);
                let green1 = Number.parseInt(colors[n-1].substring(3,5),16);
                let blue1 = Number.parseInt(colors[n-1].substring(5,7),16);
                red += red1 * (1.0-s);
                green += green1 * (1.0-s);
                blue += blue1 * (1.0-s);
            }
            if (n < colors.length) {
                let red2 = Number.parseInt(colors[n].substring(1,3),16);
                let green2 = Number.parseInt(colors[n].substring(3,5),16);
                let blue2 = Number.parseInt(colors[n].substring(5,7),16);
                red += red2 * (s);
                green += green2 * (s);
                blue += blue2 * (s);
            }
            this.palette[i] = { r:red, g:green, b:blue};
        }
        this.palette[depth] = {r: 0, g: 0, b: 0}; // Black
    }
    // Mouse event handlers
    onMouseDown(e) {
        var rect = e.target.getBoundingClientRect();
        let x = Math.round((e.clientX - rect.left));
        let y =  Math.round((e.clientY - rect.top));
        //console.log("click x: " + x + " y: " + y);

        // Zoom out with Control
        //var zoomin = true;
        //if (e.ctrlKey) {
        //    zoomin = false;
        //}

        // Pan with Shift
        var zoomfactor = 2;
        if (e.shiftKey) {
            zoomfactor = 1;
        }

        var fract = window.fract;
        var param = fract.param;
        param.zoom(x,y,zoomfactor);
        // Generate a new image
        fract.draw(fract.param.depth,fract.colors);
    }

}

// Main loop
function main(tframe) {
    if (window.fract.active) {
        // Request animation frames
        window.requestAnimationFrame(main);
    }

    // Draw the generate image
    window.fract.ctx.putImageData(window.fract.imagedata, 0, 0);
}
