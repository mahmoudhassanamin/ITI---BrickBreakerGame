
// variables && Objects
const playButton = document.getElementById("play");
const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
const stopbtn = document.getElementById("stop");
let devpause = document.getElementById("pause");
const aud = document.getElementById("aud");
const soundimg = document.getElementById("soundimg");
const endPic = document.getElementById("end");
const viewScore = document.getElementById("Score");
const viewLives = document.getElementById("Lives");
const viewLevel = document.getElementById("Level");
const viewHighscore = document.getElementById("HighScore");
const sliderBar = document.getElementById("sliderBar");
const gameBox = document.getElementById("gameBox");
const tokenImage = document.getElementById("life");
const startShowDiv = document.getElementById("startshow");
let img=[document.getElementById("bre"),document.getElementById("bre2"),document.getElementById("bre3"),document.getElementById("bre4")];
let soundEffect =[
  "./resources/sound/beep-beep-6151.mp3",
  "./resources/sound/videogame-death-sound-43894.mp3",
  "./resources/sound/success-fanfare-trumpets-6185.mp3",
  "./resources/sound/mixkit-tech-break-fail-2947.wav",
  "./resources/sound/mixkit-glass-break-with-hammer-thud-759.wav",
  "./resources/sound/slider.wav",
  "./resources/sound/token.wav",
]
let moveConstant = 13;
let bricksNumber = 60;
let mute = 0;
let lives = 3;
let level = 1;
let end = 0 ;
let space=false;
let scoreCounter = 0;
let rightArrow = false;
let leftArrow = false;
let bricksShiftX = 0 ,bricksShiftY = 0;
let oldX,mouseFlag = 0;
let slider = {
  width: 220 , 
  height: 36,
  x: 372.5, 
  y: canvas.height * 0.94,
  dx: 10
};
let ball = {
  r: 10,
  x: canvas.width / 2,
  y: slider.y - 16,
  dx: moveConstant*0.75,
  dy: -moveConstant*0.75,
};

let ballMoveinit = false;
let bricks = [];

let token ={
  Index:Math.floor(Math.random()*(bricksNumber/2+1)),
  status:false,
  active:false,
  y:0,
  x:0,
  width:30,
  height:50,
  dy:3
}

let tokenCounter = 1;

if(localStorage.getItem("highScore")===null){
  localStorage.setItem("highScore", "0");
}

let highScore = Number(localStorage.getItem("highScore"));

/////////////////////////////////////////////////////////////
// Event Listener for start game
soundimg.addEventListener("click",soundFun)
playButton.addEventListener("click", readyShow);

////////////////////////////////////////////////////////////////
// Functions & classes

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
    bricks[index][bc]=new bricksClass(bricksShiftX,bricksShiftY);
    bricksShiftX+=bricksClass.width+21;
  }
  bricksShiftY+=bricksClass.height+50;
  bricksShiftX=((index+1)/2)*bricksClass.width;
}

function readyShow () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  playButton.removeEventListener("click", readyShow);
  startShowDiv.innerHTML = "READY!";
  aud.src=`${soundEffect[0]}`;
  musicStart(0.2);
  setTimeout(steadyShow,1500);
  showDashboard();
};


function steadyShow() {
  startShowDiv.innerHTML = "STEADY!";
  aud.src=`${soundEffect[0]}`;
  musicStart(0.2);
    setTimeout(goShow,1500);
}

function goShow() {
  startShowDiv.innerHTML = "GO...";
  aud.src=`${soundEffect[0]}`;
  musicStart(0.2);
  setTimeout(finishShow,1500);
  
}

