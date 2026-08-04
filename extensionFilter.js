// Function that handles the X-Ray image
function x_ray() {
    // Load webcam pixels
    ext_capture.loadPixels();

    let xrayImg = createImage(ext_capture.width, ext_capture.height);
    xrayImg.loadPixels();

    for (var i = 0; i < ext_capture.pixels.length; i += 4) {
        xrayImg.pixels[i] = 255 - ext_capture.pixels[i];
        xrayImg.pixels[i + 1] = 255 - ext_capture.pixels[i + 1];
        xrayImg.pixels[i + 2] = 255 - ext_capture.pixels[i + 2];
        xrayImg.pixels[i + 3] = 255;
    }

    xrayImg.updatePixels();
    return xrayImg;
}

// Function that handles the solarization of an image
function solarize() {
    ext_capture.loadPixels();

    let solarizeImg = createImage(ext_capture.width, ext_capture.height);
    solarizeImg.loadPixels();

    for (var i = 0; i < ext_capture.pixels.length; i += 4) {
        // Each pixel has 4 values: R, G, B, A
        let r = ext_capture.pixels[i];
        let g = ext_capture.pixels[i + 1];
        let b = ext_capture.pixels[i + 2];

        // Solarize logic: invert if above 128 
        if (r > 100) r = 255 - r;
        if (g > 100) g = 255 - g;
        if (b > 100) b = 255 - b;

        // Write back to the pixels array
        solarizeImg.pixels[i] = r;
        solarizeImg.pixels[i + 1] = g;
        solarizeImg.pixels[i + 2] = b;

        // Alpha
        solarizeImg.pixels[i + 3] = ext_capture.pixels[i + 3];
    }

    solarizeImg.updatePixels();
    return solarizeImg;
}

// Function that handles the false channel filter of an image
function falseChannel() {
    ext_capture.loadPixels();

    let falseImg = createImage(ext_capture.width, ext_capture.height);
    falseImg.loadPixels();

    for (var i = 0; i < ext_capture.pixels.length; i += 4) {
        let r = ext_capture.pixels[i];
        let g = ext_capture.pixels[i + 1];
        let b = ext_capture.pixels[i + 2];
        let a = ext_capture.pixels[i + 3];

        // Calculate brightness
        let brightness = (r + g + b) / 3;

        // Map brightness to thermal colours
        var tr, tg, tb;

        if (brightness < 85) {
            // cold -> blue/purple
            tr = map(brightness, 0, 85, 0, 100);
            tg = map(brightness, 0, 85, 0, 0);
            tb = map(brightness, 0, 85, 50, 255);
        }
        else if (brightness < 170) {
            // medium -> green/ yellow
            tr = map(brightness, 85, 170, 100, 255);
            tg = map(brightness, 85, 170, 255, 255);
            tb = map(brightness, 85, 170, 0, 50);
        }
        else {
            // hot -> red/orange
            tr = map(brightness, 170, 255, 255, 255);
            tg = map(brightness, 170, 255, 255, 100);
            tb = map(brightness, 170, 255, 50, 0);
        }

        // Swap channels for false colour effect
        falseImg.pixels[i] = tr;
        falseImg.pixels[i + 1] = tg;
        falseImg.pixels[i + 2] = tb;
        falseImg.pixels[i + 3] = a;
    }

    falseImg.updatePixels();
    return falseImg;
}

// Function that handles the edge-detection filter
function sketch() {
    ext_capture.loadPixels();

    sketchImg = createImage(ext_capture.width, ext_capture.height);
    sketchImg.loadPixels();

    for (var y = 0; y < ext_capture.height; y++) {
        for (var x = 0; x < ext_capture.width; x++) {
            let i = (x + y * ext_capture.width) * 4;

            // Get greyscale value
            let r = ext_capture.pixels[i];
            let g = ext_capture.pixels[i + 1];
            let b = ext_capture.pixels[i + 2];
            let grey = (r + g + b) / 3;

            // Edge detection: compare with right and bottom neighbour
            let right = ((x + 1 < ext_capture.width ? x + 1 : x) + y * ext_capture.width) * 4;
            let bottom = (x + ((y + 1 < ext_capture.width ? y + 1 : y) * ext_capture.width)) * 4;

            let greyRight = (ext_capture.pixels[right] + ext_capture.pixels[right + 1] + ext_capture.pixels[right + 2]) / 3;
            let greyBottom = (ext_capture.pixels[bottom] + ext_capture.pixels[bottom + 1] + ext_capture.pixels[bottom + 2]) / 3;

            let edge = abs(grey - greyRight) + abs(grey - greyBottom);

            // Invert so that edges are black
            let sketchVal = 255 - constrain(edge * 8, 0, 255);

            sketchImg.pixels[i] = sketchVal;
            sketchImg.pixels[i + 1] = sketchVal;
            sketchImg.pixels[i + 2] = sketchVal;
            sketchImg.pixels[i + 3] = ext_capture.pixels[i + 3];

        }
    }

    sketchImg.updatePixels();
    return sketchImg;
}

