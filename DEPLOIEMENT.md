# 🚀 Déploiement de ScoreBowl

## Options de déploiement

### 1. Utilisation locale (le plus simple)
Votre application fonctionne déjà parfaitement en local ! Aucun déploiement nécessaire.

### 2. Partage sur réseau local
Pour partager avec d'autres appareils sur le même réseau :

```bash
# Démarrer le serveur
./start.sh

# Trouver votre IP locale
ifconfig | grep "inet " | grep -v 127.0.0.1

# Partager l'URL : http://VOTRE_IP:8000
```

### 3. Déploiement web gratuit

#### GitHub Pages
1. Créez un dépôt GitHub
2. Uploadez tous les fichiers
3. Activez GitHub Pages dans les paramètres
4. Votre app sera disponible sur `https://username.github.io/scorebowl`

#### Netlify
1. Glissez-déposez le dossier sur netlify.com
2. Votre app sera déployée instantanément
3. URL fournie automatiquement

#### Vercel
1. Connectez votre dépôt GitHub à vercel.com
2. Déploiement automatique
3. URL personnalisée disponible

### 4. Hébergement sur votre serveur
Copiez simplement tous les fichiers sur votre serveur web. Aucune configuration spéciale requise !

## Fichiers nécessaires pour le déploiement
- `index.html` (obligatoire)
- `script.js` (obligatoire)  
- `styles.css` (obligatoire)
- `manifest.json` (pour PWA)
- `sw.js` (pour mode hors ligne)
- `icons/` (dossier avec icônes)

## Configuration HTTPS
Pour les fonctionnalités PWA complètes, HTTPS est recommandé. Les services comme Netlify, Vercel et GitHub Pages fournissent HTTPS automatiquement.

## Optimisations (optionnel)
- Minifiez CSS/JS pour de meilleures performances
- Compressez les images
- Ajoutez un CDN pour les ressources Bootstrap

Votre application est maintenant prête à être utilisée et partagée ! 🎉
