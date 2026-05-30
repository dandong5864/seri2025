@echo off
cd /d "%~dp0"
echo HappyDandong TV site server is starting...
echo.
"C:\Program Files\nodejs\node.exe" node_modules\next\dist\bin\next dev --port 3000
pause
