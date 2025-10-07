#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <fstream>
#include "httplib.h"

class TicTacToeServer {
private:
    httplib::Server server;
    std::vector<std::vector<char>> board;
    char currentPlayer;
    bool gameOver;
    char winner;
    std::vector<int> winningLine;
    std::map<std::string, int> scores;

    // Winning combinations (indices of the board)
    std::vector<std::vector<int>> winningCombinations = {
        {0, 1, 2}, // Top row
        {3, 4, 5}, // Middle row
        {6, 7, 8}, // Bottom row
        {0, 3, 6}, // Left column
        {1, 4, 7}, // Middle column
        {2, 5, 8}, // Right column
        {0, 4, 8}, // Main diagonal
        {2, 4, 6}  // Anti-diagonal
    };

public:
    TicTacToeServer() {
        resetGame();
        scores["X"] = 0;
        scores["O"] = 0;
        scores["ties"] = 0;
    }

    void resetGame() {
        board = std::vector<std::vector<char>>(3, std::vector<char>(3, ' '));
        currentPlayer = 'X';
        gameOver = false;
        winner = ' ';
        winningLine.clear();
    }

    bool checkWinner() {
        // Convert 2D board to 1D for easier checking
        std::vector<char> flatBoard;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                flatBoard.push_back(board[i][j]);
            }
        }

        for (auto& combination : winningCombinations) {
            int a = combination[0], b = combination[1], c = combination[2];
            if (flatBoard[a] != ' ' && 
                flatBoard[a] == flatBoard[b] && 
                flatBoard[a] == flatBoard[c]) {
                winningLine = combination;
                return true;
            }
        }
        return false;
    }

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

    std::string boardToJson() {
        std::stringstream json;
        json << "{\"board\":[";
        for (int i = 0; i < 3; i++) {
            json << "[";
            for (int j = 0; j < 3; j++) {
                json << "\"" << board[i][j] << "\"";
                if (j < 2) json << ",";
            }
            json << "]";
            if (i < 2) json << ",";
        }
        json << "],\"currentPlayer\":\"" << currentPlayer << "\",";
        json << "\"gameOver\":" << (gameOver ? "true" : "false") << ",";
        json << "\"winner\":\"" << winner << "\",";
        json << "\"winningLine\":[";
        for (size_t i = 0; i < winningLine.size(); i++) {
            json << winningLine[i];
            if (i < winningLine.size() - 1) json << ",";
        }
        json << "],\"scores\":{";
        json << "\"X\":" << scores["X"] << ",";
        json << "\"O\":" << scores["O"] << ",";
        json << "\"ties\":" << scores["ties"];
        json << "}}";
        return json.str();
    }

    void makeMove(int row, int col) {
        if (row >= 0 && row < 3 && col >= 0 && col < 3 && 
            board[row][col] == ' ' && !gameOver) {
            
            board[row][col] = currentPlayer;
            
            if (checkWinner()) {
                gameOver = true;
                winner = currentPlayer;
                scores[std::string(1, currentPlayer)]++;
            } else if (isBoardFull()) {
                gameOver = true;
                winner = ' ';
                scores["ties"]++;
            } else {
                currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
            }
        }
    }

    void startServer() {
        // Serve static files
        server.set_mount_point("/", "./public");

        // API endpoints
        server.Get("/api/game", [this](const httplib::Request&, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Content-Type", "application/json");
            res.body = boardToJson();
        });

        server.Post("/api/move", [this](const httplib::Request& req, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Content-Type", "application/json");
            
            // Parse JSON body
            std::string body = req.body;
            size_t rowPos = body.find("\"row\":");
            size_t colPos = body.find("\"col\":");
            
            if (rowPos != std::string::npos && colPos != std::string::npos) {
                int row = std::stoi(body.substr(rowPos + 6, 1));
                int col = std::stoi(body.substr(colPos + 6, 1));
                makeMove(row, col);
            }
            
            res.body = boardToJson();
        });

        server.Post("/api/reset", [this](const httplib::Request&, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Content-Type", "application/json");
            resetGame();
            res.body = boardToJson();
        });

        server.Post("/api/reset-scores", [this](const httplib::Request&, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Content-Type", "application/json");
            scores["X"] = 0;
            scores["O"] = 0;
            scores["ties"] = 0;
            res.body = boardToJson();
        });

        std::cout << "Tic-Tac-Toe Server starting on http://0.0.0.0:8080" << std::endl;
        server.listen("0.0.0.0", 8080);
    }
};

int main() {
    TicTacToeServer gameServer;
    gameServer.startServer();
    return 0;
}

