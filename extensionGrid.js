// No. of grids in each row
let frame = [3, 3, 3];

class extensionGridCell {
    constructor(x, y, type, label) {
        this.x = x;
        this.y = y;
        this.w = 250;
        this.h = 150;
        this.type = type;
        this.label = label;
    }

    render(ext_capture, isSelected) {
        this.drawFrame(isSelected);

        if (ext_capture) {
            this.drawContent(ext_capture);
        }

        this.drawLabel();
    }

    drawFrame(isSelected) {
        // Highlight selected filter when drawing the frame
        if (isSelected) {
            stroke(255, 0, 0);
            strokeWeight(3);
        }
        else {
            stroke(0, 8, 120);
            strokeWeight(0.5);
        }
        rect(this.x, this.y, this.w, this.h);
    }

    drawContent(ext_capture) {
        switch (this.type) {
            case 0:
                image(x_ray(ext_capture), this.x, this.y, this.w, this.h);
                break;
            case 1:
                image(solarize(ext_capture), this.x, this.y, this.w, this.h);
                break;
            case 2:
                image(falseChannel(ext_capture), this.x, this.y, this.w, this.h);
                break;
            case 3:
                sketchImg = sketch();
                pencilStrokes();
                image(sketchImg, this.x, this.y, this.w, this.h);
                break;
            case 4:
                image(vintage(ext_capture), this.x, this.y, this.w, this.h);
                break;
            case 5:
                let mosaicFilter = mosaic();
                image(mosaicFilter, this.x, this.y, this.w, this.h);
                break;
            case 6:
                let fisheyeFilter = fisheye(1.3);
                image(fisheyeFilter, this.x, this.y, this.w, this.h);
                break;
            case 7:
                let kaleidoscopeFilter = kaleidoscope(12);
                image(kaleidoscopeFilter, this.x, this.y, this.w, this.h);
                break;
            case 8:
                image(reflection(ext_capture), this.x, this.y, this.w, this.h);
                break;
            default:
                image(ext_capture, this.x, this.y, this.w, this.h);
                break;
        }
    }

    // --- Frame Labels ---
    drawLabel() {
        if (!this.label) return;

        noStroke();
        fill(0, 120); 
        rect(this.x, this.y + 130, this.w, 18);

        fill(255);
        textSize(11);
        textAlign(LEFT, CENTER);
        text(this.label, this.x + 5, this.y + 140);
    }
}

function drawExtensionGrids() {
    // Counter for different filters
    let extensionFrameCount = 0;

    // Outer loop: iterate over each row 
    for (let row = 0; row < frame.length; row++) {
        // Inner loop: draws the number of rectangles per row
        for (let i = 0; i < frame[row]; i++) {
            // Frame properties
            let x = 350 + i * 300;
            let y = 150 + row * 180;

            let isSelected = extensionFrameCount === selectedFilter;
            let cell = new extensionGridCell(x, y, extensionFrameCount, extFrameLabels[extensionFrameCount]);
            cell.render(ext_capture, isSelected);

            extensionFrameCount++;
        }
    }
}