const $ = id => document.getElementById(id);
const ctx = $("myCanvas").getContext("2d");

$("myCanvas").addEventListener("mousemove", getCoordinates);
$("myCanvas").addEventListener("click", shoot);
document.addEventListener("keydown", changeRadius);
window.addEventListener("load", drawCircle);

const width = $("myCanvas").width;
const height = $("myCanvas").height;

let myCircle = {
    x: 200,
    y: 200,
    radius: 10,
    color: "black",
};

let targets = [
    { x: 400, y: 300, radius: 30, z: 1, color: "red" },
    { x: 600, y: 400, radius: 40, z: 2, color: "blue" },
    { x: 800, y: 200, radius: 50, z: 3, color: "green" },
];

function drawCircle() {
    ctx.clearRect(0, 0, width, height);

    // Draw player circle
    ctx.beginPath();
    ctx.arc(myCircle.x, myCircle.y, myCircle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = myCircle.color;
    ctx.fill();

    // Draw targets
    targets.forEach(target => {
        const scale = 1 / target.z;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius * scale, 0, 2 * Math.PI);
        ctx.fillStyle = target.color;
        ctx.fill();
    });
}

function getCoordinates(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    myCircle.x = x;
    myCircle.y = y;
    drawCircle();
}

function changeRadius(event) {
    if (event.key == "ArrowUp") {
        myCircle.radius++;
        drawCircle();
    }

    if (event.key == "ArrowDown") {
        myCircle.radius--;
        drawCircle();
    }
}

function shoot(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    targets.forEach((target, index) => {
        const scale = 1 / target.z;
        if (Math.hypot(mouseX - target.x, mouseY - target.y) < target.radius * scale) {
            console.log("Hit target!", target);
            targets.splice(index, 1); // Remove the target
            drawCircle();
        }
    });
}
