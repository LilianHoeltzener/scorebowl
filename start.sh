#!/bin/bash

# Script de démarrage pour ScoreBowl
echo "🏆 Démarrage de ScoreBowl..."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Vérifier si Python est installé
if command -v python3 &> /dev/null; then
    echo "✅ Python3 trouvé"
    echo "🌐 Lancement du serveur local sur http://localhost:8000"
    echo "🛑 Appuyez sur Ctrl+C pour arrêter le serveur"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python trouvé"
    echo "🌐 Lancement du serveur local sur http://localhost:8000"
    echo "🛑 Appuyez sur Ctrl+C pour arrêter le serveur"
    echo ""
    python -m http.server 8000
else
    echo "❌ Python non trouvé"
    echo "🔧 Installez Python ou ouvrez index.html directement dans votre navigateur"
    echo "💡 Ou utilisez 'npx serve .' si vous avez Node.js"
fi
