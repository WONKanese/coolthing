let balls = [];
let avgSize = 100;
let totalSize = 0;
let totalBalls = 0;
function setup() {
  createCanvas(windowWidth - 10, windowHeight - 10);
}

function mousePressed() {
  let newBall = new Ball();
  totalBalls += 1;
  newBall.x = mouseX;
  newBall.y = mouseY;
  balls.push(newBall);
}

function draw() {
  background(220);
  
  // Update and display each ball
  for (let ball of balls) {
    totalSize += ball.size;
    ball.move();
    ball.display();
    ball.collapse();
  }
  avgSize = totalSize / totalBalls;
  totalSize = 0;
}

class Ball {
  constructor(id) {
    this.id = totalBalls;
    this.x = random(width);
    this.y = random(height);
    this.size = random(10, 70);
    this.xSpeed = random(-3, 3);
    this.ySpeed = random(-3, 3);
    this.willJoin = -1;
  }
  
  collapse() {
    if (!keyIsDown(LEFT_ARROW)) {
      return;
    }
    if (floor(random(10, 200)) == 14) {
      if (this.size > avgSize && this.size > 9) {
        let newBall = new Ball();
        totalBalls += 1;
        newBall.x = this.x;
        newBall.y = this.y;
        newBall.size = (this.size / 2) * 0.95;
        this.size /= 2;
        balls.push(newBall);
      }
    }
  }
  
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    
    // Repel off other balls
    for (let other of balls) {
      if (other.id != this.id) {
        let d = dist(this.x, this.y, other.x, other.y);
        let minDist = (this.size + other.size);

        // If balls are close, apply a repelling force
        if (d < minDist) {
          let angle = atan2(this.y - other.y, this.x - other.x);
          let repelForce = 0.05 * (minDist - d);
          repelForce *= 2;
          
          
          /*
          if (other.willJoin != -1) {
            other.willJoin -= 1;
            repelForce *= -2;
            if (other.willJoin == -1) {
              balls.splice(balls.indexOf(other), 1);
              totalBalls -= 1;
              this.size *= 2.1;
            }
          } 
          if (floor(random(1, 100)) == 5) {
            repelForce *= -2;
            other.willJoin = 1;
          }
          */
          
          this.x += cos(angle) * repelForce;
          this.y += sin(angle) * repelForce;
          this.xSpeed *= 0.99;
          this.ySpeed *= 0.99;
        }
      }
    }
    // Bounce off edges
    if (this.x < 0) {
      this.x = 0;
      this.xSpeed *= -1;
    } else if (this.x > width) {
      this.x = width;
      this.xSpeed *= -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.ySpeed *= -1;
    } else if (this.y > height) {
      this.y = height;
      this.ySpeed *= -1;
    }
  }
  
  display() {
    let col = map(this.size, 10, 40, 0, 255);  // Map size to color
    fill(col, 100, 255 - col);  // Vary color based on size
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}
