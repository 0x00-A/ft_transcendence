"use strict";

interface IBall {
  x: number;
  y: number;
  raduis: number;
  vx: number;
  vy: number;
  s: number;
}
interface IPaddle {
  x: number;
  y: number;
  w: number;
  h: number;
  s: number;
  dy: number;
}

class Ball implements IBall {
  x: number;
  y: number;
  raduis: number;
  vx: number;
  vy: number;
  s: number;

  constructor(x: number, y: number, raduis: number) {
    const initialAngle = (Math.random() * Math.PI) / 2 - Math.PI / 4; // Random angle between -45° and 45°
    const ballSpeed = 3;

    // Initial random direction towards a player
    const serveDirection = Math.random() < 0.5 ? 1 : -1; // 1 = right (Player 2), -1 = left (Player 1)
    let ballDx = serveDirection * ballSpeed * Math.cos(initialAngle);
    let ballDy = ballSpeed * Math.sin(initialAngle);

    this.x = x;
    this.y = y;
    this.raduis = raduis;
    this.vy = ballDy;
    this.vx = ballDx;
    this.s = Math.abs(Math.sqrt(this.vx * this.vx + this.vy * this.vy));
  }
  initialize(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
class Paddle implements IPaddle {
  x: number;
  y: number;
  w: number;
  h: number;
  s: number;
  dy: number;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    s: number,
    dy: number
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.dy = dy;
  }
  initialize(y: number) {
    this.y = y;
  }
}

const paddleX = 50;
const paddleY = 150;
const paddleWidth = 10;
const paddleHeight = 80;
const cornerRadius = 10;

let incS = 0;

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  { x, y, w: width, h: height }: Paddle,
  isLeftPaddle: boolean
) {
  ctx.beginPath();

  if (isLeftPaddle) {
    // For the left paddle, round the top-left and bottom-left corners
    ctx.moveTo(x + cornerRadius, y); // Move to the top-left corner

    // Top edge
    ctx.lineTo(x + width, y); // Line to top-right corner
    ctx.lineTo(x + width, y + height); // Line to bottom-right corner

    // Bottom edge
    ctx.lineTo(x + cornerRadius, y + height); // Line to just before bottom-left corner
    ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius); // Bottom-left corner

    // Left edge
    ctx.lineTo(x, y + cornerRadius); // Line up the left edge
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius); // Top-left corner
  } else {
    // For the right paddle, round the top-right and bottom-right corners
    ctx.moveTo(x, y); // Move to the top-left corner

    // Top edge
    ctx.lineTo(x + width - cornerRadius, y); // Line to just before top-right corner
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius); // Top-right corner

    // Right edge
    ctx.lineTo(x + width, y + height - cornerRadius); // Line down the right edge
    ctx.arcTo(
      x + width,
      y + height,
      x + width - cornerRadius,
      y + height,
      cornerRadius
    ); // Bottom-right corner

    // Bottom edge
    ctx.lineTo(x, y + height); // Line to bottom-left corner

    // Left edge
    ctx.lineTo(x, y); // Back to the starting point (top-left corner)
  }

  ctx.closePath();
  ctx.fillStyle = "#000"; // Set paddle color
  ctx.fill();
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = <HTMLCanvasElement | null>document.getElementById("canvas");
  const ctx = canvas?.getContext("2d");

  const coordinateWidth = 800; // Virtual coordinate width
  const coordinateHeight = 400; // Virtual coordinate height

  const pW = 10;
  const pH = 100;
  const ballRaduis = 8;
  let score1 = 0,
    score2 = 0;

  if (ctx && canvas) {
    let path: { x: number; y: number }[] = [];
    const resizeCanvas = () => {
      const rect = (canvas.parentNode as Element)?.getBoundingClientRect();

      // Get the computed styles of the parent to calculate border width
      const computedStyle = window.getComputedStyle(
        canvas.parentNode as Element
      );
      const borderLeft = parseFloat(computedStyle.borderLeftWidth);
      const borderRight = parseFloat(computedStyle.borderRightWidth);
      const borderTop = parseFloat(computedStyle.borderTopWidth);
      const borderBottom = parseFloat(computedStyle.borderBottomWidth);

      // Set canvas width and height by subtracting borders from parent width and height
      canvas.width = rect.width - borderLeft - borderRight + 1;
      canvas.height = rect.height - borderTop - borderBottom + 1;

      const pixelRatio = window.devicePixelRatio || 1;

      // Set transformation
      //   ctx.setTransform(
      //     (canvas.width / coordinateWidth) * pixelRatio,
      //     0,
      //     0,
      //     (canvas.height / coordinateHeight) * pixelRatio,
      //     0,
      //     0
      //   );

      //   paddle1.initialize(10, canvas.height / 2 - pH / 2);
      //   paddle2.initialize(canvas.width - 10 - pW, canvas.height / 2 - pH / 2);
      console.log("resized");
    };

    resizeCanvas();
    canvas.style.background = "#ff3fff";

    window.addEventListener("resize", () => {
      resizeCanvas();
    });

    let ball: Ball = new Ball(
      canvas.width / 2 - 7,
      canvas.height / 2 - 7,
      ballRaduis
    );
    let paddle1: Paddle = new Paddle(
      10,
      canvas.height / 2 - pH / 2,
      pW,
      pH,
      5,
      0
    );
    let paddle2: Paddle = new Paddle(
      canvas.width - 10 - pW,
      canvas.height / 2 - pH / 2,
      pW,
      pH,
      5,
      0
    );

    const resetGame = () => {
      resetBall();
      paddle1.initialize(canvas.height / 2 - pH / 2);
      paddle2.initialize(canvas.height / 2 - pH / 2);
    };

    const resetBall = () => {
      ball.x = ball.vx > 0 ? (3 * canvas.width) / 4 : canvas.width / 4;
      ball.y = canvas.height / 2;
      ball.vx *= -1; // Switch direction of the serve
      ball.vy = (Math.random() - 0.5) * 6;
      // incS = 0;
    };

    const drawBall = (ball: Ball) => {
      ctx.beginPath();
      ctx.fillStyle = "#ffffaa";
      ctx.strokeStyle = "#ffbbcc";
      ctx.arc(ball.x, ball.y, ball.raduis, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      path.push({ x: ball.x, y: ball.y });
    };

    // const drawPaddle = (paddle: Paddle) => {
    //   ctx.beginPath();
    //   ctx.fillStyle = "#111111";
    //   ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    // };

    function isCollidingWithPaddle(ball: Ball, paddle: Paddle): boolean {
      // Check if the ball is within the horizontal range of the paddle
      const withinHorizontalRange =
        ball.x + ball.raduis >= paddle.x &&
        ball.x - ball.raduis <= paddle.x + paddle.w;

      // Check if the ball is within the vertical range of the paddle
      const withinVerticalRange =
        ball.y + ball.raduis >= paddle.y &&
        ball.y - ball.raduis <= paddle.y + paddle.h;

      // Collision occurs only if both the horizontal and vertical ranges are overlapping
      return withinHorizontalRange && withinVerticalRange;
    }

    const handlePaddleCollision = (ball: Ball, paddle: Paddle) => {
      // Check if the ball is hitting the top/bottom or the sides
      const ballFromLeft = ball.x < paddle.x;
      const ballFromRight = ball.x > paddle.x + paddle.w;

      const ballFromTop = ball.y < paddle.y;
      const ballFromBottom = ball.y > paddle.y + paddle.h;

      // Handle side collision
      if (ballFromLeft || ballFromRight) {
        // Correct the position so the ball doesn't get stuck inside the paddle
        if (ballFromLeft) {
          ball.x = paddle.x - ball.raduis; // Place the ball just outside the left side of the paddle
        } else if (ballFromRight) {
          ball.x = paddle.x + paddle.w + ball.raduis; // Place the ball just outside the right side of the paddle
        }

        ball.vx *= -1; // Reverse the horizontal velocity

        const relativeImpact =
          (ball.y - (paddle.y + paddle.h / 2)) / (paddle.h / 2);
        const maxBounceAngle = Math.PI / 4; // 45 degrees maximum bounce angle

        // Calculate new angle based on relative impact
        const newAngle = relativeImpact * maxBounceAngle;

        // Update ball's velocity (dx, dy) based on the new angle
        const direction = ball.vx > 0 ? 1 : -1;
        const speed = ball.s;
        ball.vx = direction * speed * Math.cos(newAngle); // Horizontal velocity
        ball.vy = speed * Math.sin(newAngle); // Vertical velocity
      }

      // Handle top/bottom collision
      if (ballFromTop || ballFromBottom) {
        ball.vy *= -1; // Reverse the vertical velocity
        // Correct the position so the ball doesn't get stuck inside the paddle
        if (ballFromTop) {
          ball.y = paddle.y - ball.raduis; // Place the ball just above the top of the paddle
        } else if (ballFromBottom) {
          ball.y = paddle.y + paddle.h + ball.raduis; // Place the ball just below the bottom of the paddle
        }
      }
      // increaseBallSpeed(ball);
      // applyBallSpin(ball)
    };

    const moveBall = (ball: Ball) => {
      // move the ball
      ball.initialize((ball.x += ball.vx), (ball.y += ball.vy));

      // next move top and bottom collision
      let newX = ball.x + ball.vx + (ball.vx > 0 ? ball.raduis : -ball.raduis);
      let newY = ball.y + ball.vy + (ball.vy > 0 ? ball.raduis : -ball.raduis);
      // reverse the ball direction
      if (newY >= canvas.height || newY <= 0) ball.vy *= -1;

      // if (newX >= canvas.width || newX <= 0) ball.vx *= -1;

      // left and right collision
      if (newX >= canvas.width) {
        score1 += 1;
        resetGame();
      } else if (newX <= 0) {
        score2 += 1;
        resetGame();
      }

      // paddle collision
      if (isCollidingWithPaddle(ball, paddle1)) {
        // Handle collision, like reversing the ball's direction
        // ball.vx *= -1; // Reverse horizontal direction on collision
        handlePaddleCollision(ball, paddle1);
      }
      if (isCollidingWithPaddle(ball, paddle2)) {
        handlePaddleCollision(ball, paddle2);
      }
    };

    const movePaddle = (p: Paddle) => {
      p.y += p.dy;
      if (p.y < 0) p.y = 0;
      else if (p.y + p.h > canvas.height) p.y = canvas.height - p.h;
    };

    const drawPath = () => {
      ctx.beginPath();
      ctx.fillStyle = "#111111";
      path.forEach((v) => ctx.fillRect(v.x, v.y, 1, 1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w") paddle1.dy = -paddle1.s;
      if (e.key === "s") paddle1.dy = paddle1.s;
      // if (e.key === "ArrowUp") paddle2.dy = -paddle2.s;
      // if (e.key === "ArrowDown") paddle2.dy = paddle2.s;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "s") paddle1.dy = 0;
      // if (e.key === "ArrowUp" || e.key === "ArrowDown") paddle2.dy = 0;
    };

    const player1AI = (ball: Ball, paddle: Paddle, s: number = 12) => {
      if (ball.vx < 0) {
        if (ball.y < paddle.y + paddle.h / 2) paddle.y -= s;
        if (paddle.y <= 0) paddle.y = 0;

        if (ball.y > paddle.y + paddle.h / 2) paddle.y += s;
        if (paddle.y + paddle.h >= canvas.height)
          paddle.y = canvas.height - paddle.h;
      }
    };
    const player2AI = (ball: Ball, paddle: Paddle, s: number = 12) => {
      if (ball.vx > 0) {
        if (ball.y < paddle.y + paddle.h / 2) paddle.y -= s;
        if (paddle.y <= 0) paddle.y = 0;

        if (ball.y > paddle.y + paddle.h / 2) paddle.y += s;
        if (paddle.y + paddle.h >= canvas.height)
          paddle.y = canvas.height - paddle.h;
      }
    };

    function increaseBallSpeed(ball: Ball) {
      // const speedIncrease = 0.001; // Increment ball speed
      // incS += speedIncrease;
      // ball.s += incS;
      // ball.vx += ball.vx > 0 ? speedIncrease : -speedIncrease;
      // ball.vy += ball.vy > 0 ? speedIncrease : -speedIncrease;
    }

    function applyBallSpin(ball: Ball) {
      if (Math.random() < 0.1) {
        // 10% chance of spin
        ball.vx += (Math.random() - 0.5) * 0.5; // Random small variation in direction
      }
    }

    const updateGame = () => {
      moveBall(ball);
      movePaddle(paddle1);
      // movePaddle(paddle2);
      // player1AI(ball, paddle1);
      player2AI(ball, paddle2);
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateGame();

      drawBall(ball);
      drawPaddle(ctx, paddle1, true);
      drawPaddle(ctx, paddle2, false);
      // drawPath();
      let x = requestAnimationFrame(gameLoop);
      console.log(`${score1} - ${score2}`);
    };
    // setInterval(gameLoop, 60)

    window.addEventListener("keydown", (e) => handleKeyDown(e));
    window.addEventListener("keyup", (e) => handleKeyUp(e));
    gameLoop();

    // window.removeEventListener("resize", resizeCanvas);
  }
});