function pencilStrokes() {
    // Animate pencil strokes
    sketchImg.loadPixels();
    for (var n = 0; n < 2000; n++) {
        // Adjust number of pixels changing per frame
        let i = int(random(0, ext_capture.pixels.length / 4)) * 4;
        // Pencil stroke variation
        let change = random(-30, 30);
        for (var j = 0; j < 3; j++) {
            sketchImg.pixels[i + j] = constrain(sketchImg.pixels[i + j] + change, 0, 255);
        }
    }

    sketchImg.updatePixels();
}

// Function that handles the 1977 filter
function vintage() {
    ext_capture.loadPixels();

    let vintageImg = createImage(ext_capture.width, ext_capture.height);
    vintageImg.loadPixels();

    for (var i = 0; i < ext_capture.pixels.length; i += 4) {
        let r = ext_capture.pixels[i];
        let g = ext_capture.pixels[i + 1];
        let b = ext_capture.pixels[i + 2];
        let a = ext_capture.pixels[i + 3];

        // Slight fade (lifts blacks)
        r = lerp(30, r, 0.9);
        g = lerp(30, g, 0.9);
        b = lerp(30, b, 0.9);

        // Pink warmth
        r *= 1.25;
        b *= 1.10;

        vintageImg.pixels[i] = constrain(r, 0, 255);
        vintageImg.pixels[i + 1] = constrain(g, 0, 255);
        vintageImg.pixels[i + 2] = constrain(b, 0, 255);
        vintageImg.pixels[i + 3] = a;
    }

    vintageImg.updatePixels();
    return vintageImg;
}

// Function that handles the mosaic filter
function mosaic(tileSize = 5) {
    ext_capture.loadPixels();

    let mosaicImg = createImage(ext_capture.width, ext_capture.height);
    mosaicImg.loadPixels();

    for (var y = 0; y < ext_capture.height; y += tileSize) {
        for (var x = 0; x < ext_capture.width; x += tileSize) {
            // Index of the top-left pixel of the tile
            let i = (x + y * ext_capture.width) * 4;

            let r = ext_capture.pixels[i];
            let g = ext_capture.pixels[i + 1];
            let b = ext_capture.pixels[i + 2];
            let a = ext_capture.pixels[i + 3];

            // Fill the block
            for (var ty = 0; ty < tileSize; ty++) {
                for (var tx = 0; tx < tileSize; tx++) {
                    let nx = x + tx;
                    let ny = y + ty;

                    if (nx < ext_capture.width && ny < ext_capture.height) {
                        let ni = (nx + ny * ext_capture.width) * 4;
                        mosaicImg.pixels[ni] = r;
                        mosaicImg.pixels[ni + 1] = g;
                        mosaicImg.pixels[ni + 2] = b;
                        mosaicImg.pixels[ni + 3] = a;
                    }
                }
            }
        }
    }

    mosaicImg.updatePixels();
    return mosaicImg;
}

