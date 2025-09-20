/* 
 */

function downloadImage(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

function canvasDownload(id,canvasSelector,ext) {
    // Convert canvas to image
    document.getElementById(id).addEventListener("click", function(e) {
        var canvas = document.querySelector(canvasSelector);
        var dataURL = canvas.toDataURL("image/" + ext, 0.9);    // optional jpeg compression
        downloadImage(dataURL, "canvas." + ext);
    });
}

// convert html colors:
//    Rgb 	rgb(255, 119, 51)
//    Hex 	#ff7733, #eee
function colorComponents(color) {
    color = color.trim();
    let red = 0, green = 0, blue = 0, alpha = 0;
    if (color.substring(0,3).toLowerCase() === "rgb") {
        let end = 4;
        if (color.substring(0,3).toLowerCase() === "rgba") {
            let end = 5;
        }
        color = color.substring(end,color.length-1);
        let colors = color.split(",");
            red = Number.parseInt(colors[0]);
            green = Number.parseInt(colors[1]);
            blue = Number.parseInt(colors[2]);
            if (colors.length > 3) {
                alpha = Number.parseInt(colors[3]);
            }
    }
    else if (color.substring(0,1) === "#") {
        if (color.length === 3) {
            red = Number.parseInt(color.substring(1,2)+"0",16);
            green = Number.parseInt(color.substring(2,3)+"0",16);
            blue = Number.parseInt(color.substring(3,4)+"0",16);
        }
        else {
            red = Number.parseInt(color.substring(1,3),16);
            green = Number.parseInt(color.substring(3,5),16);
            blue = Number.parseInt(color.substring(5,7),16);
        }
    }

    return {r: red, g: green, b: blue, a: alpha};
}

function colorAsHex(color) {
    var r = ("0" + color.r.toString(16)).slice(-2);
    var g = ("0" + color.g.toString(16)).slice(-2);
    var b = ("0" + color.b.toString(16)).slice(-2);
    return "#"+r+g+b;
}