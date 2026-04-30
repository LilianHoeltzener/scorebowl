# 🏆 ScoreBowl - Application de Gestion de Concours

## ✅ Installation Terminée !

Votre application **ScoreBowl** est maintenant prête à être utilisée. Cette application vous permet de gérer facilement des concours avec 3 scores par participant et un classement automatique.

## 🚀 Comment démarrer ?

### Option 1 : Démarrage simple (Recommandé)
1. **Double-cliquez** sur le fichier `start.sh` (Mac/Linux) ou `start.bat` (Windows)
2. Votre navigateur s'ouvrira automatiquement
3. L'application sera disponible sur `http://localhost:8000`

### Option 2 : Ouverture directe
1. **Double-cliquez** sur le fichier `index.html`
2. L'application s'ouvrira directement dans votre navigateur

### Option 3 : Installer l'application sur l'ordinateur
Cette option permet d'avoir ScoreBowl comme une application séparée, avec son icône, sans devoir rouvrir le navigateur à chaque fois.

Note importante : cette option via navigateur n'est pas un installateur `.dmg` classique.
Si vous devez livrer un vrai fichier d'installation simple pour des utilisateurs non techniques, utilisez la version desktop `DMG` (Option 4 dans `README.md`).

#### Sur Windows avec Chrome ou Edge
1. Ouvrez ScoreBowl dans Chrome ou Edge
2. Regardez à droite de la barre d'adresse
3. Cliquez sur l'icône d'installation ou sur le menu du navigateur
4. Choisissez `Installer ScoreBowl`, `Installer cette application` ou `Applications > Installer ce site comme une application`
5. Validez : ScoreBowl sera ajouté comme application sur l'ordinateur

#### Sur Mac avec Safari
1. Ouvrez ScoreBowl dans Safari
2. Dans la barre de menus, cliquez sur `Fichier`
3. Choisissez `Ajouter au Dock`
4. Validez : ScoreBowl sera disponible comme application depuis le Dock

#### Si le bouton d'installation n'apparaît pas
1. Lancez d'abord l'application avec `start.sh` sur Mac ou `start.bat` sur Windows
2. Attendez que la page soit bien ouverte sur `http://localhost:8000`
3. Réessayez dans Chrome, Edge ou Safari

#### Important
- Cette installation ne demande aucun abonnement Internet
- Les données restent stockées localement sur l'ordinateur
- Pour déplacer les données vers un autre poste, utilisez `Exporter` puis `Importer`

## 🍎 Installation macOS simplifiée (fichier .dmg)

Cette méthode est recommandée pour une installation facile par des non-informaticiens.

### Pour la personne qui prépare le fichier
1. Ouvrez un terminal dans le dossier du projet
2. Lancez `npm install`
3. Lancez `npm run build:mac`
4. Récupérez le fichier `.dmg` dans le dossier `dist/`

### Pour la personne qui installe
1. Double-cliquez sur le fichier `.dmg`
2. Glissez `ScoreBowl.app` dans `Applications`
3. Ouvrez `Applications`, puis lancez `ScoreBowl`

### À savoir
- Aucun besoin d'installer Python, Node.js ou autre dépendance
- L'application fonctionne sans abonnement d'hébergement internet

## 📱 Fonctionnalités principales

- ✅ **Ajout de participants** : Bouton "Nouveau" pour ajouter rapidement
- ✅ **3 scores par participant** : Cliquez dans les cellules pour modifier
- ✅ **Calcul automatique** : Le total et le classement se mettent à jour instantly
- ✅ **Actions individuelles** : Menu déroulant par participant (dupliquer, réinitialiser, supprimer)
- ✅ **Recherche** : Barre de recherche pour filtrer les participants
- ✅ **Tri flexible** : Par classement ou nom, avec ordre croissant/décroissant
- ✅ **Remise à zéro** : Bouton "Tout effacer" pour recommencer
- ✅ **Sauvegarde automatique** : Vos données sont toujours sauvegardées
- ✅ **Export/Import** : Sauvegardez et partagez vos concours
- ✅ **Responsive** : Fonctionne sur PC, tablette et smartphone

## 🎯 Utilisation rapide

1. **Cliquez sur "Nouveau"** pour ajouter votre premier participant
2. **Saisissez le nom** du participant
3. **Cliquez dans les cellules de scores** pour entrer les résultats
4. **Appuyez sur Entrée** ou changez de champ pour valider
5. **Le classement se met à jour automatiquement** !

## 🎛️ Fonctionnalités avancées

- **Tri intelligent** : Cliquez sur "Classement" ou "Nom" pour trier. Cliquez à nouveau pour inverser l'ordre (↑/↓)
- **Recherche** : Utilisez la barre de recherche pour filtrer les participants rapidement
- **Actions par participant** : Cliquez sur l'icône ⚙️ de chaque participant pour :
  - 📋 **Dupliquer** : Créer un nouveau participant avec les mêmes scores
  - 🔄 **Réinitialiser** : Remettre tous ses scores à zéro
  - 🗑️ **Supprimer** : Retirer le participant du concours
- **Remise à zéro** : Bouton rouge "Tout effacer" pour supprimer tous les participants en une fois
- **Sauvegarde/Restauration** : Exportez vos données et importez-les sur un autre appareil

## 💾 Gestion des données

- **Sauvegarde** : Automatique dans votre navigateur
- **Export** : Bouton "Exporter" pour télécharger un fichier JSON
- **Import** : Bouton "Importer" pour restaurer des données
- **Partage** : Exportez et envoyez le fichier JSON à d'autres utilisateurs

## 🔧 Problèmes courants

### L'application ne s'ouvre pas
- Vérifiez que JavaScript est activé dans votre navigateur
- Utilisez un navigateur moderne (Chrome, Firefox, Safari, Edge)

### Les données ont disparu
- Vérifiez que vous n'avez pas vidé le cache du navigateur
- Restaurez depuis un export précédent

### L'app ne s'installe pas
- Assurez-vous d'utiliser HTTPS ou localhost
- Essayez avec Chrome ou Edge

## 📋 Raccourcis clavier

- **Entrée** : Valider une modification
- **Tab** : Passer au champ suivant
- **Escape** : Annuler une modification

## 🌐 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (versions récentes)
- **Plateformes** : Windows, macOS, Linux, Android, iOS
- **Appareils** : PC, tablettes, smartphones

## 🎨 Personnalisation

Vous pouvez modifier l'apparence en éditant le fichier `styles.css`. Les couleurs principales sont définies dans la section `:root`.

## 📞 Support

Pour toute question ou suggestion, consultez le fichier `README.md` pour plus de détails techniques.

---

**Amusez-vous bien avec vos concours ! 🏆**
