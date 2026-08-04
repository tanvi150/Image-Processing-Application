var ext_capture;
var sketchImg;
var bgImage;

let selectedFilter = 0;
let savedPhotos = [];

// Photobooth variables
let countdown = 0;
let counting = false;
// Controls the number of pictures to generate a photo strip
let photosToTake = 4;
let stripImage = null;
// Controls countdown duration
let lastTick = 0;
// Controls flash duration
let flashFrames = 0;

// Label names for each extension grid
const extFrameLabels = {
    0: "X-Ray",
    1: "Solarized",
    2: "False Channel",
    3: "Pencil Sketch",
    4: "1977",
    5: "Mosaic",
    6: "Fish Eye",
    7: "Kaleidoscope",
    8: "Horizontal Reflection"
}

function preload() {
    bgImage = loadImage("assets/background.jpg");
}

function setup() {
    createCanvas(1550, 700);

    // Initialise webcam for extension
    ext_capture = createCapture(VIDEO);
    // Scale image
    ext_capture.size(250, 150);
    // Prevent the webcam from showing outside the grid
    ext_capture.hide();

    // ---------- CAPTURE BUTTON (FOR PHOTOBOOTH) ----------
    captureButton = createImg("assets/camera.png");
    captureButton.position(95, 630);
    captureButton.size(50, 50);
    captureButton.style("cursor", "pointer");
    captureButton.mousePressed(startPhotobooth);

    // ----------- DOWNLOAD BUTTON (FOR PHOTOBOOTH) ----------
    downloadButton = createImg("assets/download.png");
    downloadButton.position(170, 630);
    downloadButton.size(50, 50);
    downloadButton.style("cursor", "pointer");
    downloadButton.mousePressed(downloadStrip);

    // ---------- TOGGLE BUTTON ----------
    // Create a button that redirects to the main page
    main_button = createButton('Main');
    main_button.class('toggleButton');
    main_button.position(1400, 660);
    // call main() when the button is pressed
    main_button.mousePressed(main);
}

function draw() {
    background(220, 252, 245);
    // Page Title
    stroke(30, 143, 211);
    strokeWeight(3);
    fill(64, 211, 182)
    textFont('Fjalla One');
    textSize(40);
    textAlign(CENTER);
    text('Image Processing Application - Extension', width / 2, 50);

    // Draw contol box for buttons
    drawControlBox();

    // Filter drawing functions
    drawExtensionGrids();

    // Photobooth drawing functions
    handleCountdown();
    displayStrip();

    // Instructions Box
    fill(255, 255, 255, 100);
    noStroke();
    rect(1180, 0, 350, 140, 10);

    // Instructions Title
    fill(0,255, 85);
    noStroke();
    textSize(20);
    text("Instructions", 1300, 20);

    // Instructions Text
    fill(0);
    noStroke();
    textSize(15);
    textAlign(LEFT, LEFT);
    
    let instructions =
    "- Click the 'Camera' icon for photobooth shots.\n" +
    "- You can select filters in between the shot countdowns.\n" +
    "- Click the 'Download' icon to download the photo strip.\n" +
    "- Re-click the 'Camera' icon for new shots.\n";
    
    text(instructions, 1190, 60);
}

function drawControlBox() {
    let boxX = 80;
    let boxY = 620;
    let boxW = 160;
    let boxH = 70;

    //Draw box background
    fill(240);
    stroke(150);
    strokeWeight(2);
    rect(boxX, boxY, boxW, boxH);
}

function mousePressed() {
    let extensionFrameCount = 0;


    for (var row = 0; row < 3; row++) {
        for (var i = 0; i < 3; i++) {
            // Frame properties
            let x = 350 + i * 300;
            let y = 150 + row * 180;
            let w = 250;
            let h = 150;

            if (
                mouseX > x && mouseX < x + w &&
                mouseY > y && mouseY < y + h
            ) {
                selectedFilter = extensionFrameCount;
            }

            extensionFrameCount++;
        }
    }
}

function startPhotobooth() {
    savedPhotos = [];
    stripImage = null;
    countdown = 3;
    counting = true;
}

function getFilteredImage() {
    switch (selectedFilter) {
        case 0: return x_ray();
        case 1: return solarize();
        case 2: return falseChannel();
        case 3:
            let img = sketch();
            pencilStrokes();
            return img;
        case 4: return vintage();
        case 5: return mosaic();
        case 6: return fisheye(1.3);
        case 7: return kaleidoscope(12);
        case 8: return reflection();
        default: return ext_capture.get();
    }
}

function handleCountdown() {
    if (!counting) return;

    fill(255, 0, 0);
    textSize(150);
    textAlign(CENTER, CENTER);
    text(countdown, width / 2, height / 2);

    let now = millis();

    // Decrease countdown every 1000 ms
    if (now - lastTick > 1000) {
        lastTick = now;

        if (countdown > 1) {
            countdown--;
        }
        else {
            // Only flash if this is not the last photo
            if (savedPhotos.length < photosToTake - 1) {
                // Start flash (lasts 5 frames at ~0.1s at 60FPS)
                flashFrames = 5;
            }

            // Take photo
            let filtered = getFilteredImage();
            savedPhotos.push(filtered);

            if (savedPhotos.length >= photosToTake) {
                counting = false;
                createPhotoStrip();
            }
            else {
                // Restart countdown for the next shot
                countdown = 3;
            }
        }
    }

    // Draw flash if active
    if (flashFrames > 0) {
        // Flash effect
        background(255);
        flashFrames--;
    }
}

function createPhotoStrip() {
    let w = 200;
    let h = 150;

    stripImage = createGraphics(w, h * photosToTake);

    for (var i = 0; i < savedPhotos.length; i++) {
        stripImage.image(savedPhotos[i], 0, i * h, w, h);
    }
}

function displayStrip() {
    if (stripImage) {
        // Original box coordinates to center the strip above the box
        let boxX = 80;
        let boxY = 620;
        let boxW = 160;
        let boxH = 70;

        // Calculate x to center the strip above the box
        let x = boxX + (boxW - stripImage.width) / 2;
        // Calculate y position to place the strip above the box with a small margin
        let y = boxY - stripImage.height - 10;

        image(stripImage, x, y);
    }
}

function downloadStrip() {
    if (!stripImage) return;

    // Space between images
    let margin = 20;
    // Width of each photo
    let photoWidth = 300;
    // Height of each photo
    let photoHeight = 250;
    // Total height with margins
    let totalHeight = savedPhotos.length * (photoHeight + margin) - margin;

    // Load a strip background
    let bg = createGraphics(photoWidth + 100, totalHeight + 100);

    // Upload a background image
    //bg.background(200, 230, 255);
    bg.image(bgImage, 0, 0, bg.width, bg.height);

    // Draw the photo strip with margin
    for (var i = 0; i < savedPhotos.length; i++) {
        let y = 50 + i * (photoHeight + margin);
        bg.image(savedPhotos[i], 50, y, photoWidth, photoHeight);
    }

    // Save combined image
    save(bg, 'my_photostrip.png');
}

// Function that handles the page redirection back to the main page
function main() {
    window.location.href = 'index.html';
}