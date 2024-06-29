const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const timeElement = document.querySelector(".time");
const impactSound = document.getElementById("impact-sound");
const soundControlButton = document.querySelector(".sound-control");

let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [[snakeX, snakeY]];
let velocityX = 0, velocityY = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let startTime;
let elapsedTime = 0;
let isGameOver = false;
let isSoundOn = true;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 40) + 1;
    foodY = Math.floor(Math.random() * 40) + 1;
}

const changeDirection = (newVelocityX, newVelocityY) => {
    if ((newVelocityX !== 0 && newVelocityX !== -velocityX) ||
        (newVelocityY !== 0 && newVelocityY !== -velocityY)) {
        velocityX = newVelocityX;
        velocityY = newVelocityY;
    }
}

const updateScore = () => {
    score++;
    scoreElement.innerText = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
}

const updateTime = () => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timeElement.innerText = `Time: ${elapsedTime}s`;
}

const checkGameOver = () => {
    if (snakeX < 1 || snakeX > 40 || snakeY < 1 || snakeY > 40) {
        isGameOver = true;
    }
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            isGameOver = true;
        }
    }
}

const toggleSound = () => {
    if (isSoundOn) {
        impactSound.pause();
        isSoundOn = false;
        soundControlButton.innerText = "Sound ON";
    } else {
        impactSound.play();
        isSoundOn = true;
        soundControlButton.innerText = "Sound OFF";
    }
}

const initGame = () => {
    if (isGameOver) {
        clearInterval(gameInterval);
        alert("Game Over! Press OK to restart.");
        location.reload();
        return;
    }

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    snakeX += velocityX;
    snakeY += velocityY;

    checkGameOver();

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        updateScore();
        if (isSoundOn) {
            impactSound.play();
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }

    playBoard.innerHTML = htmlMarkup;
    updateTime();
}

const startGame = () => {
    changeFoodPosition();
    highScoreElement.innerText = `High Score: ${highScore}`;
    startTime = Date.now();
    gameInterval = setInterval(initGame, 125);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        changeDirection(0, -1);
    } else if (e.key === "ArrowDown") {
        changeDirection(0, 1);
    } else if (e.key === "ArrowLeft") {
        changeDirection(-1, 0);
    } else if (e.key === "ArrowRight") {
        changeDirection(1, 0);
    }
});

document.querySelector(".up").addEventListener("click", () => changeDirection(0, -1));
document.querySelector(".down").addEventListener("click", () => changeDirection(0, 1));
document.querySelector(".left").addEventListener("click", () => changeDirection(-1, 0));
document.querySelector(".right").addEventListener("click", () => changeDirection(1, 0));

soundControlButton.addEventListener("click", toggleSound);

window.onload = startGame;