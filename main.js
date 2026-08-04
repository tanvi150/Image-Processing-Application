/*
Commentary:

The application I have developed is an Image Processing Tool that combines multiple functionalities 
to provide an engaging and interactive user experience. At its core, the app allows users to 
experiment with visual effects and filters, explore dynamic thresholding, and real-time face
detection and replacement. It also features a unique photobooth extension that goes beyond 
traditional implementations, offering users creative control over their captured images.

The main interface of the application displays 14 grids, each representing a different filtered 
version of the input image or video feed. These grids provide immediate visual feedback, allowing
users to explore the effect of each filter before applying it, by pressing 'S' to take a snapshot 
or 'U' to upload an image. To further enhance user control,
the app incorporates dynamic threshold sliders. These sliders allow the manipulation of different
colour channels, as well as more complex colour spaces like CIELAB and YCbCr. Each slider is 
initialised to a default value, providing a baseline for experimentation, while users adjust
values in real time to change processed images. This functionality offers an 
educational insight into how pixel-level manipulation affects overall image composition and contrast.

A particularly engaging feature of the application is its face detection and replacement system. 
Using ml5.js for face detection, the app identifies faces within the video feed and maps bounding
boxes to the detected regions. Users can then replace these faces with alternative visual effects,
including a greyscale version, a horizontally flipped image or a pixelated rendition. These effects
can be toggled interactively using keyboard shortcuts: pressing '1' applies the greyscale 
replacement, '2' triggers horizontal flip, '3' activates the pixellation effect and '0' restores
the original detected faces without modification.

The application also includes a photobooth extension, which distinguishes this project
from standard image processing tools. This extension features 9 grid filters, allowing users to 
select a filter for each shot before capturing the image. Unlike conventional photobooths, which
typically apply a single filter to all photos in a strip, this functionality permits users to vary  
the filter for each individual photo. The photobooth sequence is initiated using a camera icon , 
which triggers a countdown and a flash effect, providing an authentic photobooth experience. Users
can preview their captured images in a vertical strip and choose to retake shots again if they are
unsatisfied. Once the sequence is complete, the app generates a downloadable strip that combines
all the images with a decorative background, providing a polished final product ready for sharing
or printing.

Throughout the development process, several challenges were encountered. One significant difficulty
was achieving accurate face detection and replacement, especially due to limited documentation on
ml5.js. Connecting the library to the video feed and correctly mapping bounding boxes required 
careful experimentation and adaption of existing examples. Despite these challenges, I successfully
implemented the required features and completed the project two weeks ahead of schedule.

In conclusion, this application combines dynamic image processing, interactive face detection, and
a customisable photobooth functionality into a creative and technically strong tool.
*/


// Global variables
var capture;
var snapshot;
var imageUpload;
// Store uploaded images
let images = [];

// Variables for face detection
var faceMesh;
// Customise FaceMesh model behaviour
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
// Store detected faces in an array
let faces = [];
// Greyscale, flipped image and pixelated image FaceMesh
let isGreyFace = false;
let isFlipped = false;
let isPixelatedFace = false;

// Label names for each grid
const frameLabels = {
    0: "Webcam Image",
    1: "Greyscale",
    2: "Red Channel",
    3: "Green Channel",
    4: "Blue Channel",
    5: "Red Threshold",
    6: "Green Threshold",
    7: "Blue Threshold",
    8: "Webcam Image (Repeated)",
    9: "CIEL*a*b",
    10: "YCbCr",
    11: "Face Detection",
    12: "La*b*(L) Threshold",
    13: "YCbCr(Y) Threshold"
}

function preload() {
    flowerImg = loadImage("assets/flower.png");
    borderImg = loadImage("assets/border.png");

    // Load the FaceMesh model
    faceMesh = ml5.faceMesh(options);
}

function setup() {
    createCanvas(1550, 700);
    background(232, 245, 252);

    // Initialise webcam
    capture = createCapture(VIDEO);
    // Scale image to 160 x 120
    capture.size(160, 120);
    // Prevents the webcam from showing outside the grid
    capture.hide();

    // ---------- FACE MESH DETECTION ----------
    if (capture) {
        faceMesh.detectStart(capture, gotFaces);
    }

    // ---------- FILE UPLOAD -----------
    // Hidden file input, no visible UI
    imageUpload = createFileInput(uploadImage, true);
    imageUpload.hide();

    // ---------- FILTER SLIDERS -----------
    // Create RGB Colour Channel sliders
    r_slider = createSlider(0, 255, 128);
    r_slider.position(600, height / 2);
    r_slider.size(180);

    g_slider = createSlider(0, 255, 128);
    g_slider.position(800, height / 2);
    g_slider.size(180);

    b_slider = createSlider(0, 255, 128);
    b_slider.position(1000, height / 2);
    b_slider.size(180);

    // Create CIELAB Slider
    colourspace1_slider = createSlider(0, 255, 180);
    colourspace1_slider.position(600, height / 2 + 270);
    colourspace1_slider.size(180);

    // Create YCbCr Slider
    colourspace2_slider = createSlider(0, 255, 128);
    colourspace2_slider.position(800, height / 2 + 270);
    colourspace2_slider.size(180);

    // ---------- EXTENSION BUTTON ----------
    // Create a button that redirects to the extensions page
    ext_button = createButton('Extension');
    ext_button.class('extensionButton');
    ext_button.position(1400, 660);
    // call redirect() when the button is pressed
    ext_button.mousePressed(redirect);
}

