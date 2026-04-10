# Vigilance Météo Canada 🇨🇦

Une application web moderne pour visualiser les alertes météorologiques d'Environnement et Changement Climatique Canada (ECCC).

## Fonctionnalités

- 🗺️ **Carte interactive** - Visualisation des zones affectées par les alertes
- 📋 **Liste détaillée** - Sidebar avec toutes les alertes actives
- 🎨 **Design moderne** - Interface utilisateur améliorée avec thème professionnel
- 🔄 **Actualisation automatique** - Mise à jour toutes les 5 minutes
- 📱 **Responsive** - Compatible mobile et desktop
- ⚡ **CORS configuré** - Proxy backend pour éviter les problèmes de sécurité

## Architecture

L'application utilise une architecture client-serveur pour contourner les restrictions CORS :

```
┌─────────────┐      ┌──────────────┐      ┌──────────────────┐
│   Browser   │ ───► │ Node.js Server│ ───► │ ECCC Weather API │
│  (index.html)│ ◄─── │  (server.js) │ ◄─── │  (weather.gc.ca) │
└─────────────┘      └──────────────┘      └──────────────────┘
```

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur backend
node server.js

# Le serveur est disponible sur http://localhost:3000
```

## Utilisation

1. **Démarrer le serveur** : `node server.js`
2. **Ouvrir l'application** : Ouvrez `index.html` dans votre navigateur
3. **Consulter les alertes** : Les alertes s'affichent automatiquement sur la carte et dans la sidebar

## Endpoints API

| Endpoint | Description |
|----------|-------------|
| `GET /api/alerts` | Récupère les alertes météorologiques actives |
| `GET /health` | Vérifie l'état du serveur |

## Améliorations apportées

### CORS
- Configuration CORS complète avec tous les headers nécessaires
- Support des méthodes GET, POST, PUT, DELETE, OPTIONS
- Headers de cache pour éviter la mise en cache des données

### Design
- 🎨 Palette de couleurs moderne (Slate/Blue theme)
- 📐 Typographie Inter pour une meilleure lisibilité
- ✨ Animations fluides (hover, loading, transitions)
- 📊 Legend grid organisée
- 🔄 Bouton d'actualisation avec animation
- 📍 Status indicator avec point pulsant
- 🕐 Horodatage de dernière mise à jour
- 📱 Design responsive pour mobile
- 🎯 Cartes d'alertes avec icônes emoji
- 🗨️ Popups map stylisées

### Code
- Gestion d'erreur améliorée
- Timeout configurable pour les requêtes
- Validation des données
- Logging détaillé
- Global error handler

## Structure des fichiers

```
/workspace
├── index.html      # Frontend (HTML/CSS/JS)
├── server.js       # Backend (Node.js/Express)
├── styles.css      # Styles additionnels (optionnel)
├── package.json    # Dépendances npm
└── README.md       # Ce fichier
```

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript (ES6+), Leaflet.js
- **Backend** : Node.js, Express, Axios, CORS
- **Map** : Leaflet + CartoDB Voyager tiles
- **Data** : Environnement et Changement Climatique Canada (ECCC)

## Notes

- L'application nécessite une connexion Internet pour récupérer les données météo
- Le serveur doit être démarré avant d'utiliser l'application
- Les alertes sont automatiquement actualisées toutes les 5 minutes

## License

MIT
