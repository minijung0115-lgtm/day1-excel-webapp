@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

echo ============================================================
echo  Excel Dashboard - React + Vite
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo         https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행해주세요.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] 의존성 설치를 시작합니다 (npm install)...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install 에 실패했습니다.
        pause
        exit /b 1
    )
)

echo.
echo [INFO] 개발 서버를 시작합니다 - http://localhost:5173
echo        (종료하려면 Ctrl+C 를 누르세요)
echo.
call npm run dev

endlocal
