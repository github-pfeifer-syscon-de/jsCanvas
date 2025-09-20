/* 
 */

class Plot {

    constructor(id) {
        this.canvas = document.querySelector(id);
        this.backgroundColor = '#F0DB4F';
        this.curveColor = 'black';
    }
    draw(xmin,xmax,expression) {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.canvas.width = width;   // as we use css size, required for correct scale
        this.canvas.height = height;
        //console.log("width " + width + " height " + height);
        if (this.canvas.getContext) {
            if (xmin > xmax) {
                let t = xmin;
                xmin = xmax;
                xmax = t;
            }
            if (xmin === xmax) {
                xmax = xmin + 1;
            }
            let ctx = this.canvas.getContext('2d');
            //console.log("scale " + ctx.transform() + " height " + height);
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, width, height);

            let xaxis = new xAxis(xmin, xmax, width);
            let yaxis = new yAxis(height);
            yaxis.eval(xaxis.values, expression);
            let xat = xaxis.getAt();
            let yat = yaxis.getAt();
            xaxis.plot(ctx, yat, height);
            yaxis.plot(ctx, xat);
            //let xScale = (xMax - xMin) / width;
            //let yScale = (yMax - yMin) / height;
            // draw a rectangle with fill and stroke
            // set fill and stroke styles
            ctx.strokeStyle = this.curveColor;
            ctx.beginPath();
            var ys = yaxis.toScreen(0);
            ctx.moveTo(0, ys);
            for (var i = 0; i < xaxis.values.length; i += 1) {
                let xs = xaxis.toScreen(i);
                ys = yaxis.toScreen(i);
                ctx.lineTo(xs, ys);
            }
            ctx.stroke();
        }

    }
}