// Initialize the canvas and context
const canvas = document.getElementById('gameCanvas');
const canvasContext = canvas.getContext('2d');
const GRID_SIZE = 20;
const GRID_WIDTH = canvas.width / GRID_SIZE;
const GRID_HEIGHT = canvas.height / GRID_SIZE;

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
  canvasContext.fillStyle = snakeColorInput.value;
});

function drawBackground() {
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      canvasContext.fillStyle = (i + j) % 2 === 0 ? 'white' : 'rgba(0, 0, 0, 0.1)';
      canvasContext.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  }
}

function getRandomColor() {
  const colors = ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#800080', '#C0C0C0', '#808080', '#808000', '#008080', '#800000', '#008000', '#000080', '#00FFFF', '#FF00FF', '#FFFF00', '#808000', '#008080', '#800080', '#808080', '#C0C0C0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawSnake() {
  canvasContext.fillStyle = snakeColorInput.value;
  snake.forEach((segment) => {
    canvasContext.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  });
}

function drawFood() {

  // Draw the food circle
  canvasContext.fillStyle = foodColor;
  canvasContext.beginPath();
  canvasContext.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2, 0, 2 * Math.PI);
  canvasContext.fill();
}

function drawTongue() {
  canvasContext.fillStyle = 'red';
  canvasContext.fillRect(tongue.x * GRID_SIZE, tongue.y * GRID_SIZE, GRID_SIZE / 2, GRID_SIZE / 2);
}

function updateTongue() {
tongue.x += tongue.dx;
  tongue.y += tongue.dy;

  if (tongue.x < 0 || tongue.x >= GRID_WIDTH || tongue.y < 0 || tongue.y >= GRID_HEIGHT) {
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
  let newX, newY;
  do {
    newX = Math.floor(Math.random() * GRID_WIDTH);
    newY = Math.floor(Math.random() * GRID_HEIGHT);
  } while (snake.some((segment) => segment.x === newX && segment.y === newY));
  food = { x: newX, y: newY };
}

function checkCollision() {
  return snake[0].x < 0 || snake[0].x >= GRID_WIDTH || snake[0].y < 0 || snake[0].y >= GRID_HEIGHT || snake.some((segment, index) => index !== 0 && segment.x === snake[0].x && segment.y === snake[0].y);
  
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
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  direction = { x: 1, y: 0 };
  scoreElement.innerText = `Score: ${score}`;
  generateFood();
}


function gameLoop() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
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
    }, 80);
  }
}

playButton.addEventListener('click', () => {
  const gameOverMessageElement = document.getElementById('game-over-message');
  gameOverMessageElement.parentNode.removeChild(gameOverMessageElement);
  // Restart the game
  score = 0; // Reset the score
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
