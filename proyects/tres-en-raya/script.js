class TicTacToe {
  constructor() {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.currentPlayer = "X";
    this.gameActive = true;
    this.scores = {
      X: 0,
      O: 0,
      draws: 0,
    };
    this.playerX = "";
    this.playerO = "";
    this.players = this.loadPlayers();
    this.gameHistory = this.loadGameHistory();
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    this.initializeEventListeners();
    this.showRegistrationModal();
  }
  loadPlayers() {
    const players = localStorage.getItem("ticTacToePlayers");
    return players ? JSON.parse(players) : {};
  }
  loadGameHistory() {
    const history = localStorage.getItem("ticTacToeHistory");
    return history ? JSON.parse(history) : [];
  }
  savePlayers() {
    localStorage.setItem("ticTacToePlayers", JSON.stringify(this.players));
  }
  saveGameHistory() {
    localStorage.setItem("ticTacToeHistory", JSON.stringify(this.gameHistory));
  }
  showRegistrationModal() {
    const modal = document.getElementById("registration-modal");
    modal.style.display = "flex";
  }
  initializeEventListeners() {
    const squares = document.querySelectorAll(".square");
    const restartBtn = document.getElementById("restart-btn");
    const scoreBtn = document.getElementById("score-btn");
    const closeScoreBtn = document.getElementById("close-score-btn");
    const scoreModal = document.getElementById("score-modal");
    const startGameBtn = document.getElementById("start-game-btn");
    const leaderboardBtn = document.getElementById("leaderboard-btn");
    const closeLeaderboardBtn = document.getElementById(
      "close-leaderboard-btn"
    );
    const searchBtn = document.getElementById("search-btn");
    const closeStatsBtn = document.getElementById("close-stats-btn");
    squares.forEach((square) => {
      square.addEventListener("click", (e) => this.handleSquareClick(e));
    });
    startGameBtn.addEventListener("click", () => this.startGame());
    restartBtn.addEventListener("click", () => this.restartGame());
    scoreBtn.addEventListener("click", () => this.showScoreModal());
    closeScoreBtn.addEventListener("click", () => this.hideScoreModal());
    leaderboardBtn.addEventListener("click", () => this.showLeaderboard());
    closeLeaderboardBtn.addEventListener("click", () => this.hideLeaderboard());
    searchBtn.addEventListener("click", () => this.searchPlayer());
    closeStatsBtn.addEventListener("click", () => this.hidePlayerStats());
  }
  startGame() {
    const playerXInput = document.getElementById("player-x");
    const playerOInput = document.getElementById("player-o");
    this.playerX = playerXInput.value.trim();
    this.playerO = playerOInput.value.trim();
    if (!this.playerX || !this.playerO) {
      alert("Por favor, ingresa los nombres de ambos jugadores");
      return;
    }
 
    if (!this.players[this.playerX]) {
      this.players[this.playerX] = { score: 0, gamesPlayed: 0 };
    }
    if (!this.players[this.playerO]) {
      this.players[this.playerO] = { score: 0, gamesPlayed: 0 };
    }
    document.getElementById("registration-modal").style.display = "none";
    this.updateStatus();
    this.savePlayers();
  }
  handleSquareClick(event) {
    const clickedSquare = event.target;
    const index = clickedSquare.dataset.index;
    if (this.board[index] !== "" || !this.gameActive) return;
    this.board[index] = this.currentPlayer;
    clickedSquare.textContent = this.currentPlayer;
    if (this.checkWinner()) {
      this.endGame(false);
    } else if (this.isDraw()) {
      this.endGame(true);
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      this.updateStatus();
    }
  }
  checkWinner() {
    return this.winningCombinations.some((combination) => {
      return combination.every((index) => {
        return this.board[index] === this.currentPlayer;
      });
    });
  }
  isDraw() {
    return this.board.every((square) => square !== "");
  }
  endGame(draw) {
    this.gameActive = false;
    const statusElement = document.getElementById("status");
    const currentPlayerName =
      this.currentPlayer === "X" ? this.playerX : this.playerO;
    const otherPlayerName =
      this.currentPlayer === "X" ? this.playerO : this.playerX;
    let gameResult = {
      date: new Date().toISOString(),
      playerX: this.playerX,
      playerO: this.playerO,
      result: "",
      winner: "",
    };
    if (draw) {
      statusElement.textContent = "¡Empate!";
      this.scores.draws++;
      gameResult.result = "draw";
     
      this.players[this.playerX].score += 3;
      this.players[this.playerO].score += 3;
    } else {
      statusElement.textContent = `¡${currentPlayerName} Gana!`;
      this.scores[this.currentPlayer]++;
      gameResult.result = "win";
      gameResult.winner = currentPlayerName;
    
      this.players[currentPlayerName].score += 5; // Victoria
      this.players[otherPlayerName].score -= 2; // Derrota
    }
  
    this.players[this.playerX].gamesPlayed++;
    this.players[this.playerO].gamesPlayed++;
 
    this.gameHistory.push(gameResult);
    this.highlightWinningCombination();
    this.updateScoreDisplay();
    this.savePlayers();
    this.saveGameHistory();
  }
  highlightWinningCombination() {
    this.winningCombinations.forEach((combination) => {
      if (
        combination.every((index) => this.board[index] === this.currentPlayer)
      ) {
        combination.forEach((index) => {
          document
            .querySelector(`[data-index="${index}"]`)
            .classList.add("winning-square");
        });
      }
    });
  }
  restartGame() {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.gameActive = true;
    this.currentPlayer = "X";
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.textContent = "";
      square.classList.remove("winning-square");
    });
    this.showRegistrationModal();
    this.updateStatus();
  }
  updateStatus() {
    const statusElement = document.getElementById("status");
    const currentPlayerName =
      this.currentPlayer === "X" ? this.playerX : this.playerO;
    statusElement.textContent = `Turno de ${currentPlayerName}`;
  }
  updateScoreDisplay() {
    document.getElementById("x-score").textContent = this.scores.X;
    document.getElementById("o-score").textContent = this.scores.O;
    document.getElementById("draw-score").textContent = this.scores.draws;
    document.getElementById("player-x-name").textContent = `${this.playerX}:`;
    document.getElementById("player-o-name").textContent = `${this.playerO}:`;
  }
  showScoreModal() {
    const scoreModal = document.getElementById("score-modal");
    scoreModal.classList.remove("hidden");
    scoreModal.classList.add("flex");
  }
  hideScoreModal() {
    const scoreModal = document.getElementById("score-modal");
    scoreModal.classList.remove("flex");
    scoreModal.classList.add("hidden");
  }
  showLeaderboard() {
    const modal = document.getElementById("leaderboard-modal");
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    const sortedPlayers = Object.entries(this.players)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.score - a.score);
    sortedPlayers.forEach((player, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
<td class="px-6 py-4 whitespace-nowrap text-center" id="cols-tab">${
        index + 1
      }</td>
<td class="px-6 py-4 whitespace-nowrap text-center" id="cols-tab">${
        player.name
      }</td>
<td class="px-6 py-4 whitespace-nowrap text-center" id="cols-tab"> ${
        player.score
      }</td>
<td class="px-6 py-4 whitespace-nowrap text-center" id="cols-tab" >${
        player.gamesPlayed
      }</td>
`;
      tbody.appendChild(row);
    });
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  hideLeaderboard() {
    const modal = document.getElementById("leaderboard-modal");
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
  searchPlayer() {
    const searchInput = document.getElementById("player-search");
    const playerName = searchInput.value.trim();
    const modal = document.getElementById("player-stats-modal");
    const content = document.getElementById("player-stats-content");
    if (!playerName || !this.players[playerName]) {
      alert("Jugador no encontrado");
      return;
    }
    const playerStats = this.players[playerName];
    const playerGames = this.gameHistory.filter(
      (game) => game.playerX === playerName || game.playerO === playerName
    );
    let statsHtml = `
        <div class="mb-4">
        <h3 class="text-xl font-bold">Estadísticas de ${playerName}</h3>
        <p>Puntaje total: ${playerStats.score}</p>
        <p>Partidas jugadas: ${playerStats.gamesPlayed}</p>
        </div>
        <div class="mb-4">
        <h3 class="text-lg font-bold">Historial de partidas:</h3>
        <ul class="list-disc pl-5">
        `;
    playerGames.forEach((game) => {
      const date = new Date(game.date).toLocaleString();
      let resultText = "";
      if (game.result === "draw") {
        resultText = "Empate";
      } else if (game.winner === playerName) {
        resultText = "Victoria";
      } else {
        resultText = "Derrota";
      }
      statsHtml += `
            <li class="mb-2">
            ${date}<br>
            vs ${game.playerX === playerName ? game.playerO : game.playerX}<br>
            Resultado: ${resultText}
            </li>
            `;
    });
    statsHtml += "</ul></div>";
    content.innerHTML = statsHtml;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  hidePlayerStats() {
    const modal = document.getElementById("player-stats-modal");
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
}

const game = new TicTacToe();
