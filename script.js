const $ = id => document.getElementById(id);
const ctx = $("myCanvas").getContext("2d");

$("myCanvas").addEventListener("mousemove", getCoordinates);
document.addEventListener("keydown", changeRadius);
window.addEventListener("load", drawCircle);

const width = ctx.width;
const height = ctx.height;

let myCircle = {
    x: 200,
    y: 200,
    radius: 10,
    color: "black",
}

function drawCircle() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(myCircle.x, myCircle.y, myCircle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = myCircle.color;
    ctx.fill();
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
