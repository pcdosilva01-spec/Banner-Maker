@echo off
cls
echo.
echo ========================================================
echo      GIT PUSH FORCADO - SOBRESCREVER GITHUB
echo ========================================================
echo.
echo ATENCAO: Isso vai SOBRESCREVER tudo no GitHub!
echo.
set /p confirma="Tem certeza? (S/N): "

if /i not "%confirma%"=="S" (
    echo.
    echo Operacao cancelada.
    pause
    exit /b 0
)

echo.
echo [1/3] Adicionando arquivos...
git add .

echo.
echo [2/3] Criando commit...
set /p mensagem="Mensagem do commit: "

if "%mensagem%"=="" (
    set mensagem=Atualizacao FinanIA - Push Forcado
)

git commit -m "%mensagem%"

echo.
echo [3/3] Forcando push para GitHub...
git push origin main --force

if errorlevel 1 (
    echo.
    echo ERRO: Falha no push forcado
    pause
    exit /b 1
)

echo.
echo ========================================================
echo         PUSH FORCADO REALIZADO!
echo ========================================================
echo.
pause
