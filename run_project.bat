@echo off
TITLE Electronic Voting System - Blockchain Demo
COLOR 0A
CLS

ECHO ======================================================
ECHO    ELECTRONIC VOTING SYSTEM USING BLOCKCHAIN
ECHO    Academic Project - Local Environment
ECHO ======================================================
ECHO.
ECHO [INFO] Starting the Python Backend Server...
ECHO [INFO] Opening User Interface in default browser...
ECHO.

:: Open the browser immediately (it might take a second to connect while Flask starts)
START "" "http://127.0.0.1:5000"

:: Check if Python is installed (simple check)
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Python is not installed or not in PATH.
    PAUSE
    EXIT /B
)

:: Run the Flask application
python app.py

PAUSE
