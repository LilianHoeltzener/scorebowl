/* Création d'icônes PNG simples avec JavaScript */

// Fonction pour créer une icône simple
function createSimpleIcon(size = 192) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Fond bleu dégradé
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#0d6efd');
    gradient.addColorStop(1, '#0056b3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Trophée doré simple
    ctx.fillStyle = '#FFD700';
    const centerX = size / 2;
    const centerY = size / 2;
    const scale = size / 192;
    
    // Coupe principale
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 10 * scale, 30 * scale, 35 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Base
    ctx.fillRect(centerX - 20 * scale, centerY + 20 * scale, 40 * scale, 15 * scale);
    ctx.fillRect(centerX - 15 * scale, centerY + 35 * scale, 30 * scale, 8 * scale);
    
    return canvas.toDataURL();
}

// Icône 192x192 en base64 pour les tests
const iconData192 = `data:image/png;base64,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.com`;

// Pour la génération des icônes, utilisez icon-generator.html ou convertissez le SVG
console.log('Icons utilities loaded. Use icon-generator.html to create PNG icons from SVG.');
