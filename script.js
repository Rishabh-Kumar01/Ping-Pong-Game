class PingPong {
  constructor() {
    // Game elements
    this.ball = document.getElementById("ball");
    this.playerPaddle = document.getElementById("playerPaddle");
    this.computerPaddle = document.getElementById("computerPaddle");
    this.container = document.getElementById("gameContainer");
    this.playerScoreElement = document.getElementById("playerScore");
    this.computerScoreElement = document.getElementById("computerScore");
    this.startButton = document.getElementById("startButton");

    // Game state
    this.ballSpeed = 5;
    this.ballX = this.container.clientWidth / 2;
    this.ballY = this.container.clientHeight / 2;
    this.ballDirectionX = 1;
    this.ballDirectionY = 1;
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameInterval = null;
    this.playerPaddleY = 160;
    this.computerPaddleY = 160;
    this.paddleSpeed = 8;
    this.isGameRunning = false;

    // Event listeners
    document.addEventListener("mousemove", (e) => this.movePlayerPaddle(e));
    this.startButton.addEventListener("click", () => this.startGame());

    // Initial paddle positions
    this.resetPositions();
  }

  resetPositions() {
    // Reset ball position
    this.ballX = this.container.clientWidth / 2;
    this.ballY = this.container.clientHeight / 2;
    this.ballDirectionX = Math.random() > 0.5 ? 1 : -1;
    this.ballDirectionY = Math.random() > 0.5 ? 1 : -1;

    // Reset paddle positions
    this.playerPaddleY = 160;
    this.computerPaddleY = 160;

    // Update elements
    this.updateElements();
  }

  movePlayerPaddle(e) {
    const containerRect = this.container.getBoundingClientRect();
    const relativeY = e.clientY - containerRect.top;

    // Keep paddle within container bounds
    if (
      relativeY >= 0 &&
      relativeY <= containerRect.height - this.playerPaddle.clientHeight
    ) {
      this.playerPaddleY = relativeY;
    }
  }

  moveComputerPaddle() {
    const paddleCenter =
      this.computerPaddleY + this.computerPaddle.clientHeight / 2;
    const ballCenter = this.ballY;

    if (paddleCenter < ballCenter - 10) {
      this.computerPaddleY += this.paddleSpeed;
    } else if (paddleCenter > ballCenter + 10) {
      this.computerPaddleY -= this.paddleSpeed;
    }

    // Keep paddle within container bounds
    if (this.computerPaddleY < 0) {
      this.computerPaddleY = 0;
    } else if (
      this.computerPaddleY >
      this.container.clientHeight - this.computerPaddle.clientHeight
    ) {
      this.computerPaddleY =
        this.container.clientHeight - this.computerPaddle.clientHeight;
    }
  }

  updateElements() {
    // Update ball position
    this.ball.style.left = `${this.ballX}px`;
    this.ball.style.top = `${this.ballY}px`;

    // Update paddle positions
    this.playerPaddle.style.top = `${this.playerPaddleY}px`;
    this.computerPaddle.style.top = `${this.computerPaddleY}px`;

    // Update scores
    this.playerScoreElement.textContent = this.playerScore;
    this.computerScoreElement.textContent = this.computerScore;
  }

  checkCollision() {
    // Ball collision with top and bottom walls
    if (
      this.ballY <= 0 ||
      this.ballY >= this.container.clientHeight - this.ball.clientHeight
    ) {
      this.ballDirectionY *= -1;
    }

    // Ball collision with paddles
    const playerPaddleRect = this.playerPaddle.getBoundingClientRect();
    const computerPaddleRect = this.computerPaddle.getBoundingClientRect();
    const ballRect = this.ball.getBoundingClientRect();

    if (
      ballRect.left <= playerPaddleRect.right &&
      ballRect.top + ballRect.height >= playerPaddleRect.top &&
      ballRect.bottom - ballRect.height <= playerPaddleRect.bottom
    ) {
      this.ballDirectionX = 1;
      this.increaseBallSpeed();
    }

    if (
      ballRect.right >= computerPaddleRect.left &&
      ballRect.top + ballRect.height >= computerPaddleRect.top &&
      ballRect.bottom - ballRect.height <= computerPaddleRect.bottom
    ) {
      this.ballDirectionX = -1;
      this.increaseBallSpeed();
    }
  }

  increaseBallSpeed() {
    this.ballSpeed += 0.2;
  }

  updateGame() {
    // Move ball
    this.ballX += this.ballSpeed * this.ballDirectionX;
    this.ballY += this.ballSpeed * this.ballDirectionY;

    // Check for scoring
    if (this.ballX <= 0) {
      this.computerScore++;
      this.resetPositions();
    } else if (
      this.ballX >=
      this.container.clientWidth - this.ball.clientWidth
    ) {
      this.playerScore++;
      this.resetPositions();
    }

    // Move computer paddle
    this.moveComputerPaddle();

    // Check for collisions
    this.checkCollision();

    // Update visual elements
    this.updateElements();
  }

  startGame() {
    if (!this.isGameRunning) {
      this.isGameRunning = true;
      this.startButton.textContent = "Reset Game";
      this.gameInterval = setInterval(() => this.updateGame(), 1000 / 60);
    } else {
      // Reset game
      this.isGameRunning = false;
      this.startButton.textContent = "Start Game";
      clearInterval(this.gameInterval);
      this.ballSpeed = 5;
      this.playerScore = 0;
      this.computerScore = 0;
      this.resetPositions();
    }
  }
}

// Initialize the game
const game = new PingPong();
