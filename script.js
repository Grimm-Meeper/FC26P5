//preview: python -m http.server


function setup() {
  let allBalls = []
  allBalls.push(new Ball(random(width),random(height),random(ballSize)))
  createCanvas(windowWidth-100, windowHeight-100);
  background(30);
}

function draw() {
  background(30);
  for(let i = 0; i < allBalls.length; i++){
    allBalls[i].update();   // Calculate physics
    allBalls[i].checkKeys(); // Check for keyboard input
    allBalls[i].display();    // Draw the ball
    allBalls[i].checkEdges();
  }
}

class Ball {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = r;
    this.topSpeed = 60;
    this.friction = 0.99; 
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
    fill(255, 150, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r);
  }

  checkEdges(){

    if(Math.abs(this.pos.x) - this.r > width){
      this.pos.x *= -1
    }

    if(Math.abs(this.pos.y) - this.r > height){
      this.pos.y *= -1
    }

  }
}

