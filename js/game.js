// variables && Objects
const playButton = document.getElementById("play");
const canvas = document.getElementById("cvs");
const stopbtn = document.getElementById("stop");
let devpause = document.getElementById("pause");
const aud = document.getElementById("aud");
const soundimg = document.getElementById("soundimg");
const endPic = document.getElementById("end");
const viewScore = document.getElementById("Score");
const viewLives = document.getElementById("Lives");
const sliderBar = document.getElementById("sliderBar");
const gameBox = document.getElementById("gameBox");
const ctx = canvas.getContext("2d");
let mute = 0;
let lives = 3;
let end = 0 ;
let space=false;
let img=[document.getElementById("bre"),document.getElementById("bre2"),document.getElementById("bre3"),document.getElementById("bre4")]
let soundEffect =[
  1,
  2,
  3,
  "./resources/sound/mixkit-tech-break-fail-2947.wav",
  5,
  "./resources/sound/mixkit-glass-break-with-hammer-thud-759.wav"
]
let rightArrow = false;
let leftArrow = false;
const constant = 12;
let dX = 0 ,dY = 0;
const startShowDiv = document.getElementById("startshow");
//score counter
let counter = 0;

// Ball object here
let oldX,mouseFlag = 0;
let slider = {
  width: 220 , //200
  height: 36,
  x: 372.5, // 372.5
  y: canvas.height * 0.94,
  dx: 10
};
let ball = {
  r: 10,
  x: canvas.width / 2,
  y: slider.y - 16,
  dx: 7, //10
  dy: -7,//-10
  originaldx: 7,
  originaldy: -7,
};
let ballMoveinit = false;
let bricks = [];
let bricksColors = ["rgba(248, 240, 240, 0.594)","rgba(162, 0, 76, 0.606)"];


/////////////////////////////////////////////////////////////
// Event Listener
soundimg.addEventListener("click",soundFun)
addEventListener("load", musicStart);
playButton.addEventListener("click", myTimeout3);
////////////////////////////////////////////////////////////////
// Functions

class bricksClass{
  static width = 97;
  static height =49;
  constructor(dx,dy){
    this.x = 10+dx;
    this.y = 80+dy;
    this.status=0;
  }
}
for(let index = 0; index < 5; index++) {
  bricks[index]=[];
  for (let bc = 0; bc < 8-index; bc++) {
    bricks[index][bc]=new bricksClass(dX,dY);
    dX+=bricksClass.width+21;
  }
  dY+=bricksClass.height+50;
  dX=((index+1)/2)*bricksClass.width;
}

function myTimeout3 () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  playButton.removeEventListener("click", myTimeout3);
  startShowDiv.innerHTML = "READY!";
  aud.src="#"; //peep sound
  musicStart(0);
  setTimeout(myGreeting3,1500);
};


function myGreeting3() {
  startShowDiv.innerHTML = "STEADY!";
  aud.src="#"; //peep sound
  musicStart(0);
  const myTimeout2 = () => {
    setTimeout(myGreeting2,1500);
  };
  myTimeout2();
}

function myGreeting2() {
  startShowDiv.innerHTML = "GO...";
  aud.src=`${soundEffect[2]}`; //start tone
  musicStart(0.1);
  const myTimeout1 = () => {
    setTimeout(myGreeting1,1500);
  };
  myTimeout1();
}

function myGreeting1() {
  startShowDiv.style.display = "none";
  startShowDiv.innerHTML = "READY!";
  gameBox.style.display="block"
  handler1();
}
function soundFun (){
  if (mute == 0){
    mute = 1;
    soundimg.src="./resources/images/mute.png"
  }
  else{
    mute = 0;
    soundimg.src="./resources/images/sound.png"
  }
}
function musicStart(t) {
  if(mute == 0){
  aud.currentTime = t;
  aud.play();
  }
}

function handler0 (event){
  
  if(event.keyCode == 32 || event.type == "mousedown"){
    removeEventListener("keydown", handler0);
    removeEventListener("mousedown", handler0);
    stopbtn.addEventListener("mousedown",stopAction); 
    space=true;
  }
}

