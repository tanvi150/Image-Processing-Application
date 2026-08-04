// Function that handles the greyscale filter in the second frame
function greyScale(imageInput) {
    if (!imageInput) {
        return null;
    }

    // Create a new independent copy
    let imageCopy = imageInput.get();

    // Prepare pixels array for editing an image (in this case, for adding a greyscale filter)
    imageCopy.loadPixels()

    for (var y = 0; y < imageCopy.height; y++) {
        for (var x = 0; x < imageCopy.width; x++) {
            // Calculate the pixel index
            let pixelIndex = (x + y * imageCopy.width) * 4;

            // Read the original RGB values
            let r = imageCopy.pixels[pixelIndex];
            let g = imageCopy.pixels[pixelIndex + 1];
            let b = imageCopy.pixels[pixelIndex + 2];

            // Convert to greyscale using luminosity method
            let grey = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);

            // Decrease brightness 20% AND clamp to 255
            grey = constrain(grey * 0.8, 0, 255);

            // Scale new pixel values
            imageCopy.pixels[pixelIndex] = grey;
            imageCopy.pixels[pixelIndex + 1] = grey;
            imageCopy.pixels[pixelIndex + 2] = grey;
        }
    }

    // Apply the changes
    imageCopy.updatePixels();
    return imageCopy;
}

// Function that handles the RGB colour channels frames - Frames 3, 4 & 5
function colourChannel(imageInput) {
    if (!imageInput) {
        return [null, null, null];
    }

    // Create an independent copy for each RGB channel
    let r_Image = createImage(imageInput.width, imageInput.height);
    let g_Image = createImage(imageInput.width, imageInput.height);
    let b_Image = createImage(imageInput.width, imageInput.height);

    // Prepare pixels array for each RGB channel
    r_Image.loadPixels();
    g_Image.loadPixels();
    b_Image.loadPixels();

    for (var y = 0; y < imageInput.height; y++) {
        for (var x = 0; x < imageInput.width; x++) {
            // Calculate the pixel index
            let pixelIndex = (x + y * imageInput.width) * 4;

            // Read the original RGB values
            let r = imageInput.pixels[pixelIndex];
            let g = imageInput.pixels[pixelIndex + 1];
            let b = imageInput.pixels[pixelIndex + 2];

            // Red channel 
            r_Image.pixels[pixelIndex] = r;
            r_Image.pixels[pixelIndex + 1] = 0;
            r_Image.pixels[pixelIndex + 2] = 0;
            r_Image.pixels[pixelIndex + 3] = 255;

            // Green channel 
            g_Image.pixels[pixelIndex] = 0;
            g_Image.pixels[pixelIndex + 1] = g;
            g_Image.pixels[pixelIndex + 2] = 0;
            g_Image.pixels[pixelIndex + 3] = 255;

            // Blue channel 
            b_Image.pixels[pixelIndex] = 0;
            b_Image.pixels[pixelIndex + 1] = 0;
            b_Image.pixels[pixelIndex + 2] = b;
            b_Image.pixels[pixelIndex + 3] = 255;
        }
    }

    r_Image.updatePixels();
    g_Image.updatePixels();
    b_Image.updatePixels();

    return [r_Image, g_Image, b_Image];
}

// Function that handles colourspace 1 -> CIEL*a*b
function CIELAB(imageInput) {
    if (!imageInput) return null;

    let img = imageInput.get();
    img.loadPixels();

    // Reference white
    const Xn = 0.95047;
    const Yn = 1.0;
    const Zn = 1.08883;

    for (var y = 0; y < img.height; y++) {
        for (var x = 0; x < img.width; x++) {
            let i = (x + y * img.width) * 4;

            let r = img.pixels[i] / 255;
            let g = img.pixels[i + 1] / 255;
            let b = img.pixels[i + 2] / 255;

            // sRGB -> Linear 
            r = (r <= 0.04045) ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
            g = (g <= 0.04045) ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
            b = (b <= 0.04045) ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

            // Linear RGB -> XYZ
            let X = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
            let Y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
            let Z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

            // Normalize by white
            let xN = X / Xn;
            let yN = Y / Yn;
            let zN = Z / Zn;

            // f(t) function
            function f(t) {
                return (t > 0.008856) ? Math.cbrt(t) : (7.787 * t + 16 / 116);
            }

            let fx = f(xN);
            let fy = f(yN);
            let fz = f(zN);

            // Lab Components
            let L = 116 * fy - 16;
            let a = 500 * (fx - fy);
            let bLab = 200 * (fy - fz);

            // Map Lab to display
            let L_disp = Math.pow(L / 100, 1 / 2.2) * 255;

            // a* and b* -> colour channels (shift to 0-255)
            let a_disp = constrain(a + 128, 0, 255);
            let b_disp = constrain(bLab + 128, 0, 255);

            img.pixels[i] = L_disp;
            img.pixels[i + 1] = a_disp;
            img.pixels[i + 2] = b_disp;
            img.pixels[i + 3] = 255;
        }
    }

    img.updatePixels();
    return img;
}

// Function that handles colourspace 2 -> YCbCr
function ycbcr(imageInput) {
    if (!imageInput) return null;

    let imageCopy = imageInput.get();
    imageCopy.loadPixels();

    for (var y = 0; y < imageCopy.height; y++) {
        for (var x = 0; x < imageCopy.width; x++) {
            let i = (x + y * imageCopy.width) * 4;

            let r = imageCopy.pixels[i] / 255;
            let g = imageCopy.pixels[i + 1] / 255;
            let b = imageCopy.pixels[i + 2] / 255;

            // Compute Y', Cb, Cr using provided coefficients
            let Y = 0.2215 * r + 0.7154 * g + 0.0721 * b;
            let Cb = - 0.1145 * r - 0.3855 * g + 0.5000 * b;
            let Cr = 0.5016 * r - 0.4556 * g - 0.0459 * b;

            let Y_disp = constrain(Y * 255, 0, 255);
            let Cb_disp = constrain((Cb + 0.5) * 255, 0, 255);
            let Cr_disp = constrain((Cr + 0.5) * 255, 0, 255);

            imageCopy.pixels[i] = Y_disp;
            imageCopy.pixels[i + 1] = Cb_disp;
            imageCopy.pixels[i + 2] = Cr_disp;
            imageCopy.pixels[i + 3] = 255;
        }
    }

    imageCopy.updatePixels();
    return imageCopy;
}