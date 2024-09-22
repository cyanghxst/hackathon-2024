let backgroundImage = new Image();
backgroundImage.src = "./images/shootinggallery.png";

const $ = id => document.getElementById(id);
const ctx = $("myCanvas").getContext("2d");

const shrinkingAnimation = [
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

// Click counter
let clickCounter = 0;
let clickHit = 0;

// Ammo
let ammoCount = 5; // Set the initial ammo count

// Load the shrinking animation frames
shrinkingAnimation[0].src = "./images/duck_animation1.png";
shrinkingAnimation[1].src = "./images/duck_animation2.png";
shrinkingAnimation[2].src = "./images/duck_animation3.png";
shrinkingAnimation[3].src = "./images/duck_animation4.png";

const targetImages = [
    new Image(),
    new Image(),
    new Image()
];

// Load the normal duck images for targets
targetImages[0].src = "./images/duck.png";
targetImages[1].src = "./images/duck.png";
targetImages[2].src = "./images/duck.png";

$("myCanvas").addEventListener("mousemove", getCoordinates);
$("myCanvas").addEventListener("click", shoot);

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

let targets = [
    { x: 612, y: 110, radius: 100, z: 1, color: "red", speed: 2, direction: 1, hit: false, animationDone: false, currentFrame: 0 },
    { x: 612, y: 250, radius: 100, z: 1, color: "blue", speed: 3, direction: 1, hit: false, animationDone: false, currentFrame: 0 },
    { x: 612, y: 380, radius: 100, z: 1, color: "green", speed: 4, direction: 1, hit: false, animationDone: false, currentFrame: 0 },
];

// Function to initialize the game
function initializeGame() {
    drawCircle(); // Call drawCircle after targets are initialized
}

function displayStats() {
    let accuracy = clickHit / clickCounter * 100;

    ctx.font = "20px Helvetica";
    ctx.fillStyle = "white";
    ctx.fillText(`Hits: ${clickHit}`, 5, 650);
    ctx.fillText(`Clicks: ${clickCounter}`, 5, 680);
    ctx.fillText(`Ammo: ${ammoCount}`, 5, 710); // Display ammo count
    // ctx.fillText(`Accuracy: ${accuracy}%`, 5, 710); // Display ammo count

    // Display error message if ammo runs out
    if (ammoCount <= 0) {
        ctx.font = "20px Helvetica";
        ctx.fillStyle = "red";
        ctx.fillText("Out of Ammo!", width / 2 - 50, height / 2); // Center the error message
    }

    if (clickHit == 3) {
        ctx.font = "20px Helvetica";
        ctx.fillStyle = "white";
        ctx.fillText(`Accuracy: ${accuracy}%`, width / 2 - 50, height / 2 + 30); // Center the error message
    }
}

function drawCircle() {
    ctx.clearRect(0, 0, width, height);

    // Draw background image
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    // Move targets horizontally and draw them as images
    targets.forEach((target, index) => {
        if (!target.hit) {
            // Update target's position based on its speed and direction
            target.x += target.speed * target.direction;

            // Reverse direction if the target hits the canvas boundaries
            if (target.x - target.radius < 300 || target.x + target.radius > width - 300) {
                target.direction *= -1;
            }

            // Draw the normal target image
            const img = targetImages[index]; // Get the corresponding image
            const scale = 1 / target.z;
            ctx.drawImage(img, target.x - (target.radius * scale) / 2, target.y - (target.radius * scale) / 2, target.radius * scale, target.radius * scale);

        } else if (!target.animationDone) {
            // Animate the shrinking and fading of hit targets
            const img = shrinkingAnimation[target.currentFrame]; // Get current shrinking frame image
            const scale = 1 / target.z;

            ctx.drawImage(
                img,
                target.x - (target.radius * scale) / 2,
                target.y - (target.radius * scale) / 2,
                target.radius * scale,
                target.radius * scale
            );

            target.currentFrame++; // Move to next frame

            // Check if the animation has finished
            if (target.currentFrame >= shrinkingAnimation.length) {
                target.animationDone = true; // Animation is done
            }
        }
        // Remove the target after animation is done
        if (target.animationDone) {
            targets.splice(index, 1);
        }
    });

    // Draw player circle
    const playerWidth = myCircle.radius * 2;
    const playerHeight = myCircle.radius * 2;
    ctx.drawImage(myCircle.crosshair, myCircle.x - myCircle.radius, myCircle.y - myCircle.radius, playerWidth, playerHeight);

    displayStats(); // Update stats on the canvas
    requestAnimationFrame(drawCircle); // Keep the animation loop going
}

let imagesLoaded = 0;

targetImages.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === targetImages.length) {
            initializeGame(); // Start the game only when all images are loaded
        }
    };
    img.src = img.src; // Start loading the image
});

function getCoordinates(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    myCircle.x = x;
    myCircle.y = y;
}

function shoot(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Only shoot if ammo is available
    if (ammoCount > 0) {
        clickCounter++;
        ammoCount--; // Decrement ammo count

        targets.forEach((target, index) => {
            const scale = 1 / target.z;
            if (Math.hypot(mouseX - target.x, mouseY - target.y) < target.radius * scale) {
                console.log("Hit target!", target);
                clickHit++;
                target.hit = true;
                target.currentFrame = 0; // Start the shrinking animation from the first frame
            }
        });
    } else {
        console.log("Out of ammo!");
    }
}
