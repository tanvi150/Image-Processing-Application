# 📷 Interactive Image Processing & AI Photobooth Application

An interactive image processing application built with **p5.js** and **ml5.js** that allows users to explore real-time image manipulation, colour analysis, thresholding techniques, face detection, and creative photobooth effects.

The application combines traditional image processing methods with machine learning-based face detection to create an educational and engaging visual experimentation tool.

---

# 📌 Project Overview

This application provides users with multiple ways to analyse and transform images through:

- Real-time webcam processing
- Pixel-level image manipulation
- RGB colour channel extraction
- Dynamic threshold adjustment
- CIELAB and YCbCr colour space processing
- AI-powered face detection
- Interactive face replacement effects
- Customisable photobooth experience

The main interface displays **14 processing grids**, allowing users to compare different image transformations simultaneously.

---

# ✨ Features

## 🖼️ Image Processing Grid System

The application displays multiple versions of the webcam feed or uploaded image:

| Grid | Processing Method |
|---|---|
| 0 | Original Webcam Image |
| 1 | Greyscale Conversion |
| 2 | Red Channel Extraction |
| 3 | Green Channel Extraction |
| 4 | Blue Channel Extraction |
| 5 | Red Channel Threshold |
| 6 | Green Channel Threshold |
| 7 | Blue Channel Threshold |
| 8 | Repeated Webcam Image |
| 9 | CIELAB Colour Space |
| 10 | YCbCr Colour Space |
| 11 | Face Detection & Replacement |
| 12 | CIELAB (L) Threshold |
| 13 | YCbCr (Y) Threshold |

Each grid provides immediate visual feedback, allowing users to understand how different image processing techniques affect image composition.

---

# 🎨 Dynamic Threshold Controls

The application includes interactive sliders for adjusting threshold values in real time.

Supported threshold systems:

## RGB Thresholding

Users can independently control:

- Red channel threshold
- Green channel threshold
- Blue channel threshold

This demonstrates how individual colour channels contribute to image structure and contrast.

---

## Advanced Colour Spaces

The application also supports threshold manipulation using:

### CIELAB Colour Space

Uses the luminance (**L**) channel to analyse brightness differences.

### YCbCr Colour Space

Uses the luminance (**Y**) component commonly used in digital image and video processing.

These features allow users to explore how alternative colour representations influence image segmentation.

---

# 🤖 AI Face Detection & Replacement

The application uses:

- **ml5.js FaceMesh**

to detect faces from the webcam feed.

Detected faces are identified through bounding regions and can be replaced with different visual effects.

## Face Effects

| Key | Effect |
|---|---|
| `0` | Restore original face |
| `1` | Greyscale face replacement |
| `2` | Horizontal flipped face |
| `3` | Pixelated face effect |

The face replacement system provides an interactive demonstration of combining machine learning with traditional image manipulation techniques.

---

# 📸 Photobooth Extension

The application includes a custom photobooth mode that expands beyond traditional implementations.

## Features

- 9 selectable image filters
- Individual filter selection for every photo
- Countdown before capture
- Camera flash animation
- Vertical photostrip preview
- Retake functionality
- Downloadable final photostrip

Unlike standard photobooths where one filter applies to the entire strip, this implementation allows every captured photo to have its own unique style.

Example:

```
Photo 1 → Greyscale
Photo 2 → Pixelated
Photo 3 → Colour Filter
Photo 4 → Threshold Effect
```

---

# 🎮 Controls

| Input | Action |
|---|---|
| `S` | Capture webcam snapshot |
| `U` | Upload an image |
| `0` | Reset face replacement |
| `1` | Apply greyscale face effect |
| `2` | Apply horizontal flip face effect |
| `3` | Apply pixelated face effect |

---

# 🛠️ Technologies Used

## Programming Languages

- JavaScript

## Libraries

### p5.js

Used for:

- Canvas rendering
- User interaction
- Image manipulation
- Webcam integration

### ml5.js

Used for:

- FaceMesh model
- Real-time face detection

---

# 🚀 Running the Project

## 1. Clone Repository

```bash
git clone <repository-url>
```

## 2. Open Project Folder

Navigate into the project directory.

## 3. Run Using Local Server

Recommended options:

- VS Code Live Server extension
- Any local HTTP server

A local server is recommended because webcam access and external libraries may be restricted when opening files directly.

---

# 🎨 Design Decisions

## Multiple Processing Views

Displaying 14 grids simultaneously allows users to compare image transformations instantly rather than applying filters individually.

This creates an interactive learning environment for understanding:

- Pixel manipulation
- Colour extraction
- Thresholding
- Colour space conversion

---

## Interactive Controls

Real-time sliders were implemented to allow users to directly observe how changing numerical thresholds affects image segmentation.

This creates a connection between mathematical image processing concepts and visible results.

---

## Combining AI and Traditional Processing

The face replacement feature combines:

- Machine learning-based detection
- Image transformation algorithms

This demonstrates how modern computer vision techniques can be integrated with conventional image processing.

---

## Photobooth Extension

The photobooth feature was designed as a creative extension beyond basic coursework requirements.

By allowing different filters for each captured image, users have greater artistic control and can create personalised photo strips.

---

# 🧩 Challenges & Solutions

## Face Detection Integration

One of the main challenges was integrating ml5.js FaceMesh with the webcam feed.

Problems included:

- Understanding limited documentation
- Mapping detected face regions correctly
- Applying transformations accurately

The final implementation successfully connects live face detection with multiple replacement effects.

---

# 👤 Author

Created as an interactive graphics and computer vision project.

---

# 📜 License

This project is intended for educational and demonstration purposes.
