// variables && Objects
const playButton = document.getElementById("play");
const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
let rightArrow = false;
let leftArrow = false;
const bricks = [];
const constant = 2;
const startShowDiv = document.getElementById("startshow");
//score counter
let counter = 0;

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
  r: slider.height / 1.5,
  x: canvas.width / 2,
  y: slider.y - slider.height / 2,
  dx: -2,
  dy: -2,
  originaldx: -2,
  originaldy: -2,
};
let ballMoveinit = false;
//bricks
let brick = {};
let availableBricksColors = ["green", "blue", "red", "orange"];
//making twoDimensionsArrayOfBricksObjects
let twoDimensionsArrayOfBricksObjects = [];
for (var index = 0; index < 4; index++) {
  twoDimensionsArrayOfBricksObjects[index] = [];
  for (var bc = 0; bc < 11; bc++) {
    twoDimensionsArrayOfBricksObjects[index][bc] = {
      x: null,
      y: null,
      status: 0,
    };
  }
}

/////////////////////////////////////////////////////////////
// Event Listener

playButton.addEventListener("click",startShow);

////////////////////////////////////////////////////////////////
// Functions

//StartShowFunction

function startShow () {
  playButton.removeEventListener("click",startShow);
  setTimeout(ready,2000)
};
const myTimeout2 = ()=> {setTimeout(steady, 2000)};
const myTimeout1 = ()=> {setTimeout(go, 2000)};

function ready() {
  startShowDiv.textContent = "Ready!";
  myTimeout2();
}

function steady() {
  startShowDiv.textContent = "Steady!";
  myTimeout1();
}

function go() {
  startShowDiv.innerHTML = "Go!";
  handler1();

}

//StartShowFunction

