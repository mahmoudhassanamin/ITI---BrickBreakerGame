// variables && Objects
const playButton = document.getElementById("play");
const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
let rightArrow = false;
let leftArrow = false;
// Ball object here

let slider = {
  width: canvas.width / 3,
  height: canvas.width/39,
  x: canvas.width / 3,
  y: canvas.height * 0.92,
  dx: 3,
};
let ball = {
    r: (slider.height/2),
    x: (canvas.width/2),
    y: (slider.y)-(slider.height/2),
    dx: 3,
    dy: 3,
};

/////////////////////////////////////////////////////////////
// Event Listener

playButton.addEventListener("click", handler1);

////////////////////////////////////////////////////////////////
// Functions
function handler1() {
  addEventListener("keydown", handler2);
  addEventListener("keyup", handler3);
  // startShow();
  gameLoop();
  //   setTimeout(gameLoop, 1000);
}

function handler2(event) {
  if (event.keyCode == 37) {
    leftArrow = true;
    console.log("leftArrow ", leftArrow);
  } else if (event.keyCode == 39) {
    rightArrow = true;
    console.log("rightArrow ", rightArrow);
  }
}

function handler3(event) {
  if (event.keyCode == 37) {
    leftArrow = false;
    console.log("leftArrow ", leftArrow);
  } else if (event.keyCode == 39) {
    rightArrow = false;
    console.log("rightArrow ", rightArrow);
  }
}

function startShow() {}

function gameLoop() {
  drawGame();
  updateScreen();
  requestAnimationFrame(gameLoop);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSlider();
  // drawBall();
  drawBricks();
}

function drawSlider() {
  ctx.beginPath();
  ctx.fillStyle = "rgb(74, 16, 49)";
  ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
}

function drawBall() {}

function drawBricks() {
  //bricks object
  let bricks = {
    x: canvas.width / 15,
    xOriginal: canvas.width / 15,
    y: canvas.height / 10,
    width: canvas.width / 15,
    height: canvas.height / 15,
    dY: canvas.height / 10,
    dX: canvas.width / 15,
  };
  //choosing colors
  let availableBricksColors = ["green", "blue", "red", "orange"];
  availableBricksColors.forEach((color) => {
    //every time the x is const and y is variable in the big loop
    bricks.y = bricks.y + bricks.dY;
    //restoring x position of the line to it's original position after each loop
    bricks.x = bricks.xOriginal;
    ctx.fillStyle = color;
    //drawing a 12 bricks for each of every 4 lines
    for (let bc = 0; bc < 11; bc++) {
      //every time the y is const and x is variable in the small loop
      ctx.beginPath();
      //padding between each brick and other
      bricks.x = bricks.x + bricks.dX;
      ctx.rect(bricks.x, bricks.y, bricks.width, bricks.height);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
  });
}

function updateScreen (){
    // sliderWallCollision();
    moveSlider();
    // ballSliderCollision();
    ballWallCollision();
    moveBall(); // move up down left right stright

}

function moveSlider() {
  if (rightArrow == true && slider.x < canvas.width - slider.width - 5) {
    slider.x += slider.dx;
  }
  if (leftArrow == true && slider.x > 5) {
    slider.x -= slider.dx;
  }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y -= ball.dy;
}

function ballWallCollision() {
    if(ball.y == (canvas.length-ball.width))
    {
            ball.x = (canvas.width-slider.height)/2;
            ball.y = (canvas.height*0.92)-slider.height;
            ball.dx = 3;
            ball.dy = -3;
    }else{
        if(ball.x == ball.r || ball.x == (canvas.width-ball.r)) {
            ball.dx = ball.dx * -1;
        }
        if(ball.y == ball.r) {
            ball.dy = ball.dy * -1;
        }
    }
}
