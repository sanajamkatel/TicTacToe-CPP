let gameState = {
    board: [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']],
    currentPlayer: 'X',
    gameOver: false,
    winner: ' ',
    winningLine: [],
    scores: { X: 0, O: 0, ties: 0 }
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    createBoard();
    updateGameState();
});

function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.id = `cell-${i}-${j}`;
            cell.onclick = () => makeMove(i, j);
            gameBoard.appendChild(cell);
        }
    }
}

async function makeMove(row, col) {
    if (gameState.gameOver || gameState.board[row][col] !== ' ') {
        return;
    }

    try {
        const response = await fetch('/api/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ row: row, col: col })
        });

        if (response.ok) {
            const data = await response.json();
            gameState = data;
            updateGameState();
        }
    } catch (error) {
        console.error('Error making move:', error);
    }
}

async function resetGame() {
    try {
        const response = await fetch('/api/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            gameState = data;
            updateGameState();
        }
    } catch (error) {
        console.error('Error resetting game:', error);
    }
}

async function resetScores() {
    try {
        const response = await fetch('/api/reset-scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            gameState = data;
            updateGameState();
        }
    } catch (error) {
        console.error('Error resetting scores:', error);
    }
}

function updateGameState() {
    // Update board
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            const symbol = gameState.board[i][j];
            
            if (symbol !== ' ') {
                cell.innerHTML = `<span class="symbol ${symbol}">${symbol}</span>`;
                cell.disabled = true;
            } else {
                cell.innerHTML = '';
                cell.disabled = gameState.gameOver;
            }
            
            // Add winning class to winning cells
            const cellIndex = i * 3 + j;
            if (gameState.winningLine.includes(cellIndex)) {
                cell.classList.add('winning');
            } else {
                cell.classList.remove('winning');
            }
        }
    }

    // Update status message
    const statusMessage = document.getElementById('statusMessage');
    if (gameState.gameOver) {
        if (gameState.winner === ' ') {
            statusMessage.textContent = "It's a Tie!";
        } else {
            statusMessage.textContent = `Player ${gameState.winner} Wins!`;
        }
        statusMessage.classList.add('winner');
    } else {
        statusMessage.textContent = `Player ${gameState.currentPlayer}'s Turn`;
        statusMessage.classList.remove('winner');
    }

    // Update scores
    document.getElementById('scoreX').textContent = gameState.scores.X;
    document.getElementById('scoreO').textContent = gameState.scores.O;
    document.getElementById('scoreTies').textContent = gameState.scores.ties;
}

// Add some floating background shapes
function createFloatingShapes() {
    const shapes = ['X', 'O'];
    const numShapes = 8;
    
    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.fontSize = (Math.random() * 30 + 20) + 'px';
        shape.style.animationDelay = Math.random() * 10 + 's';
        shape.style.animationDuration = (Math.random() * 20 + 15) + 's';
        
        document.body.appendChild(shape);
    }
}

// Add floating shapes CSS
const style = document.createElement('style');
style.textContent = `
.floating-shape {
    position: fixed;
    font-weight: 300;
    opacity: 0.1;
    animation: floatAround infinite linear;
    user-select: none;
    pointer-events: none;
    z-index: 1;
    color: #ff6b9d;
}

@keyframes floatAround {
    0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0.1;
    }
    25% {
        transform: translate(20px, -30px) rotate(90deg);
        opacity: 0.15;
    }
    50% {
        transform: translate(-10px, -60px) rotate(180deg);
        opacity: 0.1;
    }
    75% {
        transform: translate(-30px, -30px) rotate(270deg);
        opacity: 0.15;
    }
    100% {
        transform: translate(0, 0) rotate(360deg);
        opacity: 0.1;
    }
}
`;
document.head.appendChild(style);

// Create floating shapes
createFloatingShapes();
