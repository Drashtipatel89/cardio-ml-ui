@echo off
echo =======================================================
echo   Starting CardioGuard ML System (API + React UI)
echo =======================================================

echo [1/2] Starting Python FastAPI Model Server on http://localhost:8000 ...
start "CardioGuard ML Backend" cmd /k "cd /d "%~dp0" && python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 >nul

echo [2/2] Starting React Vite SPA UI on http://localhost:3000 ...
start "CardioGuard ML UI" cmd /k "cd /d "%~dp0\UI" && npm run dev"

echo.
echo =======================================================
echo   Services are running!
echo   Frontend SPA: http://localhost:3000
echo   Model API:    http://localhost:8000/docs
echo =======================================================
