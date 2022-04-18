var PLAY=1;
var END=0;
var gameState = PLAY;
var boy;
var boy_runningImg, boy_collidedImg;
var bg, bgImg;
var obstacleImg, obstacle, obstacle2Img, obstaclesGroup;
var coin, coinImg, coinsGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var invisibleGround;
var score = 0;

function preload(){
    boy_runningImg = loadImage("boyRunning.gif");
    //boy_runningImg = loadImage("Boy-1.png","Boy-2.png")
    obstacleImg = loadImage("trafficcone.png");
    obstacle2Img = loadImage("barrier.png");
    gameOverImg = loadImage("gameOver.png")
    restartImg = loadImage("restartImg.png")
    boy_collidedImg = loadImage("boyCollide.png");
    bgImg = loadImage("bg.jpg");
    coinImg = loadImage("spinning_coin.gif")
}

function setup() {
    createCanvas(1200, 600);
    
    bg = createSprite(800,300,1200,600);
    bg.addImage(bgImg);
    bg.scale = 2.3;
    bg.velocityX = -(6 + 3*score/100);
    //bg.x = bg.width /2;

    boy = createSprite(50,500,20,50);
    //boy.addImage("running", boy_runningImg);
    boy.addAnimation("running", boy_runningImg);
    boy.scale = 0.5;
    boy.debug =true;
    boy.setCollider("rectangle",100,100,10,100);
    
    gameOver = createSprite(width/2,height/2-50);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.3;
    restart.scale = 0.3;
  
    gameOver.visible = false;
    restart.visible = false;
    
    invisibleGround = createSprite(0,600,1200,1);
    invisibleGround.visible = false;
    
    coinsGroup = new Group();
    obstaclesGroup = new Group();
    
    score = 0;
}

function draw() {
    background(0);
    text("Score: "+ score, 500,50);
    //console.log(boy.y);

    if (gameState===PLAY){
      score = score + Math.round(getFrameRate()/60);
      bg.velocityX = -(6 + 3*score/100);
    
      if(keyDown("space") && boy.y >= 474) {
        boy.velocityY = -12;
      }
    
      boy.velocityY = boy.velocityY + 0.8
    
      if (bg.x < 100){
        bg.x = 300;
      }
    
      
      spawnCoins();
      spawnObstacles();
    
      if(obstaclesGroup.isTouching(boy)){
          gameState = END;
      }
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      //set velcity of each game object to 0
      bg.velocityX = 0;
      boy.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      coinsGroup.setVelocityXEach(0);
      
      //change the trex animation
      boy.changeAnimation("collide", boy_collidedImg);
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      coinsGroup.setLifetimeEach(-1);
      
      if(mousePressedOver(restart)) {
        reset();
        
      }
    }
    
    boy.collide(invisibleGround);
    drawSprites();
 
}

function spawnCoins() {
    //write code here to spawn the coins
  if (frameCount % 45 === 0) {
      coin = createSprite(width+20,height-300,40,10);
      coin.y = Math.round(random(10,50));
      coin.addImage(coinImg);
      coin.scale = 0.5;
      coin.velocityX = -3;
      
       //assign lifetime to the variable
      coin.lifetime = 200;
      
      //adjust the depth
      coin.depth = boy.depth;
     
      
      //add each cloud to the group
      coinsGroup.add(coin);
    }
    
}
  
function spawnObstacles() {
    if(frameCount % 60 === 0) {
      obstacle = createSprite(600,height-70,10,40);
      //obstacle.debug = true;
      obstacle.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: obstacle.addImage(obstacleImg);
                break;
        case 2: obstacle.addImage(obstacle2Img);
                break;
        
        default: break;
      }
      
      //assign scale and lifetime to the obstacle           
      obstacle.scale = 0.2;
      obstacle.lifetime = 300;
      //add each obstacle to the group
      obstaclesGroup.add(obstacle);
    }
  }

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    coinsGroup.destroyEach();
    
    boy_collidedImg.changeAnimation("running",boy_runningImg);
    
    score = 0;
  }