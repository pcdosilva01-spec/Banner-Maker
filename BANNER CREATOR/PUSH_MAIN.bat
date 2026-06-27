@echo off
REM Script para commit e push no Banner-Maker
REM Uso: PUSH_MAIN.bat "mensagem do commit"

cd /d "%~dp0"

REM Remove arquivos rastreados fora desta pasta
git reset HEAD .. 2>nul

echo.
echo ============================================
echo   Banner-Maker - PUSH MAIN
echo ============================================
echo.

REM Verifica se ha mensagem de commit
if "%1"=="" (
    echo Usando mensagem padrao...
    set "MSG=Update Banner-Maker"
) else (
    set "MSG=%*"
)

echo Commit message: %MSG%
echo.

REM Git status
echo [1/4] Verificando status...
git status --short

echo.

REM Git add - APENAS arquivos da pasta atual
echo [2/4] Adicionando arquivos...
git add *.html *.js *.json *.md *.bat .env .env.example .gitignore css/ js/

REM Git commit
echo [3/4] Criando commit...
git commit -m "%MSG%"
if errorlevel 1 (
    echo.
    echo Nenhum arquivo para commitar ou erro no commit.
    echo Tentando push mesmo assim...
)

REM Git push
echo.
echo [4/4] Enviando para GitHub...
git push origin main

echo.
echo ============================================
if errorlevel 1 (
    echo ERRO: Falha no push!
) else (
    echo SUCESSO: Push concluido!
)
echo ============================================
echo.

pause