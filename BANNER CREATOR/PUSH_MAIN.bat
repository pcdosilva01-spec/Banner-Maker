@echo off
REM Script para commit e push no Banner-Maker
REM Uso: PUSH_MAIN.bat "mensagem do commit"

cd /d "%~dp0"

echo.
echo ============================================
echo   Banner-Maker - PUSH MAIN
echo ============================================
echo.

REM ==========================================
REM LIMPEZA: Remove do git arquivos fora desta pasta
REM ==========================================
echo [0/5] Limpando arquivos fora da pasta...

REM Remove tudo do staging area
git reset HEAD 2>nul

REM Remove arquivos rastreados que estejam fora do diretorio atual
for /f "delims=" %%i in ('git ls-files --full-name 2^>nul ^| findstr /v "^[^/]*$" ^| findstr /v "^css/" ^| findstr /v "^js/"') do (
    echo   Removendo: %%i
    git rm --cached "%%i" 2>nul
)

REM ==========================================
REM ADD: Adiciona apenas arquivos desta pasta
REM ==========================================
echo.
echo [1/5] Adicionando arquivos da pasta atual...
git add *.html *.js *.json *.md *.bat .env .env.example .gitignore css/ js/ 2>nul
echo.

REM ==========================================
REM STATUS: Mostra o que sera commitado
REM ==========================================
echo [2/5] Status do commit...
git status --short
echo.

REM ==========================================
REM COMMIT
REM ==========================================
REM Verifica se ha mensagem de commit
if "%1"=="" (
    echo Usando mensagem padrao...
    set "MSG=Update Banner-Maker"
) else (
    set "MSG=%*"
)

echo [3/5] Commit message: %MSG%
git commit -m "%MSG%"
if errorlevel 1 (
    echo.
    echo [AVISO] Nenhum arquivo para commitar.
)

REM ==========================================
REM PUSH
REM ==========================================
echo.
echo [4/5] Enviando para GitHub...
git push origin main

echo ============================================
echo.

REM Remove arquivos do git que nao sao desta pasta
echo [5/5] Removendo arquivos fora da pasta do repo...
for /f "delims=" %%i in ('git ls-files --full-name 2^>nul ^| findstr /R "^../"') do (
    echo   Removendo do repo: %%i
    git rm --cached "%%i" 2>nul
)

echo.
echo ============================================
if errorlevel 1 (
    echo ERRO: Falha no processo!
) else (
    echo SUCESSO: Push concluido!
)
echo ============================================
echo.

pause

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