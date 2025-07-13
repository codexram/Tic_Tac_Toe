// Game State Management
class TicTacToeGame {
  constructor() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'O';
    this.gameActive = true;
    this.moveHistory = [];
    this.scores = {
      X: 0,
      O: 0,
      draws: 0
    };
    this.gamesPlayed = 0;
    this.initializeElements();
    this.bindEvents();
    this.updateUI();
  }

  initializeElements() {
    this.boxes = document.querySelectorAll('.box');
    this.resetBtn = document.querySelector('#reset-btn');
    this.undoBtn = document.querySelector('#undo-btn');
    this.hintBtn = document.querySelector('#hint-btn');
    this.newGameBtn = document.querySelector('#new-btn');
    this.homeBtn = document.querySelector('#home-btn');
    this.modalOverlay = document.querySelector('#modalOverlay');
    this.modalTitle = document.querySelector('#modalTitle');
    this.modalMessage = document.querySelector('#modalMessage');
    this.currentTurnElement = document.querySelector('#currentTurn');
    this.scoreXElement = document.querySelector('#scoreX');
    this.scoreOElement = document.querySelector('#scoreO');
    this.scoreDrawsElement = document.querySelector('#scoreDraws');
    this.gamesPlayedElement = document.querySelector('#gamesPlayed');
    this.winRateElement = document.querySelector('#winRate');
  }

  bindEvents() {
    this.boxes.forEach((box, index) => {
      box.addEventListener('click', () => this.handleBoxClick(index));
    });

    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.undoBtn.addEventListener('click', () => this.undoMove());
    this.hintBtn.addEventListener('click', () => this.showHint());
    this.newGameBtn.addEventListener('click', () => this.newGame());
    this.homeBtn.addEventListener('click', () => this.resetScores());
  }

  handleBoxClick(index) {
    if (!this.gameActive || this.board[index] !== '') return;

    // Add move to history
    this.moveHistory.push({
      index: index,
      player: this.currentPlayer,
      board: [...this.board]
    });

    // Make the move
    this.board[index] = this.currentPlayer;
    this.boxes[index].textContent = this.currentPlayer;
    this.boxes[index].classList.add('filled');

    // Add player-specific styling
    if (this.currentPlayer === 'X') {
      this.boxes[index].style.color = '#ff6b6b';
    } else {
      this.boxes[index].style.color = '#4ecdc4';
    }

    // Check for win or draw
    if (this.checkWinner()) {
      this.handleGameEnd('win');
    } else if (this.board.every(cell => cell !== '')) {
      this.handleGameEnd('draw');
    } else {
      this.switchPlayer();
    }

    this.updateUI();
  }

  checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        // Highlight winning cells
        pattern.forEach(index => {
          this.boxes[index].classList.add('winning');
        });
        return true;
      }
    }
    return false;
  }

  handleGameEnd(result) {
    this.gameActive = false;
    this.gamesPlayed++;

    if (result === 'win') {
      const winner = this.currentPlayer;
      this.scores[winner]++;
      this.showModal('Winner!', `Congratulations! Player ${winner} wins!`);
    } else {
      this.scores.draws++;
      this.showModal('Draw!', 'The game ended in a draw!');
    }

    this.updateStats();
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateTurnIndicator();
  }

  updateTurnIndicator() {
    const icon = this.currentTurnElement.querySelector('i');
    const text = this.currentTurnElement.querySelector('span');
    
    if (this.currentPlayer === 'X') {
      icon.className = 'fas fa-times';
      icon.style.color = '#ff6b6b';
      text.textContent = 'Player X';
    } else {
      icon.className = 'fas fa-circle';
      icon.style.color = '#4ecdc4';
      text.textContent = 'Player O';
    }
  }

  updateUI() {
    // Update scores
    this.scoreXElement.textContent = this.scores.X;
    this.scoreOElement.textContent = this.scores.O;
    this.scoreDrawsElement.textContent = this.scores.draws;

    // Update undo button state
    this.undoBtn.disabled = this.moveHistory.length === 0;

    // Update turn indicator
    this.updateTurnIndicator();
  }

  updateStats() {
    this.gamesPlayedElement.textContent = this.gamesPlayed;
    
    const totalWins = this.scores.X + this.scores.O;
    const winRate = this.gamesPlayed > 0 ? Math.round((totalWins / this.gamesPlayed) * 100) : 0;
    this.winRateElement.textContent = `${winRate}%`;
  }

  showModal(title, message) {
    this.modalTitle.textContent = title;
    this.modalMessage.textContent = message;
    this.modalOverlay.classList.remove('hide');
  }

  hideModal() {
    this.modalOverlay.classList.add('hide');
  }

  resetGame() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'O';
    this.gameActive = true;
    this.moveHistory = [];

    // Clear board
    this.boxes.forEach(box => {
      box.textContent = '';
      box.classList.remove('filled', 'winning');
      box.style.color = '';
    });

    this.hideModal();
    this.updateUI();
  }

  newGame() {
    this.resetGame();
  }

  resetScores() {
    this.scores = { X: 0, O: 0, draws: 0 };
    this.gamesPlayed = 0;
    this.resetGame();
    this.updateStats();
  }

  undoMove() {
    if (this.moveHistory.length === 0) return;

    const lastMove = this.moveHistory.pop();
    this.board = [...lastMove.board];
    this.currentPlayer = lastMove.player;
    this.gameActive = true;

    // Update board display
    this.boxes.forEach((box, index) => {
      box.textContent = this.board[index];
      box.classList.remove('filled', 'winning');
      
      if (this.board[index] === 'X') {
        box.style.color = '#ff6b6b';
      } else if (this.board[index] === 'O') {
        box.style.color = '#4ecdc4';
      } else {
        box.style.color = '';
      }
    });

    this.hideModal();
    this.updateUI();
  }

  showHint() {
    if (!this.gameActive) return;

    const bestMove = this.findBestMove();
    if (bestMove !== -1) {
      // Highlight the suggested move
      this.boxes[bestMove].style.boxShadow = '0 0 20px #ffd700';
      this.boxes[bestMove].style.transform = 'scale(1.1)';
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        this.boxes[bestMove].style.boxShadow = '';
        this.boxes[bestMove].style.transform = '';
      }, 2000);
    }
  }

  findBestMove() {
    // Simple AI: find the best available move
    const availableMoves = this.board
      .map((cell, index) => cell === '' ? index : -1)
      .filter(index => index !== -1);

    if (availableMoves.length === 0) return -1;

    // Check for winning move
    for (let move of availableMoves) {
      const testBoard = [...this.board];
      testBoard[move] = this.currentPlayer;
      if (this.checkWinningBoard(testBoard)) {
        return move;
      }
    }

    // Check for blocking move
    const opponent = this.currentPlayer === 'X' ? 'O' : 'X';
    for (let move of availableMoves) {
      const testBoard = [...this.board];
      testBoard[move] = opponent;
      if (this.checkWinningBoard(testBoard)) {
        return move;
      }
    }

    // Prefer center, then corners, then edges
    const movePriority = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (let priority of movePriority) {
      if (availableMoves.includes(priority)) {
        return priority;
      }
    }

    return availableMoves[0];
  }

  checkWinningBoard(board) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new TicTacToeGame();
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'r':
      case 'R':
        game.resetGame();
        break;
      case 'u':
      case 'U':
        if (!game.undoBtn.disabled) {
          game.undoMove();
        }
        break;
      case 'h':
      case 'H':
        game.showHint();
        break;
      case 'Escape':
        game.hideModal();
        break;
    }
  });

  // Add click outside modal to close
  document.querySelector('#modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
      game.hideModal();
    }
  });

  // Add sound effects (optional)
  const playSound = (type) => {
    // You can add sound effects here
    // For now, we'll just add a visual feedback
    console.log(`Playing ${type} sound`);
  };

  // Enhanced box click with sound
  game.boxes.forEach(box => {
    box.addEventListener('click', () => {
      playSound('click');
    });
  });
});