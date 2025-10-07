# Makefile for TicTacToe game
CXX = g++
CXXFLAGS = -std=c++11 -Wall -Wextra -O2
TARGET_CONSOLE = tictactoe
TARGET_SERVER = server
SOURCE_CONSOLE = tictactoe.cpp
SOURCE_SERVER = server.cpp

# Default target
all: $(TARGET_CONSOLE) $(TARGET_SERVER)

# Build console version
$(TARGET_CONSOLE): $(SOURCE_CONSOLE)
	$(CXX) $(CXXFLAGS) -o $(TARGET_CONSOLE) $(SOURCE_CONSOLE)

# Build web server version
$(TARGET_SERVER): $(SOURCE_SERVER)
	$(CXX) $(CXXFLAGS) -o $(TARGET_SERVER) $(SOURCE_SERVER) -lpthread

# Clean up compiled files
clean:
	rm -f $(TARGET_CONSOLE) $(TARGET_SERVER)

# Run console game
run-console: $(TARGET_CONSOLE)
	./$(TARGET_CONSOLE)

# Run web server
run-server: $(TARGET_SERVER)
	./$(TARGET_SERVER)

# Phony targets
.PHONY: all clean run-console run-server
