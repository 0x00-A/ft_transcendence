import Ball from './Ball';

class Paddle {
  private ctx: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public speed: number; // Speed of movement
  public dy: number = 0; // Vertical velocity (for moving up and down)
  public score: number = 0;
  public paddleHitPoint;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.paddleHitPoint = this.height / 4;
  }

  draw() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    // Update the y position by the current dy value
    this.y += this.dy;

    // Prevent the paddle from going off the canvas
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.height > this.ctx.canvas.height) {
      this.y = this.ctx.canvas.height - this.height;
    }
  }

  // Method to start moving the paddle in a direction
  moveUp() {
    this.dy = -this.speed;
  }

  moveDown() {
    this.dy = this.speed;
  }

  // Method to stop moving the paddle
  stop() {
    this.dy = 0;
  }

  ai(ball: Ball, isLeft: boolean = false) {
    if (isLeft && ball.dx < 0) {
      if (ball.y < this.y + this.paddleHitPoint) this.y -= this.speed;
      if (this.y <= 0) this.y = 0;

      if (ball.y > this.y + this.paddleHitPoint) this.y += this.speed;
      if (this.y + this.height >= this.ctx.canvas.height)
        this.y = this.ctx.canvas.height - this.height;
    } else if (!isLeft && ball.dx > 0) {
      if (ball.y < this.y + this.paddleHitPoint) this.y -= this.speed;
      if (this.y <= 0) this.y = 0;

      if (ball.y > this.y + this.paddleHitPoint) this.y += this.speed;
      if (this.y + this.height >= this.ctx.canvas.height)
        this.y = this.ctx.canvas.height - this.height;
    }
  }
}

export default Paddle;