function draw() {
    background(232, 245, 252);

    // Function that handles the image frames and webcam
    drawGrids();

    // Coursework Title
    stroke(30, 143, 211);
    strokeWeight(3);
    fill(64, 211, 182)
    textFont('Fjalla One');
    textSize(40);
    textAlign(CENTER);
    text('Image Processing Application', width / 2, 50);

    // Labels for RGB Threshold Sliders
    fill(0);
    noStroke();
    textSize(15);
    text("Red Threshold: " + r_slider.value(), 655, height / 2 - 10);
    text("Green Threshold: " + g_slider.value(), 860, height / 2 - 10);
    text("Blue Threshold: " + b_slider.value(), 1060, height / 2 - 10);

    // Labels for Colourspace Threshold SLiders
    text("CIELAB (L) Threshold: " + colourspace1_slider.value(), 675, height / 2 + 265);
    text("YCbCr (Y) Threshold: " + colourspace2_slider.value(), 870, height / 2 + 265);

    // Instructions Box
    fill(255, 255, 255, 100);
    noStroke();
    rect(1180, 0, 350, 180, 10);

    // Instructions Title
    fill(0,0,255);
    noStroke();
    textSize(20);
    text("Instructions", 1350, 20);

    // Instructions Text
    fill(0);
    noStroke();
    textSize(15);
    textAlign(LEFT, LEFT);
    
    let instructions =
    "- Press 'S' for a buffer snapshot.\n" +
    "- Press 'U' to upload an image into the grids.\n" +
    "- Press '1' for Greyscale filter in Face Detection Grid.\n" +
    "- Press '2' for Horizontal Flip filter in Face Detection Grid.\n" +
    "- Press '3' for Pixelated filter in Face Detection Grid.\n" +
    "- Press '0' for default Face Detection Grid.\n";
    
    text(instructions, 1190, 60);

}

function keyPressed() {
    // If key pressed is 's'
    if (keyCode === 83) {
        // Take a snapshot image and store in buffer
        snapshot = capture.get();
        console.log("Snapshot taken!");
    }

    // If key pressed is 'u'
    if (keyCode === 85) {
        // file upload appears
        imageUpload.elt.click();
    }

    // If key pressed is '0'
    if (keyCode === 48) {
        // turn off the grid 11 effects
        isGreyFace = false;
        isFlipped = false;
        isPixelatedFace = false;
    }

    // If key pressed is '1'
    if (keyCode === 49) {
        // greyscale effect in grid 11
        if (!isGreyFace) {
            isGreyFace = true;
            isFlipped = false;
            isPixelatedFace = false;
        }
    }

    // If key pressed is '2'
    if (keyCode === 50) {
        // flipped image effect in grid 11
        if (!isFlipped) {
            isGreyFace = false;
            isFlipped = true;
            isPixelatedFace = false;
        }
    }

    // If key pressed is '3'
    if (keyCode === 51) {
        // pixelated effect in grid 11
        if (!isPixelatedFace) {
            isGreyFace = false;
            isFlipped = false;
            isPixelatedFace = true;
        }
    }
}

// Function that handles the image upload into the frames
function uploadImage(file) {
    if (file.type === 'image') {
        loadImage(file.data, img => {
            // Load pixels
            img.loadPixels();
            // Stores the uploaded image to the images array
            images.push(img);
            console.log("Image uploaded & loaded!");

            if (capture) {
                // Stop webcam capture if an image is uploaded
                capture.remove();
                capture = null;
                console.log("Webcam turned off!");
            }
        });
    }
}

// Callback function when the model detects faces
function gotFaces(results) {
    // Save the output to the faces variable
    faces = results;
    if (capture) faceMesh.detectStart(capture, gotFaces);
}

// Callback function that handles the page redirection to the extensions
function redirect() {
    window.location.href = 'extension.html';
}