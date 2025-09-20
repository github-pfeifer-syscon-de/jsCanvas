/* 
 */

class ColorSelection {
    constructor(name,defColor,selected) {
        this.name = name;
        this.selected = selected;
        let id = '#' + name;

        this.parent = document.querySelector(id);

        this.canvas = document.createElement("canvas");
        let attrWidth = document.createAttribute("width");
        attrWidth.value = "32";
        this.canvas.setAttributeNode(attrWidth);
        let attrHeight = document.createAttribute("height");
        attrHeight.value = "20";
        this.canvas.setAttributeNode(attrHeight);
        var color = this.parent.getAttribute("color");
        if (typeof(color) === "undefined" || color === null) {
            color = defColor;
        }
        this.setColor(color);
        this.parent.appendChild(this.canvas);
        //var text = document.createTextNode("\u00A0");
        //this.parent.appendChild(text);

        //this.button = document.createElement("button");
        //this.button.innerHTML = "Select";
        //this.parent.appendChild(this.button);
        this.canvas.addEventListener("click", (e)=> {
            this.colorSelect(e);
        });
    }

    setColor(color) {
        this.parent.setAttribute("color", color);
        let attrStyle = document.createAttribute("style");
        attrStyle.value = "background-color: " + color + "; border: 1px solid black; ";
        this.canvas.setAttributeNode(attrStyle);
    }

    slideChange(e,name) {
        var color = colorComponents(this.parent.getAttribute("color"));
        var n = Number.parseInt(e.target.value);
        if (name === "r") {
            color.r = n;
        }
        else if (name === "g") {
            color.g = n;
        }
        else if (name === "b") {
            color.b = n;
        }
        color = colorAsHex(color);
        this.setColor(color);
    }

    createSlide(name,value) {
        var slide = document.createElement("input");
        let attrType = document.createAttribute("type");
        attrType.value = "range";
        slide.setAttributeNode(attrType);
        let attrId = document.createAttribute("id");
        attrId.value = name;
        slide.setAttributeNode(attrId);
        let attrMin = document.createAttribute("min");
        attrMin.value = "0";
        slide.setAttributeNode(attrMin);
        let attrMax = document.createAttribute("max");
        attrMax.value = "255";
        slide.setAttributeNode(attrMax);
        let attrValue = document.createAttribute("value");
        attrValue.value = value;
        slide.setAttributeNode(attrValue);
        slide.addEventListener("change", (e)=> {
            this.slideChange(e,name);
        });

        return slide;
    }
   

    colorSelect(e) {
        var popup = document.createElement("div");
        let attrStyle = document.createAttribute("style");
        attrStyle.value = "position: absolute;"
                         +" left: " + e.clientX + "px; top: " + e.clientY + "px;"
                         +" background-color: #eee;"
                         +" border: 2px solid black; "
                         +" border-radius: 5px;";
        popup.setAttributeNode(attrStyle);
        var color = colorComponents(this.parent.getAttribute("color"));
        var r = this.createSlide("r", color.r);
        var text = document.createTextNode("r:\u00A0");
        popup.appendChild(text);
        popup.appendChild(r);
        popup.appendChild(document.createElement("br"));
        var g = this.createSlide("g", color.g);
        text = document.createTextNode("g:\u00A0");
        popup.appendChild(text);
        popup.appendChild(g);
        popup.appendChild(document.createElement("br"));
        var b = this.createSlide("b", color.b);
        text = document.createTextNode("g:\u00A0");
        popup.appendChild(text);
        popup.appendChild(b);
        popup.appendChild(document.createElement("br"));

        var p = document.createElement("p");
        popup.appendChild(p);
        this.button = document.createElement("button");
        this.button.innerHTML = "Ok";
        p.appendChild(this.button);
        var style = document.createAttribute("style");
        style.value = "display: block; margin-left: auto; margin-right: auto;";
        this.button.setAttributeNode(style);
        this.button.addEventListener("click", (e)=> {
            this.parent.removeChild(popup);
            this.selected();    // invoke update function
        });

        this.parent.appendChild(popup);
    }

}