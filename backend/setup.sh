#!/bin/bash

# Create a virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install required packages
echo "Installing required packages..."
pip install -r requirements.txt

echo "Setup complete!"
echo "To activate the virtual environment, run: source venv/bin/activate"
echo "To start the Flask server, run: python app.py"
