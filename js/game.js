// variables && Objects
const playButton = document.getElementById("play");
const canvas = document.getElementById("cvs");
const stopbtn = document.getElementById("stop");

const ctx = canvas.getContext("2d");

let img=[document.getElementById("bre"),document.getElementById("bre2"),document.getElementById("bre3"),document.getElementById("bre4")]

let devpause = document.getElementById("pause");

let rightArrow = false;
let leftArrow = false;
const constant = 15;
let dX = 0 ,dY = 0;
const startShowDiv = document.getElementById("startshow");
class bricksClass{
  static width = 100;
  static height =50;
  constructor(dx,dy){
    this.x = 32+dx;
    this.y = 80+dy;
    this.status=0;
  }
}
//score counter
let counter = 0;

// Ball object here
let oldX,mouseFlag = 0;
let slider = {
  width: 945 , //200
  height: 30,
  x: 0, // 372.5
  y: canvas.height * 0.94,
  dx: 10,
};
const ball = {
  r: 10,
  x: canvas.width / 2,
  y: slider.y - 16,
  px: 0,
  py: 0,
  dx: 10,
  dy: -10,
  originaldx: 10,
  originaldy: 10,
};
console.log(ball.dx," ",ball.dy )
let ballMoveinit = false;
let bricks = [];
let bricksColors = ["rgba(248, 240, 240, 0.594)","rgba(162, 0, 76, 0.606)"];
for(let index = 0; index < 4; index++) {
  bricks[index]=[];
  for (let bc = 0; bc < 8-index; bc++) {
    bricks[index][bc]=new bricksClass(dX,dY);
    dX+=bricksClass.width+15;
  }
  dY+=bricksClass.height+50;
  dX=((index+1)/2)*bricksClass.width;
}
// var img1 = document.getElementById("bre");
// var img2 = document.getElementById("bre2");

/////////////////////////////////////////////////////////////
// Event Listener

playButton.addEventListener("click", myTimeout3);
stopbtn.addEventListener("click", stopAction);

////////////////////////////////////////////////////////////////
// Functions

//StartShowFunction

function myTimeout3 () {
  playButton.removeEventListener("click", myTimeout3);
  startShowDiv.textContent = "Ready!";
  setTimeout(myGreeting3, 1000);
};


function myGreeting3() {
  startShowDiv.textContent = "Steady!";
  const myTimeout2 = () => {
    setTimeout(myGreeting2, 1000);
  };
  myTimeout2();
}

function myGreeting2() {
  startShowDiv.textContent = "Go!";
  const myTimeout1 = () => {
    setTimeout(myGreeting1, 1000);
  };
  myTimeout1();
}

function myGreeting1() {
  startShowDiv.style.display = "none";
  handler1();
}

//StartShowFunction

function handler1() {
  addEventListener("keydown", handler2);
  addEventListener("keyup", handler3);
  //   addEventListener("mousemove", handler4);
  gameLoop();
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
  slider.dx = 10;
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
}

