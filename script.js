let backgroundImage = new Image();
backgroundImage.src = "./images/shootinggallery.png"; // Ensure the path is correct



const $ = id => document.getElementById(id);
const ctx = $("myCanvas").getContext("2d");


const targetImage = [];
const targetImages = [
    "./images/duck.png",
    "./images/duck.png",
    "./images/duck.png"
];

targetImages.forEach((path, index) => {
    const image = new Image();
    image.src = path;
    targetImages[index] = image;
});


$("myCanvas").addEventListener("mousemove", getCoordinates);
$("myCanvas").addEventListener("click", shoot);
document.addEventListener("keydown", changeRadius);

// Correct the initialization: call drawCircle only after the image loads
backgroundImage.onload = initializeGame;

const width = $("myCanvas").width;
const height = $("myCanvas").height;

let crosshair = new Image();
crosshair.src = "./images/crosshair2.0.png";

let myCircle = {
    x: 200,
    y: 200,
    radius: 20,
    crosshair: crosshair,

};

// let duckCount = 5;
// const duckFrames = [];
// let currentDuckFrame = 0;
// let duckAnimating = false; 

// for (let i = 0; i <= duckCount; i++) {
//     const duckImg = new Image();
//     duckImg.src = "./images/duck" + i + ".png";
//     duckFrames.push(duckImg);
// }

let targets = [
    { x: 612, y: 110, radius: 100, z: 1, color: "red" },
    { x: 612, y: 250, radius: 100, z: 1, color: "blue" },
    { x: 612, y: 380, radius: 100, z: 1, color: "green" },
];

// Function to initialize the game (you can populate targets randomly here)
function initializeGame() {
    drawCircle(); // Call drawCircle after targets are initialized
}

function drawCircle() {
    ctx.clearRect(0, 0, width, height);

    // Draw background image
    ctx.drawImage(backgroundImage, 0, 0, width, height); // Draw the background image

    // Draw targets as images
    targets.forEach((target, index) => {
        const scale = 1 / target.z;
        const img = targetImages[index]; // Get the corresponding image
        ctx.drawImage(img, target.x - (target.radius * scale) / 2, target.y - (target.radius * scale) / 2, target.radius * scale, target.radius * scale);
    });
    

    // Draw Crosshair circle
    const crosshairWidth = myCircle.radius * 3;
    const crosshairHeight = myCircle.radius * 3;
    ctx.drawImage(myCircle.crosshair, myCircle.x - myCircle.radius, myCircle.y - myCircle.radius, crosshairWidth, crosshairHeight);

    // // Activate duck Animation
     // If the duck animation is active, cycle through duck frames
    //  if (duckAnimating) {
    //     const duckFrame = duckFrames[currentDuckFrame];
    //     ctx.drawImage(duckFrame, 300, 200, 100, 100); // Example fixed duck position

    //     // Cycle through duck frames over time
    //     currentDuckFrame++;
    //     if (currentDuckFrame >= duckFrames.length) {
    //         currentDuckFrame = 0; // Reset to loop the animation
    //     }
    // }
   
    requestAnimationFrame(drawCircle);

    
}

let imagesLoaded = 0;
targetImages.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === targetImages.length) {
            initializeGame();
        }
    };
    img.src = img.src; // Start loading the image
});

// function strafe {

// }

function getCoordinates(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    myCircle.x = x;
    myCircle.y = y;
}

function changeRadius(event) {
    if (event.key === "ArrowUp") {
        myCircle.radius++;
        drawCircle();
    }

    if (event.key === "ArrowDown") {
        myCircle.radius--;
        drawCircle();
    }
}
let duckActivate;
function shoot(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    targets.forEach((target, index) => {
        const scale = 1 / target.z;
        if (Math.hypot(mouseX - target.x, mouseY - target.y) < target.radius * scale) {
            console.log("Hit target!", target);

            targets.splice(index, 1); // Remove the target
        }
    });
}
