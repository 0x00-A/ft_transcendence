import Ball from './Ball';
import Paddle from './Paddle';

// Utility function to check if two line segments intersect
function doLineSegmentsIntersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): boolean {
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // Lines are parallel if the denominator is 0
  if (denominator === 0) return false;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

// Function to check if the ball collides with the paddle (even at high speed)
export function isCollidingWithPaddle(ball: Ball, paddle: Paddle): boolean {
  // Previous and current position of the ball
  const nextX = ball.x + ball.dx;
  const nextY = ball.y + ball.dy;

  // Paddle edges as line segments
  const paddleLeft = paddle.x;
  const paddleRight = paddle.x + paddle.width;
  const paddleTop = paddle.y;
  const paddleBottom = paddle.y + paddle.height;

  // Check for intersection with paddle's vertical sides (left and right)
  const intersectsLeft = doLineSegmentsIntersect(
    ball.x,
    ball.y,
    nextX,
    nextY, // Ball's movement path
    paddleLeft,
    paddleTop,
    paddleLeft,
    paddleBottom // Left side of the paddle
  );

  const intersectsRight = doLineSegmentsIntersect(
    ball.x,
    ball.y,
    nextX,
    nextY, // Ball's movement path
    paddleRight,
    paddleTop,
    paddleRight,
    paddleBottom // Right side of the paddle
  );

  // Check for intersection with paddle's horizontal sides (top and bottom)
  const intersectsTop = doLineSegmentsIntersect(
    ball.x,
    ball.y,
    nextX,
    nextY, // Ball's movement path
    paddleLeft,
    paddleTop,
    paddleRight,
    paddleTop // Top side of the paddle
  );

  const intersectsBottom = doLineSegmentsIntersect(
    ball.x,
    ball.y,
    nextX,
    nextY, // Ball's movement path
    paddleLeft,
    paddleBottom,
    paddleRight,
    paddleBottom // Bottom side of the paddle
  );

  // Return true if any of the paddle's edges intersect with the ball's path
  return intersectsLeft || intersectsRight || intersectsTop || intersectsBottom;
}

export const handlePaddleCollision = (ball: Ball, paddle: Paddle) => {
  // Check if the ball is hitting the top/bottom or the sides
  const ballFromLeft = ball.x < paddle.x;
  const ballFromRight = ball.x > paddle.x + paddle.width;

  const ballFromTop = ball.y < paddle.y;
  const ballFromBottom = ball.y > paddle.y + paddle.height;

  // Handle side collision
  if (ballFromLeft || ballFromRight) {
    // Correct the position so the ball doesn't get stuck inside the paddle
    if (ballFromLeft) {
      ball.x = paddle.x - ball.radius;
    } else if (ballFromRight) {
      ball.x = paddle.x + paddle.width + ball.radius;
    }

    ball.dx *= -1; // Reverse the horizontal velocity

    const relativeImpact =
      (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    const maxBounceAngle = Math.PI / 4; // 45 degrees maximum bounce angle

    // Calculate new angle based on relative impact
    const newAngle = relativeImpact * maxBounceAngle;

    // Update ball's velocity (dx, dy) based on the new angle
    const direction = ball.dx > 0 ? 1 : -1;
    const speed = ball.speed;
    ball.dx = direction * speed * Math.cos(newAngle); // Horizontal velocity
    ball.dy = speed * Math.sin(newAngle); // Vertical velocity
  }

  // Handle top/bottom collision
  if (ballFromTop || ballFromBottom) {
    ball.dy *= -1; // Reverse the vertical velocity
    // Correct the position so the ball doesn't get stuck inside the paddle
    // if (ballFromTop) {
    //   ball.y = paddle.y - ball.radius; // Place the ball just above the top of the paddle
    // } else if (ballFromBottom) {
    //   ball.y = paddle.y + paddle.height + ball.radius; // Place the ball just below the bottom of the paddle
    // }
  }
};
