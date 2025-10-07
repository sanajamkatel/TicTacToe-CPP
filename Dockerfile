FROM ubuntu:20.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy source files
COPY . .

# Build the server
RUN make server

# Expose port
EXPOSE 8080

# Start the server
CMD ["./server"]
