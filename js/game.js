// variables && Objects
const playButton = document.getElementById('play');
const canvas = document.getElementById('cvs');
const ctx = canvas.getContext("2d");
let rightArrow = false;
let leftArrow = false;
// Ball object here
let oldX , mouseFlag = 0;
let slider = {
    width:canvas.width/3,
    height:0,
    x:(canvas.width/3),
    y:canvas.height*0.94,
    dx:3
}
let ball = {

}


slider.height=slider.width/15;
/////////////////////////////////////////////////////////////
// Event Listener

playButton.addEventListener("click",handler1);




////////////////////////////////////////////////////////////////
// Functions
function handler1(){
    addEventListener("keydown",handler2);
    addEventListener("keyup",handler3);
    addEventListener("mousemove",handler4);
    // startShow();
    setTimeout(gameLoop,1000);

}

function handler2(event){
    if(event.keyCode == 37){
        leftArrow = true;
        mouseFlag=0;
    }
    else if(event.keyCode == 39){
        rightArrow = true;
        mouseFlag=0;
    }
}

function handler3(event){
    slider.dx=3;
    if(event.keyCode == 37){
        leftArrow = false;
    }
    else if(event.keyCode == 39){
        rightArrow = false;
    }
}



function handler4(event){
    slider.dx=4;
    if (mouseFlag == 1){
        if(oldX > event.screenX){
        leftArrow=true;
        rightArrow = false;
        oldX=event.screenX;
        }
        else if(oldX < event.screenX){
        rightArrow=true;
        leftArrow = false;
        oldX=event.screenX;
        }
    }
    else{
        oldX=event.screenX;
        mouseFlag=1;
    }
}

function startShow(){


}

function gameLoop(){
    drawGame();
    updateScreen();
    if (mouseFlag == 1 ){
        leftArrow=false;
        rightArrow=false;
    }
    requestAnimationFrame(gameLoop);
}

function drawGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSlider();
    // drawBall();
    drawBricks();
}

function drawSlider(){
    ctx.beginPath();
    ctx.fillStyle="rgb(74, 16, 49)"
    ctx.fillRect(slider.x,slider.y,slider.width,slider.height);  
}

function drawBall(){

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
    moveSlider();
    ballSliderCollision();
    // ballWallCollision();
    // moveBall(); // move up down left right stright
}

function moveSlider () {
    if(rightArrow && slider.x < canvas.width-slider.width-5){
        slider.x += slider.dx;
    }
    if(leftArrow && slider.x > 5 ){
        slider.x -= slider.dx;
    }
    
}


function ballSliderCollision(){
    if(ball.y+ball.r >= slider.y && ball.x >= slider.x && ball.x <= (slider.x+slider.width) ){
        ball.dx=3;
        ball.dy=3;
        let ratio = calSeta();
        if (ratio >= 0 && ratio < 0.2){
            ball.dy = -ball.dy/3;
            ball.dx = -ball.dx;
        }
        else if (ratio >= 0.2 && ratio < 0.4){
            ball.dx = -ball.dx/1.5;
            ball.dy = -ball.dy/2;
        }
        else if (ratio >= 0.4 && ratio < 0.6){
            ball.dx = 0;
            ball.dy = -3;
        }
        else if (ratio >= 0.6 && ratio < 0.8){
            ball.dx = ball.dx/1.5;
            ball.dy = -ball.dy;
        }
        else if (ratio >= 0.8 && ratio <= 1){
            ball.dy = -ball.dy/3;
        }
    }
}

function calSeta(){
    let ratio = ((slider.x-ball.x)/slider.width)*100;
    return ratio;
}



