const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Simulation d'une base de données utilisateurs
let users = [
  {
    id: 1,
    email: 'admin@customsneakers.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

let nextUserId = 3;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// POST /api/auth/register - Inscription
router.post('/register',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('firstName').notEmpty().withMessage('Le prénom est requis'),
    body('lastName').notEmpty().withMessage('Le nom est requis')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    try {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer le nouvel utilisateur
      const newUser = {
        id: nextUserId++,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

      // Générer le token JWT
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
  }
);

// POST /api/auth/login - Connexion
router.post('/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Trouver l'utilisateur
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        return res.status(401).json({ message: 'Compte désactivé' });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Connexion réussie',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }
);

// GET /api/auth/me - Récupérer les informations de l'utilisateur connecté
router.get('/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// POST /api/auth/refresh - Rafraîchir le token
router.post('/refresh', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Utilisateur non autorisé' });
  }

  // Générer un nouveau token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// POST /api/auth/logout - Déconnexion (côté client principalement)
router.post('/logout', authenticateToken, (req, res) => {
  // Dans une vraie application, on pourrait blacklister le token
  res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;