@echo off
echo Clearing Vite cache...
rmdir /s /q "node_modules/.vite"
echo Cache cleared!
echo.
echo Please restart your development server with:
echo npm run dev
