# Custom Sneakers E-commerce Platform

Une plateforme e-commerce moderne pour la personnalisation de sneakers, construite avec Next.js pour le frontend et Express.js pour le backend.

## 🚀 Fonctionnalités

### Frontend (Next.js)
- **Interface utilisateur moderne** avec Tailwind CSS
- **Catalogue de produits** avec filtres et recherche
- **Système d'authentification** complet
- **Dashboard administrateur** pour la gestion
- **Responsive design** pour tous les appareils
- **Optimisations SEO** intégrées

### Backend (Express.js)
- **API RESTful** complète
- **Authentification JWT** sécurisée
- **Upload d'images** avec Multer
- **Validation des données** avec express-validator
- **Gestion des rôles** (utilisateur/admin)
- **CORS** configuré pour le développement

### Fonctionnalités métier
- **Gestion des produits** (sneakers de base)
- **Système de patterns** pour la personnalisation
- **Gestion des catégories** (Nike, Adidas, Converse, Vans)
- **Système de commandes** complet
- **Dashboard administrateur** avec statistiques
- **Gestion des utilisateurs**

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Hook Form** - Gestion des formulaires
- **Axios** - Client HTTP
- **React Hot Toast** - Notifications
- **Lucide React** - Icônes

### Backend
- **Express.js** - Framework Node.js
- **JWT** - Authentification
- **Bcrypt** - Hachage des mots de passe
- **Multer** - Upload de fichiers
- **Express Validator** - Validation des données
- **CORS** - Gestion des requêtes cross-origin

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation complète
```bash
# Cloner le repository
git clone <repository-url>
cd custom-sneakers-app

# Installer toutes les dépendances
npm run install:all

# Configurer les variables d'environnement
cp server/.env.example server/.env
# Éditer server/.env avec vos valeurs

# Créer les dossiers d'upload
mkdir -p server/uploads/products
mkdir -p server/uploads/patterns
```

### Développement
```bash
# Démarrer le frontend et backend simultanément
npm run dev

# Ou démarrer séparément :
# Frontend (port 3000)
npm run dev:client

# Backend (port 5000)
npm run dev:server
```

### Production
```bash
# Build du frontend
npm run build

# Démarrer le serveur de production
npm start
```

## 🏗️ Structure du projet

```
custom-sneakers-app/
├── client/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/           # App Router de Next.js
│   │   ├── components/    # Composants React
│   │   └── lib/          # Utilitaires
│   ├── public/           # Assets statiques
│   └── package.json
├── server/                # Backend Express.js
│   ├── src/
│   │   ├── routes/       # Routes API
│   │   └── index.js      # Point d'entrée
│   ├── uploads/          # Fichiers uploadés
│   └── package.json
└── package.json          # Scripts globaux
```

## 🔧 Configuration

### Variables d'environnement (Backend)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

### Configuration Next.js
Le fichier `next.config.js` est configuré pour :
- Proxy des requêtes API vers le backend
- Optimisation des images
- Support des domaines d'images

## 📱 Fonctionnalités détaillées

### Dashboard Administrateur
- **Vue d'ensemble** avec statistiques
- **Gestion des produits** (CRUD complet)
- **Gestion des patterns** pour personnalisation
- **Gestion des commandes** et suivi
- **Gestion des utilisateurs**

### Interface Client
- **Catalogue produits** avec filtres
- **Pages de détail** produit
- **Système de panier** (à implémenter)
- **Processus de commande** complet
- **Compte utilisateur**

### API Endpoints

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/refresh` - Rafraîchir le token

#### Produits
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

#### Patterns
- `GET /api/patterns` - Liste des patterns
- `POST /api/patterns` - Créer un pattern
- `PUT /api/patterns/:id` - Modifier un pattern
- `DELETE /api/patterns/:id` - Supprimer un pattern

#### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Modifier une commande
- `DELETE /api/orders/:id` - Annuler une commande

## 🔐 Sécurité

- **Authentification JWT** avec expiration
- **Hachage des mots de passe** avec bcrypt
- **Validation des données** côté serveur
- **Gestion des rôles** utilisateur/admin
- **Upload sécurisé** avec validation des types de fichiers
- **CORS** configuré pour la production

## 🚀 Déploiement

### Frontend (Vercel recommandé)
```bash
# Build de production
cd client && npm run build

# Déployer sur Vercel
vercel --prod
```

### Backend (Railway, Heroku, ou VPS)
```bash
# Variables d'environnement à configurer :
# PORT, JWT_SECRET, NODE_ENV=production

# Démarrer en production
cd server && npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Créer une issue sur GitHub
- Email : support@customsneakers.com

## 🔄 Roadmap

- [ ] Système de panier complet
- [ ] Intégration paiement (Stripe)
- [ ] Notifications en temps réel
- [ ] Chat support client
- [ ] Application mobile (React Native)
- [ ] Système de reviews/notes
- [ ] Programme de fidélité
- [ ] Multi-langues