// Function that handles the fish-eye filter
function fisheye(strength) {
    ext_capture.loadPixels();

    let feImg = createImage(ext_capture.width, ext_capture.height);
    feImg.loadPixels();

    let cx = ext_capture.width / 2;
    let cy = ext_capture.height / 2;
    let radius = min(cx, cy);

    for (var y = 0; y < ext_capture.height; y++) {
        for (var x = 0; x < ext_capture.width; x++) {
            let dx = x - cx;
            let dy = y - cy;
            let r = sqrt(dx * dx + dy * dy);

            let dst = (x + y * ext_capture.width) * 4;

            // Outside circle -> black 
            if (r > radius) {
                feImg.pixels[dst] = 0;
                feImg.pixels[dst + 1] = 0;
                feImg.pixels[dst + 2] = 0;
                feImg.pixels[dst + 3] = 255;
                continue;
            }

            // Inside circle -> fisheye

            // Normalised radius
            let rn = r / radius;

            // Fish eye distortion
            let rnDistorted = pow(rn, strength);
            let scale = rn == 0 ? 1 : rnDistorted / rn;

            let sx = cx + dx * scale;
            let sy = cy + dy * scale;

            sx = constrain(floor(sx), 0, ext_capture.width - 1);
            sy = constrain(floor(sy), 0, ext_capture.height - 1);

            let src = (sx + sy * ext_capture.width) * 4;

            feImg.pixels[dst] = ext_capture.pixels[src];
            feImg.pixels[dst + 1] = ext_capture.pixels[src + 1];
            feImg.pixels[dst + 2] = ext_capture.pixels[src + 2];
            feImg.pixels[dst + 3] = ext_capture.pixels[src + 3];
        }
    }

    feImg.updatePixels();
    return feImg;
}

// Function that handles a kaleidoscope effect
function kaleidoscope(segments) {
    ext_capture.loadPixels();

    let kImg = createImage(ext_capture.width, ext_capture.height);
    kImg.loadPixels();

    let cx = ext_capture.width / 2;
    let cy = ext_capture.height / 2;
    let angleStep = TWO_PI / segments;

    for (var y = 0; y < ext_capture.height; y++) {
        for (var x = 0; x < ext_capture.width; x++) {
            let dx = x - cx;
            let dy = y - cy;
            let r = sqrt(dx * dx + dy * dy);
            let theta = atan2(dy, dx);

            // Wrap theta into the first segment
            let segmentIndex = floor(theta / angleStep);
            let thetaMod = theta - segmentIndex * angleStep;

            // Mirror every other segment
            if (segmentIndex % 2 != 0) {
                thetaMod = angleStep - thetaMod;
            }

            // Map back to source coordinates
            let sx = cx + r * cos(thetaMod);
            let sy = cy + r * sin(thetaMod);

            sx = constrain(floor(sx), 0, ext_capture.width - 1);
            sy = constrain(floor(sy), 0, ext_capture.height - 1);

            let src = (sx + sy * ext_capture.width) * 4;
            let dst = (x + y * ext_capture.width) * 4;

            kImg.pixels[dst] = ext_capture.pixels[src];
            kImg.pixels[dst + 1] = ext_capture.pixels[src + 1];
            kImg.pixels[dst + 2] = ext_capture.pixels[src + 2];
            kImg.pixels[dst + 3] = ext_capture.pixels[src + 3];
        }
    }

    kImg.updatePixels();
    return kImg;
}

// Function that handles the horizontal reflection
function reflection() {
    ext_capture.loadPixels();

    let hrImg = createImage(ext_capture.width * 2, ext_capture.height);
    hrImg.loadPixels();

    for (var y = 0; y < ext_capture.height; y++) {
        for (var x = 0; x < ext_capture.width; x++) {
            let src = (x + y * ext_capture.width) * 4;

            // Left half: original
            let dstLeft = (x + y * hrImg.width) * 4;

            hrImg.pixels[dstLeft] = ext_capture.pixels[src];
            hrImg.pixels[dstLeft + 1] = ext_capture.pixels[src + 1];
            hrImg.pixels[dstLeft + 2] = ext_capture.pixels[src + 2];
            hrImg.pixels[dstLeft + 3] = ext_capture.pixels[src + 3];

            // Right half: mirrored
            let mirroredX = ext_capture.width - 1 - x;
            let dstRight = (x + ext_capture.width + y * hrImg.width) * 4;
            let srcMirror = (mirroredX + y * ext_capture.width) * 4

            hrImg.pixels[dstRight] = ext_capture.pixels[srcMirror];
            hrImg.pixels[dstRight + 1] = ext_capture.pixels[srcMirror + 1];
            hrImg.pixels[dstRight + 2] = ext_capture.pixels[srcMirror + 2];
            hrImg.pixels[dstRight + 3] = ext_capture.pixels[srcMirror + 3];
        }
    }

    hrImg.updatePixels();
    return hrImg;
}