function handler1() {
  addEventListener("keydown", handler2);
  addEventListener("keyup", handler3);
  addEventListener("keydown", handler0);
  canvas.addEventListener("mousemove", handler4);
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
  mouseFlag = 1;
  addEventListener("mousedown",handler0)
  if(event.screenX+80 < canvas.width+80 && event.screenX-slider.width/2-45 > 50){
    slider.x=event.screenX-slider.width/2-100;
    if (!space){
      ball.x = slider.x + slider.width / 2;
      ball.y = slider.y - 16;
    }
  }
}
function stopAction(){
  if(ballMoveinit) {
    ballMoveinit=false;
    devpause.style.display='block';
    removeEventListener("keydown", handler2);
    removeEventListener("keyup", handler3);
    stopbtn.textContent="Continue";
    space=false;
    }
  else{
    ballMoveinit=true;
    devpause.style.display='none';
    addEventListener("keydown", handler2);
    addEventListener("keyup", handler3); 
    stopbtn.textContent="Pause";
    space=true;
  }
}

function gameLoop() {
  drawGame();
  updateScreen();
  if(lives == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    removeEventListener("mousedown", handler0);
    endPic.src = "./resources/images/Game-Over-PNG-Free-Download.webp";
    gameEnd();
    return;
  }
  if (counter == 60) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    removeEventListener("mousedown", handler0);
    endPic.src = "./resources/images/winner1.png";
    gameEnd();
    return;
  }
  if (mouseFlag == 1) {
    leftArrow = false;
    rightArrow = false;
  }

  requestAnimationFrame(gameLoop);

}

function gameEnd() {
  endPic.style.display = "block";
  stopbtn.removeEventListener("click", stopAction);
  playButton.addEventListener("click", rematch);
}

function rematch() {
  endPic.style.display = "none";
  lives = 3;
  counter = 0;
  for(let index = 0; index < 4; index++) {
    for (let bc = 0; bc < 8-index; bc++) {
      bricks[index][bc].status = 0;
    }
  }
  slider.x = 372.5;
  ball.x = canvas.width / 2;
  ball.y = slider.y - 16;
  ballMoveinit = false;
  oldX = 0;
  mouseFlag = 0;
  rightArrow = false;
  leftArrow = false;
  playButton.textContent = "Play";
  updateScreen();
  drawGame();  
  playButton.removeEventListener("click", rematch);
  startShowDiv.style.display = "block";
  myTimeout3();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSlider();
  drawBall();
  drawBricks();
}