function finishShow() {
  startShowDiv.style.display = "none";
  startShowDiv.innerHTML = "READY!";
  gameBox.style.display="block"
  entryPoint();
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

function ballGoo (event){
  if(event.keyCode == 32 || event.type == "mousedown"){
    removeEventListener("keydown", ballGoo);
    canvas.removeEventListener("mousedown", ballGoo);
    stopbtn.addEventListener("mousedown",pauseFun); 
    space=true;
  }
}

function entryPoint() {
  addEventListener("keydown", keyBoardListener);
  addEventListener("keyup", reverseKeyBoardListener);
  addEventListener("keydown", ballGoo);
  canvas.addEventListener("mousemove", mouseListener);
  gameLoop();
  
}

function keyBoardListener(event) {
  if (event.keyCode == 37) {
    leftArrow = true;
    mouseFlag = 0;
  } else if (event.keyCode == 39) {
    rightArrow = true;
    mouseFlag = 0;
  }
}

function reverseKeyBoardListener(event) {
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
}

function mouseListener(event) {
  mouseFlag = 1;
  canvas.addEventListener("mousedown",ballGoo);
  if(event.screenX+80 < canvas.width+80 && event.screenX-slider.width/2-45 > 50){
    slider.x=event.screenX-slider.width/2-100;
    if (!space){
      ball.x = slider.x + slider.width / 2;
      ball.y = slider.y - 16;
    }
  }
}
function pauseFun(){
  if(ballMoveinit) {
    ballMoveinit=false;
    devpause.style.display='block';
    removeEventListener("keydown", keyBoardListener);
    removeEventListener("keyup", reverseKeyBoardListener);
    canvas.removeEventListener("mousedown", ballGoo);
    canvas.removeEventListener("keydown", ballGoo);
    stopbtn.textContent="Continue";
    space=false;
    }
  else{
    ballMoveinit=true;
    devpause.style.display='none';
    addEventListener("keydown", keyBoardListener);
    addEventListener("keyup", reverseKeyBoardListener); 
    stopbtn.textContent="Pause";
    space=true;
  }
}

function gameLoop() {
  drawGame();
  updateScreen();
  if(lives == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    endPic.src = "./resources/images/Game-Over-PNG-Free-Download.webp";
    aud.src=`${soundEffect[1]}`;
    gameEnd();
    return;
  }
  if (scoreCounter == bricksNumber ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    endPic.src = "./resources/images/winner1.png";
    aud.src=`${soundEffect[2]}`;
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
  canvas.removeEventListener("mousemove", ballGoo);
  removeEventListener("keydown", ballGoo);
  removeEventListener("keydown", keyBoardListener);
  removeEventListener("keyup", reverseKeyBoardListener);
  canvas.removeEventListener("mousemove", mouseListener);
  if(lives == 0){
    playButton.addEventListener("click", rematch);
    playButton.textContent = "Rematch";
  }
  else{
    playButton.addEventListener("click", levelUp);
    playButton.textContent = "Next Level";
  }
  if(scoreCounter>highScore){
    highScore = scoreCounter;
    localStorage.setItem("highScore", `${scoreCounter}`);
  }
  stopbtn.removeEventListener("mousedown", pauseFun); 
  space=false;
  musicStart(0);
  showDashboard();
}

function rematch() {
  moveConstant = 13;
  ball.dx = moveConstant*0.75;
  ball.dy = -moveConstant*0.75;
  endPic.style.display = "none";
  lives = 3;
  level = 1;
  scoreCounter = 0;
  for(let index = 0; index <5; index++) {
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
  playButton.removeEventListener("click", rematch);
  startShowDiv.style.display = "block";
  space=false;
  bricksNumber = 60;
  tokenCounter = 1;
  token.Index=Math.floor(Math.random()*(bricksNumber/2+1));
  token.active == false;
  token.status=false;
  readyShow();
}

function levelUp() {
  level++;
  moveConstant += 3;
  ball.dx = moveConstant*0.75;
  ball.dy = -moveConstant*0.75;
  endPic.style.display = "none";
  for(let index = 0; index <5; index++) {
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
  playButton.removeEventListener("click", levelUp);
  startShowDiv.style.display = "block";
  space=false;
  bricksNumber += 60;
  tokenCounter = 1;
  token.Index=Math.floor(Math.random()*(bricksNumber - scoreCounter +1 ))+scoreCounter;
  token.active == false;
  token.status=false;
  readyShow();
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
  moveSlider();
  moveBall();
  ballSliderCollision();
  ballWallCollision();
  ballBricksCollision();
  if ( tokenCounter < 3){
    tokenFun();
  }
  showDashboard();
}
function showDashboard() {
  viewScore.textContent = `Score : ${scoreCounter}`;
  viewLives.textContent = `Lives  : ${lives}`;
  viewLevel.textContent = `Level : ${level}`
  viewHighscore.textContent = `High Score : ${highScore}`;
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

function moveBall() {
  if (!ballMoveinit) {
    if (space) {
      ballMoveinit = true;
    } 
  }else {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }
}

function ballSliderCollision() {
  if (
    ball.y + ball.r >= slider.y &&
    ball.x >= slider.x &&
    ball.x <= slider.x + slider.width
  ){
    aud.src=`${soundEffect[5]}`;
    musicStart(0.9);
    let seta = calculateSeta();
    ball.dx = moveConstant * Math.sin(seta);
    ball.dy = -moveConstant * Math.cos(seta);
  }
}

function calculateSeta() {
  let ratio = ((ball.x - (slider.x + slider.width / 2)) / (slider.width / 2)) * 1.1;
  return ratio;
}


function ballWallCollision() {
  if (ball.y >= canvas.height - ball.r) {
    lives--;
    ballMoveinit = false;
    ball.x = slider.x + slider.width / 2;
    ball.y = slider.y - 16;
    ball.dx = moveConstant;
    ball.dy = -moveConstant;
    addEventListener("keydown", ballGoo);
    stopbtn.removeEventListener("mousedown",pauseFun); 
    space=false;
    aud.src=`${soundEffect[1]}`;
    musicStart(1.6);
  } else {
    if (ball.x - ball.r <= 0 || ball.x >= canvas.width - ball.r) {
      ball.dx = ball.dx * -1;
      aud.src=`${soundEffect[3]}`;
      musicStart(0.3);
    }
    if (ball.y -ball.r <= 0) {
      ball.dy = ball.dy * -1;
      aud.src=`${soundEffect[3]}`;
      musicStart(0.3);
    }
  }
}
function ballBricksCollision() {
  for (let index = 0; index < 5; index++) {
    let flag =0;
    for (let bc = 0; bc < 8-index; bc++) {
        if(token.Index == scoreCounter){
          token.active = true;
        }
        if( bricks[index][bc].status == 0 && ball.x+ball.r >= bricks[index][bc].x 
          && ball.x - ball.r <= bricks[index][bc].x + bricksClass.width
          && (ball.y+ball.r >= bricks[index][bc].y &&
          ball.y-ball.r <= bricks[index][bc].y + bricksClass.height )){
            aud.src=`${soundEffect[4]}`;
            musicStart(0.5);
          
          if((ball.y <bricks[index][bc].y || ball.y > bricks[index][bc].y+bricksClass.height)&& ball.x>bricks[index][bc].x&&ball.x<bricks[index][bc].x+bricksClass.width){
            ball.dy *= -1;
            bricks[index][bc].status = 1;
            scoreCounter++;
          }
          
          else if((ball.x <bricks[index][bc].x || ball.x > bricks[index][bc].x+bricksClass.width)&&ball.y>bricks[index][bc].y&&ball.y<bricks[index][bc].y+bricksClass.height) {
            ball.dx *= -1;
            bricks[index][bc].status = 1;
            scoreCounter++;
          }
          else {
            ball.dy *= -1;
            bricks[index][bc].status = 1;
            scoreCounter++;
          }
          flag=1;
        }
        else if(flag!=1 && bricks[index][bc].status == 1 && ball.x+ball.r >= bricks[index][bc].x 
          && ball.x - ball.r <= bricks[index][bc].x + bricksClass.width
          && (ball.y+ball.r >= bricks[index][bc].y &&
            ball.y-ball.r <= bricks[index][bc].y + bricksClass.height )){
            aud.src=`${soundEffect[4]}`;
            musicStart(0.5);
         
          if((ball.y <bricks[index][bc].y || ball.y > bricks[index][bc].y+bricksClass.height)&& ball.x>bricks[index][bc].x&&ball.x<bricks[index][bc].x+bricksClass.width) {
            ball.dy *= -1;
            bricks[index][bc].status = 2;
            scoreCounter++;
          }
          else if((ball.x <bricks[index][bc].x || ball.x > bricks[index][bc].x+bricksClass.width)&&ball.y>bricks[index][bc].y&&ball.y<bricks[index][bc].y+bricksClass.height) {
            ball.dx *= -1;
            bricks[index][bc].status = 2;
            scoreCounter++;
          }
          else {
            ball.dy *= -1;
            ball.dx *= -1;
            bricks[index][bc].status = 2;
            scoreCounter++;
          }
          if ( token.active == true ){
            token.active = false;
            token.status=true;
            token.x=bricks[index][bc].x+(bricksClass.width-token.width)/2;
            token.y=bricks[index][bc].y;
            console.log("b.x",bricks[index][bc].x,"b.y",bricks[index][bc].y)
            console.log("t.x",token.x,"t.y",token.y)
          }
        }
        flag=0;
      }
    }
  }
///////////////////////////////////////////////////////
// bonus 
function tokenFun(){
  if( token.status == true){
    ctx.drawImage(tokenImage,token.x,token.y,token.width,token.height);
    token.y += token.dy;
    if(token.y+token.height >= slider.y &&
       token.y < slider.y+slider.height &&
       token.x+token.width >= slider.x +2 && 
       token.x <= slider.x+slider.width-2
       )
       {
        aud.src=`${soundEffect[6]}`;
        musicStart(0);
        tokenCounter ++;
        token.Index=Math.floor(Math.random()*(bricksNumber - scoreCounter +1 ))+scoreCounter;
        token.active == false;
        token.status=false;
        lives++;
        console.log(token.Index)
       }
       else if (token.y > canvas.height)
       {
        tokenCounter ++;
        token.Index=Math.floor(Math.random()*(bricksNumber - scoreCounter +1 ))+scoreCounter;
        console.log(token.Index)
        token.active == false;
        token.status=false;
      }
    }
}