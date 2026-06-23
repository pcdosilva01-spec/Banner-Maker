@echo off
cls
echo.
echo ========================================================
echo           GIT PUSH - FINANCIA
echo ========================================================
echo.

echo [1/5] Verificando repositorio...
git status

echo.
echo [2/5] Sincronizando com GitHub...
git pull origin main --rebase

if errorlevel 1 (
    echo.
    echo AVISO: Conflitos detectados ou primeira sincronizacao
    echo Continuando...
    echo.
)

echo.
echo [3/5] Adicionando todos os arquivos...
git add .

echo.
echo [4/5] Criando commit...
set /p mensagem="Digite a mensagem do commit: "

if "%mensagem%"=="" (
    set mensagem=Atualizacao FinanIA
)

git commit -m "%mensagem%"

if errorlevel 1 (
    echo.
    echo Nenhuma alteracao para commitar
    echo.
)

echo.
echo [5/5] Enviando para GitHub (branch main)...
git push origin main

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao fazer push
    echo.
    echo Tentando push forcado...
    git push origin main --force
    
    if errorlevel 1 (
        echo.
        echo ERRO: Push forcado tambem falhou
        echo.
        echo Verifique manualmente:
        echo   git status
        echo   git pull origin main
        echo   git push origin main
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================================
echo           PUSH REALIZADO COM SUCESSO!
echo ========================================================
echo.
pause
