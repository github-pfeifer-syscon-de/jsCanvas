/* 
 */

class Axis {
    //member min,max,scale,step,values;
    constructor(min, max, size) {
        this.min = min;
        this.max = max;
        this.size = size;
        this.values = new Array();
        this.arrowLength = 7;
        this.coordColor = '#555';
        this.tickLength = 7;
    }
    toScreen(i) {
        return this.toScreenValue(this.values[i]);
    }
    getStep() {
        let diff = this.max - this.min;
        let dim = Math.log10(diff);
        dim = Math.floor(dim);
        this.format = new Intl.NumberFormat( { maximumSignificantDigits: 4 });// avoid rounding issues
        this.tickStep = Math.pow(10, dim-1);
        let step = Math.pow(10, dim);
        this.rmin = Math.floor(this.min / step) * step;
        this.rmax = Math.ceil(this.max / step) * step;
        this.scale = (this.size-1.0) / (this.rmax - this.rmin);
        diff = this.rmax - this.rmin;
        let factor = 5.0;
        if (this.size > 600) {
            factor = 10.0;
        }
        else if (this.size > 200) {
            factor = 5.0;
        }
        this.numStep = diff / factor;
    }
    getAt() {
        if (this.min < 0 && this.max > 0) {
            return this.toScreenValue(0);
        }
        return this.toScreenValue(this.min);
    }
}

class xAxis extends Axis {
    constructor(min, max, width) {
        super(min, max, width);
        this.eval();
    }

    toScreenValue(val) {
        return (val - this.rmin) * this.scale;
    }
    eval() {
        this.getStep(); // to set scale
        this.values = math.range(this.min, this.max, 1.0 / this.scale).toArray();
        //let step = 1.0 / this.scale;
        //for (var x = this.min; x <= this.max; x+=step) {
        //    this.values.push(x);
        //}
    }

    plot(ctx, at, height) {
        ctx.strokeStyle = this.coordColor;
        ctx.fillStyle = this.coordColor;
        ctx.beginPath();
        ctx.moveTo(0, at);
        ctx.lineTo(this.size, at);  // line
        ctx.moveTo(this.size-this.arrowLength, at-this.arrowLength);    // arrow
        ctx.lineTo(this.size, at);
        ctx.lineTo(this.size-this.arrowLength, at+this.arrowLength);
        ctx.stroke();
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'center';
        //if (Math.abs(at - height) === 0) {
        //    at = height - 10;    // will not visible at max ?
        //}
        for (var x = this.rmin; x < this.rmax; x += this.numStep) {
            let xs = this.toScreenValue(x);
            ctx.fillText(this.format.format(x), xs, at - this.tickLength / 2);
        }
        ctx.beginPath();
        for (var x = this.rmin; x < this.rmax; x += this.tickStep) {
            let xs = this.toScreenValue(x);
            ctx.moveTo(xs, at - this.tickLength / 2);   // tick
            ctx.lineTo(xs, at + this.tickLength / 2);
        }
        ctx.stroke();
    }
}

class yAxis extends Axis {
    constructor(height) {
        super(Number.MAX_VALUE, -Number.MAX_VALUE, height);
    }

    toScreenValue(val) {
        return this.size - ((val - this.rmin) * this.scale);
    }

    eval(xValues, expression) {
        // compile the expression once
        const expr = math.compile(expression);
        // evaluate the expression repeatedly for different values of x
        this.values = xValues.map(function (x) {
            return expr.evaluate({x: x});
        });
        //for (var i = 0; i < xValues.length; ++i) {
        //    let x = xValues[i];
        //    let y = eval(expression);
        //    this.values.push(y);
        //}
        for (var i = 0; i < this.values.length; ++i) {
            let y = this.values[i];
            if (this.min > y) {
                this.min = y;
            }
            if (this.max < y) {
                this.max = y;
            }
        }
        this.getStep(); 
    }
    plot(ctx, at) {
        ctx.strokeStyle = this.coordColor;
        ctx.fillStyle = this.coordColor;
        ctx.beginPath();
        ctx.moveTo(at, 0);
        ctx.lineTo(at, this.size);          // line
        ctx.moveTo(at-this.arrowLength, this.arrowLength);    // arrow
        ctx.lineTo(at, 0);
        ctx.lineTo(at+this.arrowLength, this.arrowLength);
        ctx.stroke();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        for (var y = this.rmin; y < this.rmax; y += this.numStep) {
            let ys = this.toScreenValue(y);
            ctx.fillText(this.format.format(y), at + this.tickLength / 2 + 2, ys);
        }
        ctx.beginPath();
        for (var y = this.rmin; y < this.rmax; y += this.tickStep) {
            let ys = this.toScreenValue(y);
            ctx.moveTo(at - this.tickLength / 2, ys);     // tick
            ctx.lineTo(at + this.tickLength / 2, ys);
        }
        ctx.stroke();
    }
}
