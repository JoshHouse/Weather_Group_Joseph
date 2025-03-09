@echo off
echo Creating virtual environment...
python -m venv venv

if "%OS%"=="Windows_NT" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo Activating virtual environment...
    source venv/bin/activate
)

echo Installing required packages...
pip install -r requirements.txt

echo Setup complete!
if "%OS%"=="Windows_NT" (
    echo To activate the virtual environment, run: venv\Scripts\activate.bat
) else (
    echo To activate the virtual environment, run: source venv/bin/activate
)
echo To start the Flask server, run: python app.py
pause