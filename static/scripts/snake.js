// Initialize the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

let direction = { x: 1, y: 0 };
let score = 0;
let food = { x: 0, y: 0 };
let foodColor = 'red';
let tongue = { x: snake[0].x, y: snake[0].y, dx: 0, dy: -1 };

const playButton = document.getElementById('playButton');
const scoreElement = document.getElementById('score');
const eatSound = document.getElementById('eatSound');
const snakeColorInput = document.getElementById('snake-color');

snakeColorInput.addEventListener('input', () => {
  ctx.fillStyle = snakeColorInput.value;
});

function drawBackground() {
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillStyle = 'white';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      }
      ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }
}

function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawSnake() {
  ctx.fillStyle = 'green';
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = snakeColorInput.value;
    }
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawTongue() {
  ctx.fillStyle = 'red';
  ctx.fillRect(tongue.x * gridSize, tongue.y * gridSize, gridSize / 2, gridSize / 2);
}

function updateTongue() {
  tongue.x += tongue.dx;
  tongue.y += tongue.dy;

  if (tongue.x < 0 || tongue.x >= gridWidth || tongue.y < 0 || tongue.y >= gridHeight) {
    tongue.dx = -tongue.dx;
    tongue.dy = -tongue.dy;
  }
}

function updateSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.innerText = `Score: ${score}`;
    eatSound.play();
    if (score % 10 === 0) {
      foodColor = getRandomColor();
    }
    generateFood();
  } else {
    snake.pop();
  }

  tongue.dx = direction.x;
  tongue.dy = direction.y;
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };
}

function checkCollision() {
  if (snake[0].x < 0 || snake[0].x >= gridWidth || snake[0].y < 0 || snake[0].y >= gridHeight) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function gameOver() {
  const gameOverMessageElement = document.createElement('div');
  gameOverMessageElement.id = 'game-over-message';
  gameOverMessageElement.innerText = 'Game Over!';
  gameOverMessageElement.style.position = 'absolute';
  gameOverMessageElement.style.top = '50%';
  gameOverMessageElement.style.left = '50%';
  gameOverMessageElement.style.transform = 'translate(-50%, -50%)';
  gameOverMessageElement.style.fontWeight = 'bold';
  gameOverMessageElement.style.fontSize = '24px';
  gameOverMessageElement.style.color = 'red';
  gameOverMessageElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
  gameOverMessageElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  gameOverMessageElement.style.padding = '10px 20px';
  gameOverMessageElement.style.borderRadius = '10px';

  const gameCanvasElement = document.getElementById('gameCanvas');
  gameCanvasElement.parentNode.insertBefore(gameOverMessageElement, gameCanvasElement.nextSibling);

  playButton.style.display = 'block';

  // Reset the score and position
  score = 0;
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  direction = { x: 1, y: 0 };
  scoreElement.innerText = `Score: ${score}`;
  generateFood();
}


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawSnake();
  drawFood();
  updateSnake();
  updateTongue();
  if (checkCollision()) {
    gameOver();
  } else {
    setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, 100);
  }
}

playButton.addEventListener('click', () => {
  const gameOverMessageElement = document.getElementById('game-over-message');
  gameOverMessageElement.parentNode.removeChild(gameOverMessageElement);
  // Restart the game
  score = 0;
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  direction = { x: 1, y: 0 };
  scoreElement.innerText = `Score: ${score}`;
  generateFood();
  gameLoop();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && direction.y!== 1) {
    direction = { x: 0, y: -1 };
  } else if (event.key === 'ArrowDown' && direction.y!== -1) {
    direction = { x: 0, y: 1 };
  } else if (event.key === 'ArrowLeft' && direction.x!== 1) {
    direction = { x: -1, y: 0 };
  } else if (event.key === 'ArrowRight' && direction.x!== -1) {
    direction = { x: 1, y: 0 };
  }
});
