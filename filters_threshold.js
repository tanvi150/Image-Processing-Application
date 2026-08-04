// Function that handles the threshold for colour channels
function colourChannelSliders(imageInput, channel, value) {
    if (!imageInput) {
        return null;
    }

    let imageCopy = createImage(imageInput.width, imageInput.height);

    imageInput.loadPixels();
    imageCopy.loadPixels();

    for (var i = 0; i < imageInput.pixels.length; i += 4) {
        let r = imageInput.pixels[i];
        let g = imageInput.pixels[i + 1];
        let b = imageInput.pixels[i + 2];
        let a = imageInput.pixels[i + 3];

        // Ensures a monochromatic (black or white) image
        let thresholdResult = 0;

        // Thresholding logic
        if (channel === 'r') {
            thresholdResult = r > value ? 255 : 0;
        }
        else if (channel === 'g') {
            thresholdResult = g > value ? 255 : 0;
        }
        else if (channel === 'b') {
            thresholdResult = b > value ? 255 : 0;
        }

        imageCopy.pixels[i] = thresholdResult;
        imageCopy.pixels[i + 1] = thresholdResult;
        imageCopy.pixels[i + 2] = thresholdResult;
        imageCopy.pixels[i + 3] = a;
    }

    imageCopy.updatePixels();
    return imageCopy;
}

// Function that handles the threshold for the CIELAB
function CIELABSliders(imageInput, sliderValue) {
    if (!imageInput) return null;

    let imageCopy = imageInput.get();
    imageCopy.loadPixels();

    // Reference white
    const Xn = 0.95047;
    const Yn = 1.0;

    for (var y = 0; y < imageCopy.height; y++) {
        for (var x = 0; x < imageCopy.width; x++) {
            let i = (x + y * imageCopy.width) * 4;

            let r = imageCopy.pixels[i] / 255;
            let g = imageCopy.pixels[i + 1] / 255;
            let b = imageCopy.pixels[i + 2] / 255;

            // sRGB -> Linear 
            r = (r <= 0.04045) ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
            g = (g <= 0.04045) ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
            b = (b <= 0.04045) ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

            // Linear RGB -> XYZ
            let Y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;

            // Normalize by white
            let yN = Y / Yn;

            // f(t) function
            function f(t) {
                return (t > 0.008856) ? Math.cbrt(t) : (7.787 * t + 16 / 116);
            }

            let fy = f(yN);

            // Lab Components
            let L = 116 * fy - 16;

            // a* and b* -> colour channels (shift to 0-255)
            let L_disp = constrain(L + 128, 0, 255);

            let LThreshold = (L_disp > sliderValue) ? 255 : 0;

            imageCopy.pixels[i] = LThreshold;
            imageCopy.pixels[i + 1] = LThreshold;
            imageCopy.pixels[i + 2] = LThreshold;
            imageCopy.pixels[i + 3] = 255;
        }
    }

    imageCopy.updatePixels();
    return imageCopy;
}

function ycbcrSliders(imageInput, sliderValue) {
    if (!imageInput) return null;

    let imageCopy = imageInput.get();
    imageCopy.loadPixels();

    for (var y = 0; y < imageCopy.height; y++) {
        for (var x = 0; x < imageCopy.width; x++) {
            let i = (x + y * imageCopy.width) * 4;

            let r = imageCopy.pixels[i] / 255;
            let g = imageCopy.pixels[i + 1] / 255;
            let b = imageCopy.pixels[i + 2] / 255;

            // Compute Y using provided coefficients
            let Y = 0.2215 * r + 0.7154 * g + 0.0721 * b;

            let Y_disp = constrain(Y * 255, 0, 255);

            let YThreshold = (Y_disp > sliderValue) ? 255 : 0;

            imageCopy.pixels[i] = YThreshold;
            imageCopy.pixels[i + 1] = YThreshold;
            imageCopy.pixels[i + 2] = YThreshold;
            imageCopy.pixels[i + 3] = 255;
        }
    }

    imageCopy.updatePixels();
    return imageCopy;
}