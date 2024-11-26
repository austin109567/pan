@echo off
echo Cleaning up...
rd /s /q "node_modules\.vite" 2>nul
rd /s /q ".next" 2>nul
rd /s /q "build" 2>nul

echo Installing dependencies...
npm install

echo Starting development server...
npm run dev