function handler4(event) {
  slider.dx = 20;
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


function stopAction(){
  if(ballMoveinit) {
    ballMoveinit=false;
    devpause.style.display='block';
    removeEventListener("keydown", handler2);
    removeEventListener("keyup", handler3);
    stopbtn.textContent="Continue";
    }
  else{
    ballMoveinit=true;
    devpause.style.display='none';
    addEventListener("keydown", handler2);
    addEventListener("keyup", handler3); 
    stopbtn.textContent="Pause"; 
  }
}

function gameLoop() {
  drawGame();
  updateScreen();
  if (mouseFlag == 1) {
    leftArrow = false;
    rightArrow = false;
  }
  if (counter == 52) {
    //get out of the gameLoop
    cancelAnimationFrame(gameLoop);
    // alert(`YOU WIN, YOUR SCORE IS ${counter}`);
    //show image
    document.getElementById("win").style.display = "block";
    setTimeout(() => {
      document.location.reload();
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
  ctx.arc(ball.x,ball.y,ball.r,0,2 * Math.PI);
  // ctx.fill();
  //make it appear as not cracked
  ctx.setLineDash([0]);
  ctx.stroke();
}

function drawBricks() {
 
  for(let i =0 ; i<4 ; i++)
  {
    
    for (let bc = 0; bc < 8-i; bc++) {
      let check = (bc+i)%2 ?0:1;
      let check2 = (bc+i)%2 ?2:3;
      if (bricks[i][bc].status == 0) {
        ctx.drawImage(img[check],bricks[i][bc].x,bricks[i][bc].y,bricksClass.width,bricksClass.height);
      }
      else if (bricks[i][bc].status == 1) {
        ctx.drawImage(img[check2],bricks[i][bc].x,bricks[i][bc].y,bricksClass.width,bricksClass.height);
      }
      else if (bricks[i][bc].status == 2){
        ctx.beginPath();
        ctx.fillStyle="transparent";
        ctx.fillRect(bricks[i][bc].x,bricks[i][bc].y,bricksClass.width,bricksClass.height)
      }
      
    }
  };
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
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${counter}`, 60,50);
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
  ){
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
    ball.px = ball.x;
    ball.py = ball.y;
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
}

function ballWallCollision() {
  if (ball.y >= canvas.height - ball.r) {
    ballMoveinit = false;
    ball.x = slider.x + slider.width / 2;
    ball.y = (slider.y - ball.r)-1;
    ball.dx = ball.originaldx;
    ball.dy = ball.originaldy;
  } else {
    if (ball.x - ball.r <= 0 || ball.x >= canvas.width - ball.r) {
      ball.dx = ball.dx * -1;
    }
    if (ball.y -ball.r <= 0) {
      ball.dy = ball.dy * -1;
    }
  }
}
function ballBricksCollision() {
  for (let index = 0; index < 4; index++) {
    for (let bc = 0; bc < 8-index; bc++) {
      
    if ( bricks[index][bc].status == 0) {
        if( ball.x+ball.r >= bricks[index][bc].x 
          && ball.x - ball.r <= bricks[index][bc].x + bricksClass.width
          && ball.y+ball.r >= bricks[index][bc].y && ball.y-ball.r <= bricks[index][bc].y + bricksClass.height ){
            bricks[index][bc].status ++ ;
            counter++;
            if(ball.y <bricks[index][bc].y || ball.y > bricks[index][bc].y+bricksClass.height) {
              ball.dy *= -1;
            }
            if(ball.x <bricks[index][bc].x || ball.x > bricks[index][bc].x+bricksClass.width) {
              ball.dx *= -1;
            }
        }
      }
      else if ( bricks[index][bc].status == 1) {
        if( ball.x+ball.r >= bricks[index][bc].x 
          && ball.x - ball.r <= bricks[index][bc].x + bricksClass.width
          && ball.y+ball.r >= bricks[index][bc].y && ball.y-ball.r <= bricks[index][bc].y + bricksClass.height ){
            bricks[index][bc].status ++ ;
            counter++;
            if(ball.y <bricks[index][bc].y || ball.y > bricks[index][bc].y+bricksClass.height) {
              ball.dy *= -1;
            }
            else if(ball.x <bricks[index][bc].x || ball.x > bricks[index][bc].x+bricksClass.width) {
              ball.dx *= -1;
            }
        }
      }
    }
  }
}
// ball.dy = -ball.dy;
// bricks[index][bc].status = 2;
// counter++;
// // let d=ball.x + ball.r;
  // // let f=ball.x - ball.r;
  // // let hg=bricks[index][bc].x + bricksClass.width;
  // if (bricks[index][bc].status == 0) {
  //   if( ball.x >=  bricks[index][bc].x &&
  //     ball.x <= bricks[index][bc].x + bricksClass.width &&
  //     ball.y <= bricks[index][bc].y+bricksClass.height&& ball.y>=bricks[index][bc].y){
  //       if(ball.px > bricks[index][bc].x )
  //     ball.dy = -ball.dy;
  //     bricks[index][bc].status = 1;
  //     counter++;}
  // }
  // else if ( bricks[index][bc].status == 1) {
  //   if( ball.x >=  bricks[index][bc].x &&
  //     ball.x <= bricks[index][bc].x + bricksClass.width &&
  //     ball.y <= bricks[index][bc].y+bricksClass.height&& ball.y>=bricks[index][bc].y)
  //   ball.dy = -ball.dy;
  //   bricks[index][bc].status = 2;
  //   counter++;
  // }