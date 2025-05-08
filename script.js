// script.js

// Select DOM elements
const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const restartBtn = document.getElementById('restartBtn');

// Game settings
const boardSize = 400;    // Board width/height in px (must match CSS .play-board)
const blockSize = 20;     // Size of snake segment and food (px)
let gameLoop = null;
let gameStarted = false;
let score = 0;

// Movement direction (x, y)
let direction = { x: 0, y: 0 };

// Snake and food data
let snake = [{ x: 200, y: 200 }]; // Start with one segment at center (200,200)
let food = { x: 100, y: 100 };    // Initial food position

// Sound effects (place your own .mp3 files in the project folder)
const eatSound = new Audio('eat-sound.mp3');       // Sound for eating food
const gameOverSound = new Audio('gameover.mp3');   // Sound for game over

// Draws the snake and food on the play board
function draw() {
  // Clear previous content
  playBoard.innerHTML = '';

  // Draw each snake segment
  snake.forEach(segment => {
    const snakePart = document.createElement('div');
    snakePart.style.left = segment.x + 'px';
    snakePart.style.top = segment.y + 'px';
    snakePart.classList.add('snake');
    playBoard.appendChild(snakePart);
});

// Draw the food block
const foodBlock = document.createElement('div');
foodBlock.style.left = food.x + 'px';
foodBlock.style.top = food.y + 'px';
foodBlock.classList.add('food');
playBoard.appendChild(foodBlock);
}

// Places the food at a random location on the board
function createFood() {
// Choose a random grid-aligned position
const randomX = Math.floor(Math.random() * (boardSize / blockSize)) * blockSize;
const randomY = Math.floor(Math.random() * (boardSize / blockSize)) * blockSize;
food = { x: randomX, y: randomY };
}

// The main game loop: moves the snake, checks collisions, etc.
function gameTick() {
// Calculate new head position
const headX = snake[0].x + direction.x;
const headY = snake[0].y + direction.y;
const newHead = { x: headX, y: headY };

// Wall collision (game over)
if (headX < 0 || headX >= boardSize || headY < 0 || headY >= boardSize) {
  endGame();
  return;
}

// Self-collision (game over)
for (let segment of snake) {
  if (newHead.x === segment.x && newHead.y === segment.y) {
    endGame();
    return;
  }
}

// Add new head to the snake
snake.unshift(newHead);

// Check if food is eaten
if (newHead.x === food.x && newHead.y === food.y) {
  score++;
  scoreElement.textContent = 'Score: ' + score;
  eatSound.play();   // Play eating sound effect
  createFood();      // Place new food
} else {
  // Remove tail segment if food not eaten
  snake.pop();
}

// Redraw snake and food
draw();
}

// Ends the game: stops loop, plays sound, shows alert
function endGame() {
clearInterval(gameLoop);
gameOverSound.play();  // Play game-over sound effect
alert('Game Over! Your score: ' + score);
}

// Handle keyboard input for direction and to start the game
document.addEventListener('keydown', event => {
// On first arrow key press, start the game loop
if (!gameStarted && (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight'
  )) {
  gameStarted = true;
  gameLoop = setInterval(gameTick, 150); // Adjust speed (ms)
}

// Change direction based on arrow keys (prevent reverse)
if ((event.key === 'ArrowUp' || event.key === 'w') && direction.y === 0) {
  direction = { x: 0, y: -blockSize };
} else if ((event.key === 'ArrowDown' || event.key === 's') && direction.y === 0) {
  direction = { x: 0, y: blockSize };
} else if ((event.key === 'ArrowLeft' || event.key === 'a') && direction.x === 0) {
  direction = { x: -blockSize, y: 0 };
} else if ((event.key === 'ArrowRight' || event.key === 'd') && direction.x === 0) {
  direction = { x: blockSize, y: 0 };
}
});

// Restart button: resets the game state
restartBtn.addEventListener('click', () => {
clearInterval(gameLoop);
 // Reset game variables
 snake = [{ x: 200, y: 200 }];
 direction = { x: 0, y: 0 };
 score = 0;
 gameStarted = false;
 scoreElement.textContent = 'Score: ' + score;
 createFood();  // New food placement
 draw();        // Draw initial state
});

// Initial draw so the snake is visible before the game starts
draw();