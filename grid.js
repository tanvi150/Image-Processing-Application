// No. of grids in each row
let frame = [2, 3, 3, 3, 3];

class GridCell {
    constructor(x, y, type, label) {
        this.x = x;
        this.y = y;
        this.w = 160;
        this.h = 120;
        this.type = type;
        this.label = label;
    }

    render(baseImage) {
        this.drawFrame();

        if (baseImage) {
            this.drawContent(baseImage);
        }

        this.drawLabel();
        this.drawDecoration();
    }

    drawFrame() {
        // Draw the frame
        noFill();
        stroke(0, 8, 120);
        strokeWeight(0.5);
        rect(this.x, this.y, this.w, this.h);
    }

    drawContent(baseImage) {
        switch (this.type) {
            case 0:
            case 8:
                image(baseImage, this.x, this.y, this.w, this.h);
                break;
            case 1:
                image(greyScale(baseImage), this.x, this.y, this.w, this.h);
                break;
            case 2:
            case 3:
            case 4:
                // Load pixels
                baseImage.loadPixels();

                // Get colour channel images
                let [r_Image, g_Image, b_Image] = colourChannel(baseImage);

                if (this.type === 2) image(r_Image, this.x, this.y, this.w, this.h);
                if (this.type === 3) image(g_Image, this.x, this.y, this.w, this.h);
                if (this.type === 4) image(b_Image, this.x, this.y, this.w, this.h);
                break;
            case 5:
            case 6:
            case 7:
                // Ensure pixels are ready
                baseImage.loadPixels();

                // Get colour channel images
                let [rT, gT, bT] = colourChannel(baseImage);

                // Apply image thresholding for sliders
                let thresholdR = colourChannelSliders(rT, 'r', r_slider.value());
                let thresholdG = colourChannelSliders(gT, 'g', g_slider.value());
                let thresholdB = colourChannelSliders(bT, 'b', b_slider.value());

                if (this.type === 5) image(thresholdR, this.x, this.y, this.w, this.h);
                if (this.type === 6) image(thresholdG, this.x, this.y, this.w, this.h);
                if (this.type === 7) image(thresholdB, this.x, this.y, this.w, this.h);
                break;
            case 9:
                image(CIELAB(baseImage), this.x, this.y, this.w, this.h);
                break;
            case 10:
                image(ycbcr(baseImage), this.x, this.y, this.w, this.h);
                break;
            case 11:
                image(baseImage, this.x, this.y, this.w, this.h);

                // Draw landmarks
                faceDetection(this.x, this.y, this.w, this.h, baseImage);
                break;
            case 12:
                baseImage.loadPixels();
                let labThreshold = CIELABSliders(baseImage, colourspace1_slider.value());
                image(labThreshold, this.x, this.y, this.w, this.h);
                break;
            case 13:
                baseImage.loadPixels();
                let ycbcrThreshold = ycbcrSliders(baseImage, colourspace2_slider.value());
                image(ycbcrThreshold, this.x, this.y, this.w, this.h);
                break;
        }
    }

    drawLabel() {
        if (!this.label) return;

        noStroke();
        fill(0, 120); // semi-transparent background
        rect(this.x, this.y + 100, this.w, 18);

        fill(255);
        textSize(11);
        textAlign(LEFT, CENTER);
        text(this.label, this.x + 5, this.y + 110);
    }

    drawDecoration() {
        // --- Bottom Right Flower ---
        image(flowerImg, this.x + this.w - 30, this.y + this.h - 35, 40, 45);

        // --- Top Left Border ---
        image(borderImg, this.x - 5, this.y - 5, 25, 15);
    }
}

function drawGrids() {
    let frameCount = 0;

    // Determine base image for all frames
    let baseImage = (images[0]) ? images[0] : (snapshot ? snapshot : capture);

    // Outer loop: iterate over each row 
    for (let row = 0; row < frame.length; row++) {
        // Inner loop: draws the number of rectangles per row
        for (let i = 0; i < frame[row]; i++) {
            
            let x = 20 + i * 170;
            let y = 50 + row * 130;

            let cell = new GridCell(x, y, frameCount, frameLabels[frameCount]);
            cell.render(baseImage);

            frameCount++;
        }
    }
}