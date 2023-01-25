// variables && Objects
const playButton = document.getElementById('play');
const canvas = document.getElementById('cvs');
const ctx = canvas.getContext("2d");
let rightArrow = false;
let leftArrow = false;
// Ball object here

let slider = {
    width:canvas.width/3,
    height:0,
    x:(canvas.width/3),
    y:canvas.height*0.92,
    dx:3
}
let ball = {

}

slider.height=slider.width/13;
/////////////////////////////////////////////////////////////
// Event Listener

playButton.addEventListener("click",handler1);




////////////////////////////////////////////////////////////////
// Functions
function handler1(){
    addEventListener("keydown",handler2);
    addEventListener("keyup",handler3);
    // startShow();
    setTimeout(gameLoop,1000);

}

function handler2(event){
    if(event.keyCode == 37){
        leftArrow = true;
        console.log("leftArrow ",leftArrow);
    }
    else if(event.keyCode == 39){
        rightArrow = true;
        console.log("rightArrow ",rightArrow);
    }
}

function handler3(event){
    if(event.keyCode == 37){
        leftArrow = false;
        console.log("leftArrow ",leftArrow)
    }
    else if(event.keyCode == 39){
        rightArrow = false;
        console.log("rightArrow ",rightArrow)
    }
}

function startShow(){


}

function gameLoop(){
    drawGame();
    updateScreen();
    requestAnimationFrame(gameLoop);
}

function drawGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSlider();
    // drawBall();
    // drawbricks(); // in part 2
}

function drawSlider(){
    
    ctx.beginPath();
    ctx.fillStyle="rgb(74, 16, 49)"
    ctx.fillRect(slider.x,slider.y,slider.width,slider.height);
}

function drawBall(){

}

function drawbricks(){

}

function updateScreen (){
    // sliderWallCollision();
    moveSlider();
    // ballSliderCollision();
    // ballWallCollision();
    // moveBall(); // move up down left right stright
}

function moveSlider () {
    if(rightArrow == true && slider.x < canvas.width-slider.width-5){
        slider.x += slider.dx;
    }
    if(leftArrow == true && slider.x > 5 ){
        slider.x -= slider.dx;
    }
}






















