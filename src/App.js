import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './App.css';

const TicTacToe = () => {
  // Game state management
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'tie'
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });
  const [lastMoveIndex, setLastMoveIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Window dimensions for confetti
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);
    
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  // Winning combinations (indices of the board)
  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Main diagonal
    [2, 4, 6]  // Anti-diagonal
  ];

  // Check for win condition
  const checkWinner = (currentBoard) => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (currentBoard[a] && 
          currentBoard[a] === currentBoard[b] && 
          currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], winningLine: combination };
      }
    }
    return null;
  };

  // Check for tie game
  const checkTie = (currentBoard) => {
    return currentBoard.every(cell => cell !== null);
  };

  // Handle cell click
  const handleCellClick = (index) => {
    // Don't allow moves if game is over or cell is already filled
    if (board[index] || gameStatus !== 'playing') {
      return;
    }

    // Create new board state
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setLastMoveIndex(index);

    // Check for winner
    const winResult = checkWinner(newBoard);
    if (winResult) {
      setGameStatus('won');
      setWinner(winResult.winner);
      setWinningLine(winResult.winningLine);
      
      // Trigger confetti explosion
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      
      // Update scores
      setScores(prevScores => ({
        ...prevScores,
        [winResult.winner]: prevScores[winResult.winner] + 1
      }));
    } else if (checkTie(newBoard)) {
      setGameStatus('tie');
      setScores(prevScores => ({
        ...prevScores,
        ties: prevScores.ties + 1
      }));
    } else {
      // Switch players
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
    setWinningLine([]);
    setLastMoveIndex(null);
    setShowConfetti(false); // Stop any ongoing confetti
  };

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0, ties: 0 });
  };

  // Get status message
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return `🎉 Player ${winner} Wins!`;
    } else if (gameStatus === 'tie') {
      return "🤝 It's a Tie!";
    } else {
      return `Player ${currentPlayer}'s Turn`;
    }
  };

  // Render individual cell
  const renderCell = (index) => {
    const isWinningCell = winningLine.includes(index);
    const isLastMove = lastMoveIndex === index;
    
    return (
      <button
        key={index}
        className={`cell ${isWinningCell ? 'winning' : ''} ${isLastMove ? 'last-move' : ''}`}
        onClick={() => handleCellClick(index)}
        disabled={gameStatus !== 'playing'}
      >
        <span className={`symbol ${board[index] || ''}`}>
          {board[index]}
        </span>
      </button>
    );
  };

  // Generate floating background shapes
  const generateFloatingShapes = () => {
    const shapes = [];
    const numShapes = 12;
    
    for (let i = 0; i < numShapes; i++) {
      const isX = Math.random() > 0.5;
      const size = Math.random() * 40 + 20; // 20-60px
      const left = Math.random() * 100; // 0-100%
      const top = Math.random() * 100; // 0-100%
      const animationDelay = Math.random() * 10; // 0-10s
      const animationDuration = Math.random() * 20 + 15; // 15-35s
      
      shapes.push({
        id: i,
        symbol: isX ? 'X' : 'O',
        size,
        left,
        top,
        animationDelay,
        animationDuration
      });
    }
    
    return shapes;
  };

  const [floatingShapes] = useState(generateFloatingShapes());

  return (
    <div className="app">
      {/* Floating background shapes */}
      <div className="floating-shapes">
        {floatingShapes.map(shape => (
          <div
            key={shape.id}
            className={`floating-shape ${shape.symbol.toLowerCase()}`}
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              fontSize: `${shape.size}px`,
              animationDelay: `${shape.animationDelay}s`,
              animationDuration: `${shape.animationDuration}s`
            }}
          >
            {shape.symbol}
          </div>
        ))}
      </div>
      
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#ff6b9d', '#c44569', '#ff9ff3', '#f368e0', '#ff9a9e', '#fecfef']}
          gravity={0.3}
          initialVelocityY={20}
          initialVelocityX={5}
        />
      )}
      <div className="game-container">
        <header className="game-header">
          <h1 className="game-title">Tic-Tac-Toe</h1>
          <div className={`status-message ${gameStatus === 'won' ? 'winner' : ''}`}>
            {getStatusMessage()}
          </div>
        </header>

        <div className={`game-board ${gameStatus === 'won' ? 'has-winner' : ''}`}>
          {Array.from({ length: 9 }, (_, index) => renderCell(index))}
        </div>

        <div className="game-controls">
          <button className="btn btn-primary" onClick={resetGame}>
            New Game
          </button>
          <button className="btn btn-secondary" onClick={resetScores}>
            Reset Scores
          </button>
        </div>

        <div className="scoreboard">
          <div className="score-item">
            <span className="score-label">Player X</span>
            <span className="score-value">{scores.X}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Ties</span>
            <span className="score-value">{scores.ties}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Player O</span>
            <span className="score-value">{scores.O}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