function drawSlider() {
  ctx.drawImage(sliderBar,slider.x,slider.y,slider.width,slider.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "black";
  ctx.fillStyle = "rgb(74, 16, 49)";
  ctx.arc(ball.x,ball.y,ball.r,0,2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawBricks() {
 
  for(let i =0 ; i<5 ; i++){
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
  showLives();
  moveSlider();
  moveBall();
  ballSliderCollision();
  ballWallCollision();
  ballBricksCollision();
}
function showCounter() {
  viewScore.textContent = `Score : ${counter}`;
}
function showLives() {
  viewLives.textContent = `Lives  : ${lives}`;
}
function moveSlider() {
  if (rightArrow && slider.x < canvas.width - slider.width -12) {
    slider.x += slider.dx;
    if (!space){
      ball.x = slider.x + slider.width / 2;
      ball.y = slider.y - 16;
    }
  }
  if (leftArrow && slider.x > 10) {
    slider.x -= slider.dx;
    if (!space){
      ball.x = slider.x + slider.width / 2;
      ball.y = slider.y - 16;
    }
  }
}

function ballSliderCollision() {
  if (
    ball.y + ball.r >= slider.y &&
    ball.x >= slider.x &&
    ball.x <= slider.x + slider.width
  ){
    aud.src=`${soundEffect[4]}`; //paddle hit tone
    musicStart(0);
    let seta = calSeta();
    ball.dx = constant * Math.sin(seta);
    ball.dy = -constant * Math.cos(seta);
  }
}

function calSeta() {
  let ratio = ((ball.x - (slider.x + slider.width / 2)) / (slider.width / 2)) * 1.1;
  return ratio;
}

function moveBall() {
  if (!ballMoveinit) {
    if (space) {
      ballMoveinit = true;
    } 
  }else {
    ball.px = ball.x;
    ball.py = ball.y;
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
}

function ballWallCollision() {
  if (ball.y >= canvas.height - ball.r) {
    lives--;
    ballMoveinit = false;
    ball.x = slider.x + slider.width / 2;
    ball.y = slider.y - 16;
    ball.dx = ball.originaldx;
    ball.dy = ball.originaldy;
    addEventListener("keydown", handler0);
    stopbtn.removeEventListener("mousedown",stopAction); 
    space=false;
    aud.src=`${soundEffect[4]}`; //lose live tone
    musicStart(0.3);
  } else {
    if (ball.x - ball.r <= 0 || ball.x >= canvas.width - ball.r) {
      ball.dx = ball.dx * -1;
      aud.src=`${soundEffect[3]}`; //wall hit tone
      musicStart(0.3);
    }
    if (ball.y -ball.r <= 0) {
      ball.dy = ball.dy * -1;
      aud.src=`${soundEffect[3]}`; //wall hit tone
      musicStart(0.3);
    }
  }
}
function ballBricksCollision() {
  for (let index = 0; index < 5; index++) {
    let flag =0;
    for (let bc = 0; bc < 8-index; bc++) {
        if( bricks[index][bc].status == 0 && ball.x+ball.r >= bricks[index][bc].x 
          && ball.x - ball.r <= bricks[index][bc].x + bricksClass.width
          && (ball.y+ball.r >= bricks[index][bc].y &&
          ball.y-ball.r <= bricks[index][bc].y + bricksClass.height )){
            aud.src=`${soundEffect[5]}`; //brick hit tone
            musicStart(0.5);
          
          if((ball.y <bricks[index][bc].y || ball.y > bricks[index][bc].y+bricksClass.height)&& ball.x>bricks[index][bc].x&&ball.x<bricks[index][bc].x+bricksClass.width){
            ball.dy *= -1;
            bricks[index][bc].status = 1;
            counter++;
          }
          
          else if((ball.x <bricks[index][bc].x || ball.x > bricks[index][bc].x+bricksClass.width)&&ball.y>bricks[index][bc].y&&ball.y<bricks[index][bc].y+bricksClass.height) {
            ball.dx *= -1;
            bricks[index][bc].status = 1;
            counter++;
          }
          else {
            ball.dy *= -1;
            bricks[index][bc].status = 1;
            counter++;
          }
          flag=1;
        }
        else if(flag!=1 && bricks[index][bc].status == 1 && ball.x+ball.r >= bricks[index][bc].x 
          && ball.x - ball.r <= bricks[index][bc].x + bricksClass.width
          && (ball.y+ball.r >= bricks[index][bc].y &&
            ball.y-ball.r <= bricks[index][bc].y + bricksClass.height )){
            aud.src=`${soundEffect[5]}`; //brick break tone
            musicStart(0.5);
         
          if((ball.y <bricks[index][bc].y || ball.y > bricks[index][bc].y+bricksClass.height)&& ball.x>bricks[index][bc].x&&ball.x<bricks[index][bc].x+bricksClass.width) {
            ball.dy *= -1;
            bricks[index][bc].status = 2;
            counter++;
          }
          else if((ball.x <bricks[index][bc].x || ball.x > bricks[index][bc].x+bricksClass.width)&&ball.y>bricks[index][bc].y&&ball.y<bricks[index][bc].y+bricksClass.height) {
            ball.dx *= -1;
            bricks[index][bc].status = 2;
            counter++;
          }
          else {
            ball.dy *= -1;
            bricks[index][bc].status = 2;
            counter++;
          }
        }
        flag=0;
      }
    }
  }
  