function handler1() {
  startShowDiv.style.display = "none";

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

function gameLoop() {
  drawGame();
  updateScreen();
  if (mouseFlag == 1) {
    leftArrow = false;
    rightArrow = false;
  }
  if (counter == 88) {
    //get out of the gameLoop
    cancelAnimationFrame(gameLoop);
    // alert(`YOU WIN, YOUR SCORE IS ${counter}`);
    //show image
    document.getElementById("win").style.display = "block";
    setTimeout(() => {
      document.location.reload();
      clearInterval(interval);
    }, 5000);
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
  ctx.fillStyle = "rgb(230, 230, 218)";
  ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
  ctx.lineWidth = "1";
  ctx.strokeStyle = "";
  ctx.rect(slider.x, slider.y, slider.width, slider.height);
  //make it appear as not cracked
  ctx.setLineDash([0]);
  ctx.stroke();
}

function drawBall() {
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "black";
  // ctx.fillStyle = "rgb(74, 16, 49)";
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
  // ctx.fill();
  //make it appear as not cracked
  ctx.setLineDash([0]);
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
  //choosing colors for bricks
  availableBricksColors.forEach((color, index) => {
    //every time the x is const and y is variable in the big loop
    bricks.y = bricks.y + bricks.dY;
    //restoring x position of the line to it's original position after each loop
    bricks.x = bricks.xOriginal;
    ctx.fillStyle = color;
    //drawing a 11 bricks for each of every 4 lines
    for (let bc = 0; bc < 11; bc++) {
      // 0 means it was not hit by the ball
      // 1 means it was hit by the ball 1 time
      // 2 means it was hit by the ball 2 times
      //add a check if the brick status is 0 then draw it normally
      if (twoDimensionsArrayOfBricksObjects[index][bc].status == 0) {
        //every time the y is const and x is variable in the small loop
        ctx.beginPath();
        //adding a width of bricks
        bricks.x = bricks.x + bricks.dX;
        ctx.rect(bricks.x, bricks.y, bricks.width, bricks.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        //make it appear as not cracked
        ctx.setLineDash([0]);
        ctx.stroke();
        ctx.closePath();
        //holding bricks in a twoDimensionsArrayOfBricksObjects
        twoDimensionsArrayOfBricksObjects[index][bc] = {
          x: bricks.x,
          y: bricks.y,
          status: 0,
        };
      }
      // 0 means it was not hit by the ball
      // 1 means it was hit by the ball 1 time
      // 2 means it was hit by the ball 2 times
      //add a check if the brick status is 1 then draw it with a crack
      if (twoDimensionsArrayOfBricksObjects[index][bc].status == 1) {
        //every time the y is const and x is variable in the small loop
        ctx.beginPath();
        //adding a width of bricks
        bricks.x = bricks.x + bricks.dX;
        ctx.rect(bricks.x, bricks.y, bricks.width, bricks.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        //make it appear as cracked
        ctx.setLineDash([7]);
        ctx.stroke();
        ctx.closePath();
      }
      if (twoDimensionsArrayOfBricksObjects[index][bc].status == 2) {
        //every time the y is const and x is variable in the small loop
        ctx.beginPath();
        //adding a width of bricks
        bricks.x = bricks.x + bricks.dX;
        ctx.closePath();
      }
    }
  });
}

function updateScreen() {
  showCounter();
  moveSlider();
  moveBall();
  ballSliderCollision();
  ballWallCollision();
  ballBricksCollision();
}
function showCounter() {
  ctx.font = "12px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${counter}`, canvas.width / 12, canvas.height / 12);
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
    let seta = calSeta();
    ball.dx = constant * Math.sin(seta);
    ball.dy = -constant * Math.cos(seta);
  }
}

function calSeta() {
  let ratio =
    ((ball.x - (slider.x + slider.width / 2)) / (slider.width / 2)) * 1.047;
  return ratio;
}

function moveBall() {
  if (!ballMoveinit) {
    if (rightArrow) {
      ballMoveinit = true;
    } else if (leftArrow) {
      ballMoveinit = true;
      ball.dx = ball.dx * -1;
    }
  } else {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
}

function ballWallCollision() {
  if (ball.y >= canvas.height - ball.r) {
    ballMoveinit = false;
    ball.x = slider.x + slider.width / 2;
    ball.y = slider.y - slider.height / 2;
    ball.dx = ball.originaldx;
    ball.dy = ball.originaldy;
  } else {
    if (ball.x <= ball.r || ball.x >= canvas.width - ball.r) {
      ball.dx = ball.dx * -1;
    }
    if (ball.y <= ball.r) {
      ball.dy = ball.dy * -1;
    }
  }
}
function ballBricksCollision() {
  // loop through all the bricks and compare every single brick's position with the ball's coordinates

  for (let index = 0; index < 4; index++) {
    for (let bc = 0; bc < 11; bc++) {
      const b = twoDimensionsArrayOfBricksObjects[index][bc];
      // collision detection logic here
      // For the center of the ball to be inside the brick, all the following need to be true:
      // The x position of the ball is greater than the x position of the brick.
      // The x position of the ball is less than the x position of the brick plus its width.
      // The y position of the ball is greater than the y position of the brick.
      // The y position of the ball is less than the y position of the brick plus its height.
      if (
        ball.x > b.x &&
        ball.x < b.x + brick.width &&
        ball.y > b.y &&
        ball.y < b.y + brick.height &&
        b.status == 0
      ) {
        //bounce the ball back
        ball.dy = ball.dy * -1;
        //mark the brick as 1 time hit, so next time it will be drawn cracked
        b.status = 1;
        //add to score
        counter++;
      }
      //if it hit twice
      else if (
        ball.x > b.x &&
        ball.x < b.x + brick.width &&
        ball.y > b.y &&
        ball.y < b.y + brick.height &&
        b.status == 1
      ) {
        //bounce the ball back
        ball.dy = ball.dy * -1;
        //mark the brick as 2 time hit, so next time it will not be drawn
        b.status = 2;
        //add to score
        counter++;
        //endgame
      }
    }
  }
}
