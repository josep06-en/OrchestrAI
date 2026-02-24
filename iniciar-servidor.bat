@echo off
title OrchestrAI - Servidor de Leads
echo ========================================
echo    ORCHESTRAI - SERVIDOR DE LEADS
echo ========================================
echo.
echo Iniciando servidor de gestion de leads...
echo.
echo El servidor estara disponible en:
echo http://localhost:3000
echo.
echo Formulario: http://localhost:3000/web_operis_completa.html
echo Dashboard: http://localhost:3000/leads-dashboard.html
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

cd /d "%~dp0"
node server-minimal.js

pause
