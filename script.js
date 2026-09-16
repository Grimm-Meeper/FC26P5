//preview: python -m http.server


var ball = null
var allObstacles = []
var run = true
var deathFrame = -1

function setup() {
  ball = new Ball();
  createCanvas(windowWidth-100, windowHeight-100);
  background(30);
  frameRate(60);
}

function draw() {
  background(30);
  if(run){
    if (frameCount % 100 == 0) {
      allObstacles.push(new Obstacle(random(1, windowWidth-100), random(1, windowHeight-100), random(10, 100), random(10, 100)))
    }

      ball.update();   // Calculate physics
      ball.checkKeys(); // Check for keyboard input
      ball.display();    // Draw the ball
      if (ball.checkEdges() == "die"){ //die
        endGame();
      } 

    for(let i = 0; i < allObstacles.length; i++){
      allObstacles[i].display()
      allObstacles[i].x += allObstacles[i].Xvol
      allObstacles[i].y += allObstacles[i].Yvol
      if(allObstacles[i].checkDeath() == "die"){
        endGame();
      }
    }
  } else {
    fill("red")
    textSize(40)
    text("Game Over. Seconds survived: " + roundTo(deathFrame / 60, 3), 600, 300)
  }
}

class Ball {
  constructor() {
    this.pos = createVector(600, (height * 3)/2);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 50;
    this.topSpeed = 20;
    this.friction = 0.99; 
    this.Red = 255;
    this.Green = 255;
    this.Blue = 0;
    this.vel.y = 0
    this.vel.x = 0
  }

  // Method to check keyboard input and apply forces
  checkKeys() {
    let forceMagnitude = 2;
    
    if (keyIsDown(32)){
      this.applyForce(createVector(0, -forceMagnitude));
    }
  }

  // The "Force" pattern: Force adds to Acceleration
  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    // 1. Acceleration changes Velocity
    this.vel.add(this.acc);
    
    // 2. Limit the speed so it doesn't go infinite
    this.vel.limit(this.topSpeed);
    
    // 3. Velocity changes Position
    this.pos.add(this.vel);
    
    // 4. Apply friction (velocity decay)
    this.vel.mult(this.friction);

    //4.5 go down
    this.vel.add(0, 1)

    // 5. Reset acceleration for the next frame
    this.acc.mult(0);
  }

  display() {
    fill(this.Red, this.Green, this.Blue);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r);
  }

  checkEdges(){

    if(Math.abs(this.pos.y) < 0){
      return "die";
    }

    if(Math.abs(this.pos.y) > height){
      return "die";
    }
  }
}

class Obstacle {
  constructor(x, y, W, H) {
    this.x = x
    this.y = y
    this.width = W
    this.height = H
    this.Xvol = random(-10, 10)
    this.Yvol = random(-10, 10)
  }

  display() {
    fill(100, 255, 100);
    noStroke();
    rect(this.x, this.y, this.width, this.height);

    if(Math.abs(this.x) + this.width > width || Math.abs(this.x) - 10 < 0){
      this.Xvol *= -1;
    }

    if(Math.abs(this.y) + this.height > height || Math.abs(this.y) - 10 < 0){
      this.Yvol *= -1;
    }
  }
  checkDeath(){
    if((this.x <= 625 && this.x >= 575) && (this.y >= ball.pos.y - ball.r && this.y <= ball.pos.y )){
      return"die";
    }
  }
}

function endGame(){
  run = false
  deathFrame = frameCount
}

function roundTo(num, place){
  let ans = -1
  ans = num * (10 ** place)
  ans = Math.floor(ans)
  ans /= (10 ** place)
  return ans
}

function mouseClicked() {
  if(run){
    return
  }
  allObstacles = []
  ball.pos.y = 100
  run = true
  frameCount = 0
}