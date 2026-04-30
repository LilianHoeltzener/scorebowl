# ScoreBowl 🏆

Une application web progressive (PWA) moderne pour la gestion de concours avec scores multiples et classement automatique en temps réel.

## ✨ Fonctionnalités

- **Gestion des participants** : Ajout, modification et suppression faciles
- **Scores multiples** : 3 scores par participant avec calcul automatique du total
- **Classement en temps réel** : Mise à jour automatique du classement
- **Interface intuitive** : Design moderne et responsive
- **Multi-plateforme** : Fonctionne sur Windows, Mac, Android et iPhone
- **Mode hors ligne** : Fonctionne sans connexion Internet
- **Sauvegarde automatique** : Données sauvegardées localement
- **Import/Export** : Sauvegarde et restauration des données

## 🚀 Installation

### Option 1 : Utilisation directe
1. Ouvrez le fichier `index.html` dans votre navigateur
2. L'application est immédiatement utilisable

### Option 2 : Installation comme app native (PWA)
1. Ouvrez l'application dans votre navigateur
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. Suivez les instructions pour installer l'app sur votre appareil

### Option 3 : Serveur local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si vous avez serve installé)
npx serve .

# Puis ouvrez http://localhost:8000
```

### Option 4 : Application desktop installable (sans hébergement)
Cette option permet de créer de vrais installateurs Windows et macOS à partager sur clé USB ou par transfert de fichier.

Pour les personnes qui installent l'application :
- Aucun prérequis technique (pas besoin d'installer Python ou Node.js)
- L'installateur contient l'application et ses dépendances de runtime
- Sur macOS, un seul fichier `.dmg` est à ouvrir puis glisser dans `Applications`

Prérequis :
- Node.js 20 ou plus récent

Commandes :
```bash
# Installer les dépendances
npm install

# Lancer l'application en mode desktop
npm start

# Générer un installateur Windows (à lancer sur Windows)
npm run build:win

# Générer un installateur macOS universel Intel + Apple Silicon (à lancer sur macOS)
npm run build:mac
```

Les fichiers générés se trouvent dans le dossier `dist/`.

Note :
- Pour produire les deux plateformes automatiquement, utilisez le workflow GitHub Actions `.github/workflows/desktop-build.yml`.
- Aucun abonnement d'hébergement web n'est nécessaire : l'application est locale sur le poste.

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (versions récentes)
- **Plateformes** : Windows, macOS, Linux, Android, iOS
- **Appareils** : PC, tablettes, smartphones

## 🎮 Utilisation

### Démarrage rapide
1. Cliquez sur "Nouveau" pour ajouter votre premier participant
2. Saisissez le nom du participant
3. Entrez les 3 scores en cliquant dans les cellules correspondantes
4. Le total et le classement se mettent à jour automatiquement

### Fonctionnalités avancées
- **Recherche** : Utilisez la barre de recherche pour filtrer les participants
- **Tri** : Triez par classement, nom ou total
- **Export** : Sauvegardez vos données au format JSON
- **Import** : Restaurez des données précédemment exportées

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec animations
- **JavaScript** (Vanilla) : Logique métier sans dépendances
- **Bootstrap 5** : Framework CSS responsive
- **PWA** : Service Worker pour le mode hors ligne
- **LocalStorage** : Sauvegarde locale des données

## 📁 Structure du projet

```
scorebowl/
├── index.html          # Page principale
├── styles.css          # Styles personnalisés
├── script.js           # Logique JavaScript
├── manifest.json       # Manifeste PWA
├── sw.js              # Service Worker
├── icons/             # Icônes PWA
├── README.md          # Documentation
└── screenshots/       # Captures d'écran (optionnel)
```

## 🔧 Personnalisation

### Modification du nombre de scores
Pour changer le nombre de scores par participant, modifiez :
1. Le HTML dans `index.html` (colonnes du tableau)
2. Le JavaScript dans `script.js` (propriétés score1, score2, score3)
3. Le CSS dans `styles.css` (si nécessaire)

### Changement de thème
Modifiez les variables CSS dans `:root` du fichier `styles.css` :
```css
:root {
    --primary-color: #0d6efd;
    --success-color: #198754;
    /* ... autres couleurs */
}
```

## 💾 Sauvegarde des données

- **Automatique** : Les données sont sauvegardées automatiquement dans le navigateur
- **Export manuel** : Bouton "Exporter" pour télécharger un fichier JSON
- **Import** : Bouton "Importer" pour restaurer des données

⚠️ **Important** : Les données sont stockées localement. Videz pas le cache du navigateur pour ne pas perdre vos données, ou exportez-les régulièrement.

## 🔄 Mises à jour

L'application vérifie automatiquement les mises à jour. En tant que PWA, elle se met à jour automatiquement lors de la prochaine visite.

## 🐛 Résolution de problèmes

### L'application ne fonctionne pas
- Vérifiez que JavaScript est activé
- Utilisez un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Vérifiez la console développeur (F12) pour les erreurs

### Les données ont disparu
- Vérifiez que le cache du navigateur n'a pas été vidé
- Restaurez depuis un export précédent
- Les données sont liées au domaine/origine de l'application

### Installation PWA impossible
- Vérifiez que vous utilisez HTTPS ou localhost
- Assurez-vous que le navigateur supporte les PWA
- Actualisez la page et réessayez

## 📄 Licence

Ce projet est libre d'utilisation pour des projets personnels et éducatifs.

## 🤝 Contribution

N'hésitez pas à suggérer des améliorations ou signaler des bugs !

---

**ScoreBowl** - Créé pour simplifier la gestion de vos concours 🎯
