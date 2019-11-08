const info = document.getElementById('info');
const startBtn = document.getElementById('btn-start');
const restartBtn = document.getElementById('btn-restart');
const modeBtn = document.getElementById('btn-mode');
// Get canvas element and create a 2d rec=ndering context from it
var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');
var ballRadius = 10;
// Declare starting position of ball
var x;
var y;
// Declare offset values
var dx;
var dy;
// Declare paddle dimensions
var paddleWidth;
var paddleHeight;
var paddleX;
// Declare Left and right controls values
var leftPressed;
var rightPressed;
// Declare brick related variables
var brickRowCount;
var brickColumnCount;
var brickWidth;
var brickHeight;
var brickPadding;
var brickOffsetLeft;
var brickOffsetTop;
// Declare score, lives and interval variables
var score;
var lives;
var interval;
var isDarkMode;
var gameLevel = 'level1';

// Draw a ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}
// Draw a paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}
// Draw bricks
function drawBricks() {
  for (var i = 0; i < brickColumnCount; i++) {
    for (var j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status === 1) {
        var brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
// Draw score
function drawScore() {
  ctx.font = '700 16px sans-serif';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20);
}
// Draw Lives count
function drawLives() {
  ctx.font = '700 16px sans-serif';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}
// Collision detection with bricks
function collisionDetection() {
  for (var i = 0; i < brickColumnCount; i++) {
    for (var j = 0; j < brickRowCount; j++) {
      var b = bricks[i][j];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickColumnCount * brickRowCount) {
            onGameOver('won');
          }
        }
      }
    }
  }
}
function draw() {
  // Clear the rect every time before drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  // Reset x and y offset values when they touch the rect walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // If ball is at the bottom end and touching the paddle
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // If ball is at the bottom end without touching the paddle
      lives--;
      // End game if lives are over
      if (!lives) {
        onGameOver('over');
      } else {
        // Reset ball offset values if lives are left
        //   x = canvas.width / 2;
        //   y = canvas.height - 30;
        dx = 2;
        dy = -2;
        //   paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  // Offset the x and y positions of the ball
  x += dx;
  y += dy;
  // Move the paddle left or right based on the key pressed
  if (leftPressed) {
    paddleX -= 10;
    if (paddleX < 0) {
      paddleX = 0;
    }
  } else if (rightPressed) {
    paddleX += 10;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
  // Reset lives to 0 in case its value becomes negative
  if (lives < 0) lives = 0;
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();
  drawLives();
}

// keydown and keyup handler methods
function onKeyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  }
  if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}
function onKeyUp(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  }
  if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}
// mousemove handler method
function onMouseMove(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function initializeGameSet() {
  info.style.display = 'none';
  ballRadius = 10;
  // Set starting position of ball
  x = canvas.width / 2;
  y = canvas.height - 30;
  // Set offset values
  dx = 2;
  dy = -2;
  // Set paddle dimensions
  paddleWidth = 75;
  paddleHeight = 10;
  paddleX = (canvas.width - paddleWidth) / 2;
  // Left and right controls values
  leftPressed = false;
  rightPressed = false;
  // Setting brick related variables
  if (gameLevel === 'level1') {
    brickRowCount = 3;
  } else if (gameLevel === 'level2') {
    brickRowCount = 5;
  } else if (gameLevel === 'level3') {
    brickRowCount = 7;
  }
  brickColumnCount = 5;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetLeft = 30;
  brickOffsetTop = 30;
  // Initializing bricks array
  bricks = [];
  for (var i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickRowCount; j++) {
      bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
  }
  // Set Score and lives variables
  score = 0;
  lives = 3;
  isDarkMode = false;
  draw();
}
function startGame() {
  initializeGameSet();
  startBtn.style.display = 'none';
  restartBtn.style.display = 'block';
  // Set interval to draw
  interval = setInterval(draw, 10);
}

function restartGame() {
  clearInterval(interval);
  startGame();
}
function onGameOver(message) {
  clearInterval(interval);
  info.style.display = 'block';
  var title = info.querySelector('h3');
  if (message === 'over') title.textContent = 'Game Over!';
  else title.textContent = 'Congratulations! You won!!';
  draw();
  startBtn.style.display = 'block';
  restartBtn.style.display = 'none';
}
function changeGameMode() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    modeBtn.textContent = 'Light Mode';
    canvas.style.backgroundColor = '#333';
  } else {
    modeBtn.textContent = 'Dark Mode';
    canvas.style.backgroundColor = '#eee';
  }
}

function onLevelChange(e) {
  gameLevel = e.value;
  initializeGameSet();
}

// function onResize(e) {
//   console.log(e);
//   if (document.documentElement.clientWidth < 576) {
//     console.log('width changed');
//     canvas.width = 300;
//   } else {
//     canvas.width = 480;
//   }
// }

function onTouchMove(e) {
  const relativeX = e.touches[0].clientX;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Event Listeners for keyup and keydown events
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
// Event listener for mouse move
document.addEventListener('mousemove', onMouseMove);
// Event listener for touch move
document.addEventListener('touchmove', onTouchMove);
// Event listener for window resize
// window.addEventListener('resize', onResize);
initializeGameSet();
