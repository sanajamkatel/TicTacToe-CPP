#include <iostream>
#include <vector>
#include <limits>

class TicTacToe {
private:
    // 2D array to represent the 3x3 game board
    // We'll use a vector of vectors for dynamic sizing (though 3x3 is fixed)
    std::vector<std::vector<char>> board;
    
    // Current player (X or O)
    char currentPlayer;
    
    // Game state tracking
    bool gameOver;
    char winner;

public:
    // Constructor - initializes the game
    TicTacToe() {
        // Initialize 3x3 board with empty spaces
        board = std::vector<std::vector<char>>(3, std::vector<char>(3, ' '));
        currentPlayer = 'X';  // X always goes first
        gameOver = false;
        winner = ' ';
    }

    // Function to display the current board state
    void displayBoard() {
        std::cout << "\n   |   |   \n";
        std::cout << " " << board[0][0] << " | " << board[0][1] << " | " << board[0][2] << " \n";
        std::cout << "___|___|___\n";
        std::cout << "   |   |   \n";
        std::cout << " " << board[1][0] << " | " << board[1][1] << " | " << board[1][2] << " \n";
        std::cout << "___|___|___\n";
        std::cout << "   |   |   \n";
        std::cout << " " << board[2][0] << " | " << board[2][1] << " | " << board[2][2] << " \n";
        std::cout << "   |   |   \n\n";
    }

    // Function to get player input and validate it
    bool makeMove() {
        int row, col;
        
        std::cout << "Player " << currentPlayer << ", enter your move (row col): ";
        
        // Input validation - ensure we get valid integers
        if (!(std::cin >> row >> col)) {
            std::cout << "Invalid input! Please enter two numbers.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            return false;
        }
        
        // Convert to 0-based indexing and validate range
        row--;
        col--;
        
        // Check if the move is within bounds
        if (row < 0 || row >= 3 || col < 0 || col >= 3) {
            std::cout << "Invalid move! Please enter numbers between 1 and 3.\n";
            return false;
        }
        
        // Check if the cell is already occupied
        if (board[row][col] != ' ') {
            std::cout << "That cell is already occupied! Try again.\n";
            return false;
        }
        
        // Make the move
        board[row][col] = currentPlayer;
        return true;
    }

    // Function to check if the current player has won
    bool checkWin() {
        // Check rows
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == currentPlayer && 
                board[i][1] == currentPlayer && 
                board[i][2] == currentPlayer) {
                return true;
            }
        }
        
        // Check columns
        for (int j = 0; j < 3; j++) {
            if (board[0][j] == currentPlayer && 
                board[1][j] == currentPlayer && 
                board[2][j] == currentPlayer) {
                return true;
            }
        }
        
        // Check main diagonal (top-left to bottom-right)
        if (board[0][0] == currentPlayer && 
            board[1][1] == currentPlayer && 
            board[2][2] == currentPlayer) {
            return true;
        }
        
        // Check anti-diagonal (top-right to bottom-left)
        if (board[0][2] == currentPlayer && 
            board[1][1] == currentPlayer && 
            board[2][0] == currentPlayer) {
            return true;
        }
        
        return false;
    }

    // Function to check if the board is full (tie game)
    bool isBoardFull() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    return false;
                }
            }
        }
        return true;
    }

    // Function to switch players
    void switchPlayer() {
        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }

    // Main game loop
    void playGame() {
        std::cout << "Welcome to Tic-Tac-Toe!\n";
        std::cout << "Players take turns. Enter row and column (1-3) to make a move.\n";
        std::cout << "Player X goes first.\n";
        
        while (!gameOver) {
            displayBoard();
            
            // Get valid move from current player
            while (!makeMove()) {
                // Keep asking until we get a valid move
            }
            
            // Check for win condition
            if (checkWin()) {
                gameOver = true;
                winner = currentPlayer;
                displayBoard();
                std::cout << "Congratulations! Player " << winner << " wins!\n";
                break;
            }
            
            // Check for tie game
            if (isBoardFull()) {
                gameOver = true;
                displayBoard();
                std::cout << "It's a tie! The board is full.\n";
                break;
            }
            
            // Switch to the other player
            switchPlayer();
        }
    }

    // Getter functions for game state
    bool isGameOver() const { return gameOver; }
    char getWinner() const { return winner; }
    char getCurrentPlayer() const { return currentPlayer; }
};

// Main function to run the game
int main() {
    TicTacToe game;
    game.playGame();
    
    std::cout << "\nThanks for playing!\n";
    return 0;
}
