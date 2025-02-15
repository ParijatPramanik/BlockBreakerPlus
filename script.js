const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

var w = window.innerWidth;
var h = window.innerHeight;

canvas.width = w;
canvas.height = h;

let ball = { x: canvas.width / 2, y: canvas.height - 30, radius: 10, dx: 2, dy: -2 };
let paddle = { width: 75, height: 10, x: (canvas.width - 75) / 2 };
let rightPressed = false, leftPressed = false;


let bricks = [], brickRowCount = 5, brickColumnCount = 9, brickWidth = Math.round(w/10), brickHeight = Math.round(h/10);
let score = 0;

// Create bricks
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: c * (brickWidth + 12) + 30, y: r * (brickHeight + 12) + 30, status: 1 };
    }
}

// Paddle movement
document.addEventListener("keydown", (e) => { 
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true; 
    if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true; 
});

document.addEventListener("keyup", (e) => { 
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false; 
    if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false; 
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
}

function drawBricks() {
    bricks.forEach(column => column.forEach(brick => {
        if (brick.status) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
        }
    }));
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function detectCollision() {
    bricks.forEach(column => column.forEach(brick => {
        if (brick.status && ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) {
            ball.dy = -ball.dy;
            brick.status = 0;
            score++;
        }
    }));
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    detectCollision();

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
    if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
    else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) ball.dy = -ball.dy;
        else document.location.reload();
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 7;
    if (leftPressed && paddle.x > 0) paddle.x -= 7;

    requestAnimationFrame(update);
}

update();
