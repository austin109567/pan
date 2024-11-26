@echo off
echo Stopping any running Vite processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq vite"
timeout /t 2 /nobreak > nul

echo Clearing Vite cache...
rd /s /q "node_modules/.vite" 2>nul

echo Starting development server...
npm run dev
