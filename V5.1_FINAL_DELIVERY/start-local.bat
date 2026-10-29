@echo off
setlocal
set PORT=8765
set SITE=%~dp0site

where node >nul 2>nul
if not errorlevel 1 goto :node
where python >nul 2>nul
if not errorlevel 1 goto :python

echo.
echo Node.js 18+ or Python 3 is required.
echo Install one of them and run this file again.
echo.
pause
exit /b 1

:node
echo.
echo Starting Guangzhou AI eldercare research site (offline package)...
echo Open: http://127.0.0.1:%PORT%/#s-4-1
echo Close this window to stop the local server.
echo.
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:%PORT%/#s-4-1'"
node "%SITE%\scripts\serve.mjs" --port %PORT%
goto :eof

:python
echo.
echo Starting Guangzhou AI eldercare research site (Python static server)...
echo Open: http://127.0.0.1:%PORT%/#s-4-1
echo Close this window to stop the local server.
echo.
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:%PORT%/#s-4-1'"
pushd "%SITE%\dist"
python -m http.server %PORT%
popd
goto :eof

