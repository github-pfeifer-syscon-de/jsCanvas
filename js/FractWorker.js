/*
 * worker that does the actual calculation.
 */
onmessage = function(e) {
    let param = e.data;
    for (var y = 0; y < param.height; y++) {
        var imag = y * param.imag_step + param.imag_start;
        let row = [];
        for (var x = 0; x < param.width; x++) {
            var real = x * param.real_step + param.real_start;

            let iterations = iterate(real, imag, param.depth);
            row[x] = iterations;
        }
        let ret = {y:y, row:row};
        postMessage(ret);
    }
};

function iterateJuliaSet(real0,imag0,depth) {
        var real = real0;
        var imag = imag0;
        real0 = -0.21007;    // nice juliaset "point"
        imag0 = -0.660672;

        var iterations = 0;
        for (; iterations < depth; iterations++) {
            let real2 = real * real;
            let imag2 = imag * imag;
            if (real2 + imag2 >= 4.0) {
                break;
            }
            let t_rx = real2 - imag2 + real0;
            imag = 2.0 * real * imag + imag0;
            real = t_rx;
        }
        return iterations;
    }
function iterateMandel(real0,imag0,depth) {
        var real = 0;
        var imag = 0;

        var iterations = 0;
        for (; iterations < depth; iterations++) {
            let real2 = real * real;
            let imag2 = imag * imag;
            if (real2 + imag2 >= 4.0) {
                break;
            }
            let t_rx = real2 - imag2 + real0;
            imag = 2.0 * real * imag + imag0;
            real = t_rx;
        }
        return iterations;
    }
function iterate(real0,imag0,depth) {
        return this.iterateMandel(real0,imag0,depth);
        //return fract.iterateJuliaSet(real0,imag0,depth);
    }
