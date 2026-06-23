@echo off
cls
echo.
echo ========================================================
echo           GIT PUSH - FINANCIA
echo ========================================================
echo.

echo [1/4] Adicionando todos os arquivos...
git add .

echo.
echo [2/4] Criando commit...
set /p mensagem="Digite a mensagem do commit: "

if "%mensagem%"=="" (
    set mensagem=Atualizacao FinanIA
)

git commit -m "%mensagem%"

echo.
echo [3/4] Enviando para GitHub (branch main)...
git push origin main

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao fazer push
    echo.
    echo Verifique se:
    echo - O repositorio Git esta inicializado
    echo - Voce esta conectado ao GitHub
    echo - A branch main existe
    echo.
    pause
    exit /b 1
)

echo.
echo [4/4] Concluido!
echo.
echo ========================================================
echo           PUSH REALIZADO COM SUCESSO!
echo ========================================================
echo.
pause
