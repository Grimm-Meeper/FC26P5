//preview: python -m http.server


var allBalls = []
var allObstacles = []

function setup() {
  for(let i = 0; i < 50; i ++){
    allBalls.push(new Ball(random(1, windowWidth-100), random(1, windowHeight-100), random(10, 100), random(0, 255), random(0, 255), random(0, 255)))
  }
  createCanvas(windowWidth-100, windowHeight-100);
  background(30);
}

function draw() {
  background(30);
  if (frameCount % 100 == 0) {
    allObstacles.push(new Obstacle(random(1, windowWidth-100), random(1, windowHeight-100), random(10, 100), random(10, 100)))
  }
  for(let i = 0; i < allBalls.length; i++){
    allBalls[i].update();   // Calculate physics
    allBalls[i].checkKeys(); // Check for keyboard input
    allBalls[i].display();    // Draw the ball
    allBalls[i].checkEdges(); //wrap around
  }
  for(let i = 0; i < allObstacles.length; i++){
    allObstacles[i].display()
    allObstacles[i].x += allObstacles[i].Xvol
    allObstacles[i].y += allObstacles[i].Yvol
  }
}

class Ball {
  constructor(x, y, r, red, green ,blue) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = r;
    this.topSpeed = 60;
    this.friction = 0.99; 
    this.Red = red;
    this.Green = green;
    this.Blue = blue;
    this.vel.y = random(-100, 100) * 10
    this.vel.x = random(-100, 100) * 10
  }

  // Method to check keyboard input and apply forces
  checkKeys() {
    let forceMagnitude = 12;
    
    if (keyIsDown(LEFT_ARROW))  this.applyForce(createVector(-forceMagnitude, 0));
    if (keyIsDown(RIGHT_ARROW)) this.applyForce(createVector(forceMagnitude, 0));
    if (keyIsDown(UP_ARROW))    this.applyForce(createVector(0, -forceMagnitude));
    if (keyIsDown(DOWN_ARROW))  this.applyForce(createVector(0, forceMagnitude));
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
    
    // 5. Reset acceleration for the next frame
    this.acc.mult(0);
  }

  display() {
    fill(this.Red, this.Green, this.Blue);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r);
  }

  checkEdges(){

    if(Math.abs(this.pos.x) + this.r > width || Math.abs(this.pos.y) - 10 < 0){
      this.vel.x *= -1;
    }

    if(Math.abs(this.pos.y) + this.r > height || Math.abs(this.pos.y) - 10 < 0){
      this.vel.y *= -1;
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
    fill("orange");
    noStroke();
    rect(this.x, this.y, this.width, this.height);

    if(Math.abs(this.x) + this.width > width || Math.abs(this.x) - 10 < 0){
      this.Xvol *= -1;
    }

    if(Math.abs(this.y) + this.height > height || Math.abs(this.y) - 10 < 0){
      this.Yvol *= -1;
    }
  }
}