// variables && Objects
const playButton = document.getElementById("play");
const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
let rightArrow = false;
let leftArrow = false;
let availableBricksColors = ["green", "blue", "red", "orange"];
const bricks = [];
// Ball object here
let oldX,
  mouseFlag = 0;
let slider = {
  width: canvas.width / 3,
  height: canvas.width / 39,
  x: canvas.width / 3,
  y: canvas.height * 0.92,
  dx: 3,
};
let ball = {
  r: slider.height / 2,
  x: canvas.width / 2,
  y: slider.y - slider.height / 2,
  dx: 3,
  dy: 1,
};
//bricks
let brick = {};
let twoDimensionsArrayOfBricksObjects = [];
/////////////////////////////////////////////////////////////
// Event Listener

playButton.addEventListener("click", handler1);

////////////////////////////////////////////////////////////////
// Functions
function handler1() {
  addEventListener("keydown", handler2);
  addEventListener("keyup", handler3);
  //   addEventListener("mousemove", handler4);
  // startShow();
  setTimeout(gameLoop, 1000);
}

function handler2(event) {
  if (event.keyCode == 37) {
    leftArrow = true;
    mouseFlag = 0;
  } else if (event.keyCode == 39) {
    rightArrow = true;
    mouseFlag = 0;
  }
}

function handler3(event) {
  slider.dx = 3;
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
}

function handler4(event) {
  slider.dx = 4;
  if (mouseFlag == 1) {
    if (oldX > event.screenX) {
      leftArrow = true;
      rightArrow = false;
      oldX = event.screenX;
    } else if (oldX < event.screenX) {
      rightArrow = true;
      leftArrow = false;
      oldX = event.screenX;
    }
  } else {
    oldX = event.screenX;
    mouseFlag = 1;
  }
}

function startShow() {}

function gameLoop() {
  drawGame();
  updateScreen();
  if (mouseFlag == 1) {
    leftArrow = false;
    rightArrow = false;
  }
  requestAnimationFrame(gameLoop);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSlider();
  drawBall();
  drawBricks();
}

function drawSlider() {
  ctx.beginPath();
  ctx.fillStyle = "rgb(74, 16, 49)";
  ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawBricks() {
  let bricks = {
    x: canvas.width / 15,
    xOriginal: canvas.width / 15,
    y: canvas.height / 500,
    width: canvas.width / 15,
    height: canvas.height / 15,
    dY: canvas.height / 10,
    dX: canvas.width / 15,
  };
  //closuring so we can access it later
  brick = bricks;
  //choosing colors
  availableBricksColors.forEach((color, index) => {
    //every time the x is const and y is variable in the big loop
    bricks.y = bricks.y + bricks.dY;
    //restoring x position of the line to it's original position after each loop
    bricks.x = bricks.xOriginal;
    ctx.fillStyle = color;
    //holding bricks in a twoDimensionsArrayOfBricksObjects
    twoDimensionsArrayOfBricksObjects[index] = [];
    //drawing a 11 bricks for each of every 4 lines
    for (let bc = 0; bc < 11; bc++) {
      //every time the y is const and x is variable in the small loop
      ctx.beginPath();
      //adding a width of bricks
      bricks.x = bricks.x + bricks.dX;
      ctx.rect(bricks.x, bricks.y, bricks.width, bricks.height);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.closePath();
      //holding bricks in a twoDimensionsArrayOfBricksObjects
      twoDimensionsArrayOfBricksObjects[index][bc] = {
        x: bricks.x,
        y: bricks.y,
      };
    }
  });
}

function updateScreen() {
  moveSlider();
  ballSliderCollision();
  ballWallCollision();
  //ballBricksCollision();
  moveBall(); // move up down left right straight
}
function moveSlider() {
  if (rightArrow && slider.x < canvas.width - slider.width - 5) {
    slider.x += slider.dx;
  }
  if (leftArrow && slider.x > 5) {
    slider.x -= slider.dx;
  }
}

function ballSliderCollision() {
  if (
    ball.y + ball.r >= slider.y &&
    ball.x >= slider.x &&
    ball.x <= slider.x + slider.width
  ) {
    ball.dx = 1;
    ball.dy = 3;
    let ratio = calSeta();
    if (ratio >= 0 && ratio < 0.2) {
      ball.dy = -ball.dy / 3;
      ball.dx = -ball.dx;
    } else if (ratio >= 0.2 && ratio < 0.4) {
      ball.dx = -ball.dx / 1.5;
      ball.dy = -ball.dy / 2;
    } else if (ratio >= 0.4 && ratio < 0.6) {
      ball.dx = 0;
      ball.dy = -3;
    } else if (ratio >= 0.6 && ratio < 0.8) {
      ball.dx = ball.dx / 1.5;
      ball.dy = -ball.dy;
    } else if (ratio >= 0.8 && ratio <= 1) {
      ball.dy = -ball.dy / 3;
    }
  }
}

function calSeta() {
  let ratio = ((slider.x - ball.x) / slider.width) * 100;
  return ratio;
}

function moveBall() {
  console.log(ball.x);
  console.log(ball.y);
  ball.x += ball.dx;
  ball.y -= ball.dy;
}

function ballWallCollision() {
  console.log(ball.x);
  console.log(ball.y);
  if (ball.y >= canvas.height - ball.width) {
    ball.x = canvas.width / 2;
    ball.y = slider.y - slider.height / 2;
    ball.dx = 3;
    ball.dy = 1;
  } else {
    if (ball.x <= ball.r || ball.x >= canvas.width - ball.r) {
      ball.dx = (ball.dx * -1);
    }
    if (ball.y <= ball.r) {
      ball.dy = (ball.dy * -1);
    }
  }
}
function ballBricksCollision() {
  // loop through all the bricks and compare every single brick's position with the ball's coordinates
  availableBricksColors.forEach((index) => {
    for (let bc = 0; bc < 11; bc++) {
      const b = twoDimensionsArrayOfBricksObjects[index][bc];
      // collision detection logic here
    }
  });
}
