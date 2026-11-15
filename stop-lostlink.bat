@echo off
title Stop LostLink Services
echo Stopping LostLink backend and frontend processes...

REM Find and kill process on port 8080 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do (
    echo Terminating Backend process PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

REM Find and kill process on port 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Terminating Frontend process PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo LostLink processes stopped cleanly.
pause
