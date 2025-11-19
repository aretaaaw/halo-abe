@echo off
REM Start Halo ABE Server
REM This batch file starts the Node.js backend server

cd /d %~dp0\backend

echo Starting Halo ABE Server...
echo URL: http://localhost:8080
echo.

node server-simple.js

pause
