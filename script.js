// preview: python -m http.server
//making all the variables exist, even if unset
const FIRST_SPAWN = 100;
const OBSTACLE_LIFE = 360;
let ball, obstacles, UD, startFrame, running, score, obstacleCount;
let highScore = 0, setter = "ur mom gottem", newHigh = false;
//runs once
function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100); 
  frameRate(60);
  reset();
  setter = localStorage.getItem("setter")
  highScore = localStorage.getItem("score")
}
//runs when reset
function reset() {
  UD = floor(random(1, 12)) == 2;
  ball = new Ball();
  obstacles = [];
  startFrame = frameCount; 
  running = true;
  newHigh = false;
}
//counting time
function elapsed() {
  return frameCount - startFrame;
}
//every frame
function draw() {
  background(UD? "#DFDFDF" :"#202020");
  if (!running) return drawGameOver();

  if (elapsed() == FIRST_SPAWN) spawn();

  ball.checkKeys();
  ball.update();
  ball.display();
  if (ball.offscreen()) return endGame();

  for (const o of obstacles) {
    o.update();
    o.display();
    if (o.hits(ball)) return endGame();
  }

  // Each expired obstacle is replaced by two new ones.
  for (const o of obstacles.filter(o => o.expired())) { spawn(); spawn(); }
  obstacles = obstacles.filter(o => !o.expired());
}
//creates obsitcales
function spawn() {
  let o;
  do { o = new Obstacle(); } while (o.hits(ball)); // no spawning on top of the ball
  obstacles.push(o);
}
//when the game ends
function endGame() {
  running = false;
  score = floor(elapsed() / 60 * 100) / 100;
  obstacleCount = obstacles.length * (UD ? -1 : 1);
  if (score > highScore) {
    highScore = score;
    newHigh = true;
    temp = prompt("New high score! Enter your name:");
    if(temp!= null){
      while(temp.substring(0, 1) == " "){
        temp = temp.substring(1);
      }
      if(temp != ""){
        setter = temp;
        localStorage.setItem("setter", temp)
        localStorage.setItem("score", score)
      }
    }
  }
}
//draws when the game ends
function drawGameOver() {
  fill(UD ? color(0, 255, 255) : color(255, 0, 0));
  textSize(40);
  textAlign(CENTER, CENTER);
  text(
    `Game Over.\nSeconds survived: ${score}\nNumber of obstacles: ${obstacleCount}` +
    `\nHigh score: ${highScore}\nSet by ${setter}` + (newHigh ? "\nNew High Score!" : ""),
    width / 2, height / 2
  );
}
//resets if dead and clicked
function mouseClicked() {
  if (!running) reset();
}
function keyPressed() {
  if (keyCode === 13 && !running) {
    reset();
  } else if(keyCode === 70){
    localStorage.setItem("setter", "Fenton")
  }
}

//the player
class Ball {
  //init
  constructor() {
    this.pos = createVector(width / 2, UD ? height - 100 : 100);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 25;
    this.gravity = UD ? -1 : 1;
    this.color = UD ? color(0, 0, 255) : color(255, 255, 0);
  }
//input
  checkKeys() {
    if (keyIsDown(32) || keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.acc.add(0, -2 * this.gravity);
    }
  }
//change stats
  update() {
    this.vel.add(this.acc).limit(20);
    this.pos.add(this.vel);
    this.vel.mult(0.99).add(0, this.gravity);
    this.acc.set(0, 0);
  }
//draw it
  display() {
    fill(this.color);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
//kill it if it's off screen
  offscreen() {
    return this.pos.y < 0 || this.pos.y > height;
  }
}
//the thingfs the player must dodge
class Obstacle {
  //init
  constructor() {
    this.w = random(10, 100);
    this.h = random(10, 100);
    this.x = random(0, width - this.w);
    this.y = random(0, height - this.h);
    this.vx = random(-10, 10);
    this.vy = random(-10, 10);
    this.born = frameCount;
  }
//change its stats
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.vx = abs(this.vx);
    if (this.x + this.w > width) this.vx = -abs(this.vx);
    if (this.y < 0) this.vy = abs(this.vy);
    if (this.y + this.h > height) this.vy = -abs(this.vy);
  }
//kill it if it needs to die
  expired() {
    return frameCount - this.born >= OBSTACLE_LIFE;
  }
//draw it
  display() {
    fill(UD ? color(155, 0, 155) : color(100, 255, 100));
    if(frameCount - this.born >= OBSTACLE_LIFE - 60 && frameCount % 3 == 0){
      fill(UD ? color(255, 255, 255) : color(0, 0, 0))
    }
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

  // collision detection
  hits(b) {
    const dx = b.pos.x - constrain(b.pos.x, this.x, this.x + this.w);
    const dy = b.pos.y - constrain(b.pos.y, this.y, this.y + this.h);
    return dx * dx + dy * dy < b.r * b.r;
  }
}
