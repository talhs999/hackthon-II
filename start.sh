#!/bin/bash
# Setup and run the Hackathon Todo App Phase II

echo "Setting up the Hackathon Todo App Phase II..."
echo

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found. Installing..."
    # This will work if Docker Desktop is installed with WSL integration
    echo "Please ensure Docker Desktop is running with WSL integration enabled."
    echo "Visit https://docs.docker.com/desktop/wsl/ for setup instructions."
    exit 1
fi

echo "Starting Docker containers..."
echo "This may take a few minutes for the first run as images are built..."

# Start the application stack
docker-compose up --build

echo
echo "Application should now be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  Health check: http://localhost:8000/health"
echo
echo "To stop the application, press Ctrl+C"
echo
echo "Note: On first run, the application will install dependencies"
echo "and set up the database. This may take 2-3 minutes."