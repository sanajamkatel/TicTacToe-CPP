# Tic-Tac-Toe Game

Two implementations of Tic-Tac-Toe: a C++ console version and a C++ web server with HTML frontend.

## C++ Console Version

```bash
make run-console
```

Terminal-based game with input validation and win detection.

## C++ Web Server Version

```bash
make run-server
```

Open `http://localhost:8080`

C++ web server that serves HTML/CSS/JS frontend with API endpoints for game logic.

## C++ Console Features

- Object-oriented design with TicTacToe class
- 2D array board representation
- Input validation and error handling
- Win condition checking for all combinations
- Turn-based gameplay with player switching

## C++ Web Server Features

- C++ backend with HTTP API endpoints
- HTML/CSS/JS frontend with pink theme
- Glass-morphism design with animations
- Floating X's and O's in the background
- Smooth hover animations and transitions
- Score tracking across games
- Mobile responsive design
- RESTful API for game operations

## Tech Stack

**C++ Console:**
- C++ with STL vectors
- Object-oriented programming
- Makefile build system

**C++ Web Server:**
- C++ with cpp-httplib
- HTML/CSS/JavaScript frontend
- RESTful API design
- Makefile build system

## Implementation

**C++ Console:**
- Uses 2D vector to represent the 3x3 board
- TicTacToe class manages game state and logic
- Input validation prevents invalid moves
- Win detection checks all 8 possible combinations

**C++ Web Server:**
- C++ backend handles all game logic via API endpoints
- HTML/CSS/JS frontend makes HTTP requests
- JSON communication between frontend and backend
- Static file serving for web assets

## API Endpoints

- `GET /api/game` - Get current game state
- `POST /api/move` - Make a move (row, col)
- `POST /api/reset` - Reset current game
- `POST /api/reset-scores` - Reset score tracking

## Files

- `tictactoe.cpp` - C++ console implementation
- `server.cpp` - C++ web server implementation
- `httplib.h` - HTTP library header
- `Makefile` - Build configuration
- `public/index.html` - Web frontend
- `public/style.css` - Styling and animations
- `public/script.js` - Frontend JavaScript
- `public/faviconttt.png` - Game favicon