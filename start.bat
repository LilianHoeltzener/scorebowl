@echo off
setlocal
cd /d "%~dp0"

echo 🏆 Démarrage de ScoreBowl...

where python >nul 2>nul
if %errorlevel% == 0 (
    echo ✅ Python trouvé
    echo 🌐 Lancement du serveur local sur http://localhost:8000
    echo 🛑 Appuyez sur Ctrl+C pour arrêter le serveur
    echo.
    python -m http.server 8000
) else (
    echo ❌ Python non trouvé
    echo 🔧 Installez Python ou ouvrez index.html directement dans votre navigateur
    echo 💡 Ou utilisez 'npx serve .' si vous avez Node.js
    pause
)
