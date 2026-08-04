function faceDetection(frameX, frameY, frameW, frameH, baseImage) {
    // If no faces, detected, return immediately
    if (!faces || faces.length === 0 || !baseImage) return;

    // Draw all tracked face points
    for (var i = 0; i < faces.length; i++) {
        let face = faces[i];

        let bx = frameX + (face.box.xMin / 160) * frameW;
        let by = frameY + (face.box.yMin / 120) * frameH;
        let bw = (face.box.width / 160) * frameW;
        let bh = (face.box.height / 120) * frameH;

        // Apply the effects in keystrokes - greyscale, horizontal face and pixel
        if (baseImage && (isGreyFace || isFlipped || isPixelatedFace)) {
            let sx = Math.floor((face.box.xMin / 160) * baseImage.width);
            let sy = Math.floor((face.box.yMin / 120) * baseImage.height);
            let sw = Math.floor((face.box.width / 160) * baseImage.width);
            let sh = Math.floor((face.box.height / 120) * baseImage.height);

            sx = constrain(sx, 0, baseImage.width - 1);
            sy = constrain(sy, 0, baseImage.height - 1);
            sw = constrain(sw, 0, baseImage.width - sx);
            sh = constrain(sh, 0, baseImage.height - sy);

            let faceSection = baseImage.get(sx, sy, sw, sh);

            if (faceSection) {
                // Apply greyscale effect
                if (isGreyFace) {
                    let greyFace = greyScaleFace(faceSection);
                    image(greyFace, bx, by, bw, bh);
                }
                // Apply flipped image effect
                else if (isFlipped) {
                    let hFlipImg = horizontalFlip(faceSection);
                    image(hFlipImg, bx, by, bw, bh);
                }
                // Apply pixel face effect
                else if (isPixelatedFace) {
                    pixelFace(faceSection, bx, by, bw, bh);
                }
            }
        }

        if (isPixelatedFace) {
            noFill();
            stroke(255);
            rect(bx, by, bw, bh);
        }
        else if (!isPixelatedFace && !isGreyFace && !isFlipped && faces.length > 0) {
            noFill();
            stroke(0, 255, 0);
            strokeWeight(2);
            rect(bx, by, bw, bh);
        }

    }
}

// Function that handles the greyscale filter in the bounding box
function greyScaleFace(imageInput) {
    if (!imageInput) {
        return null;
    }

    // Create a new independent copy
    let imageCopy = imageInput.get();

    // Prepare pixels array for editing an image
    imageCopy.loadPixels()

    for (var i = 0; i < imageCopy.pixels.length; i += 4) {
        // Luminosity greyscale
        let grey = 0.2126 * imageCopy.pixels[i] + 0.7152 * imageCopy.pixels[i + 1] + 0.0722 * imageCopy.pixels[i + 2];

        // Return the pixels to grey
        imageCopy.pixels[i] = imageCopy.pixels[i + 1] = imageCopy.pixels[i + 2] = grey;
    }

    // Apply the changes
    imageCopy.updatePixels();
    return imageCopy;
}

// Function that handles the horizontal flip effect in the bounding box
function horizontalFlip(imageInput) {
    if (!imageInput) {
        return null;
    }

    imageInput.loadPixels();

    // Create a new image of the same size
    let flippedImg = createImage(imageInput.width, imageInput.height);
    flippedImg.loadPixels();

    for (var y = 0; y < imageInput.height; y++) {
        for (var x = 0; x < imageInput.width; x++) {
            // RGBA index
            let srcIndex = (x + y * imageInput.width) * 4;
            
            // Flipped image index
            let destIndex = ((imageInput.width - 1 - x) + y * imageInput.width) * 4;

            // Copy RGBA values to flipped position
            flippedImg.pixels[destIndex] = imageInput.pixels[srcIndex];
            flippedImg.pixels[destIndex + 1] = imageInput.pixels[srcIndex + 1];
            flippedImg.pixels[destIndex + 2] = imageInput.pixels[srcIndex + 2];
            flippedImg.pixels[destIndex + 3] = imageInput.pixels[srcIndex + 3];
        }
    }

    flippedImg.updatePixels();
    return flippedImg;
}

// Function that handles the pixelated image filter in the bounding box
function pixelFace(imageInput, bx, by, bw, bh, blockSize = 5) {
    if (!imageInput) {
        return null;
    }

    // Ensure image is greyscale
    let greyImg = greyScaleFace(imageInput);
    greyImg.loadPixels();

    // scale to bounding box's width and height
    let scaleX = bw / greyImg.width;
    let scaleY = bh / greyImg.height;

    for (var y = 0; y < greyImg.height; y += blockSize) {
        for (var x = 0; x < greyImg.width; x += blockSize) {
            let sum = 0;
            let count = 0;

            // Sum up all pixels in the current block
            for (var by2 = 0; by2 < blockSize; by2++) {
                for (var bx2 = 0; bx2 < blockSize; bx2++) {
                    let px = x + bx2;
                    let py = y + by2;

                    if (px < greyImg.width && py < greyImg.height) {
                        let index = (px + py * greyImg.width) * 4;

                        sum += greyImg.pixels[index];
                        count++;
                    }
                }
            }

            // Average intensity of the block
            let avg = sum / count;

            // Draw the pixelated circles
            noStroke();
            fill(avg);

            let canvasX = bx + (x + blockSize / 2) * scaleX;
            let canvasY = by + (y + blockSize / 2) * scaleY;
            let circleSize = blockSize * ((scaleX + scaleY) / 2);

            circle(canvasX, canvasY, circleSize);
        }
    }

}