// Ball.tsx

class Ball {
  private ctx: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public radius: number;
  public dx: number;
  public dy: number;
  public speed: number;
  // public score1: number = 0;
  // public score2: number = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    dx: number,
    dy: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
  }

  move() {
    // Calculate the future position of the ball
    // const futureX = this.x + this.dx;
    // const futureY = this.y + this.dy;

    // Check for collisions with the top and bottom walls
    // if (futureY - this.radius <= 0) {
    //   // Collision with the top wall
    //   this.dy = -this.dy; // Reverse Y velocity
    //   this.y = this.radius; // Position just outside the wall
    // } else if (futureY + this.radius >= this.ctx.canvas.height) {
    //   // Collision with the bottom wall
    //   this.dy = -this.dy; // Reverse Y velocity
    //   this.y = this.ctx.canvas.height - this.radius; // Position just outside the wall
    // } else {
    //   // No collision with the walls, so update the position
    //   this.x = futureX;
    //   this.y = futureY;
    // }
    this.x += this.dx;
    this.y += this.dy;

    // // Bounce off the walls
    // if (
    //   this.x + this.radius > this.ctx.canvas.width ||
    //   this.x - this.radius < 0
    // ) {
    //   this.dx = -this.dx;
    // }
    // if (
    //   this.y + this.radius > this.ctx.canvas.height ||
    //   this.y - this.radius < 0
    // ) {
    //   this.dy = -this.dy;
    // }
  }
}

export default Ball;
