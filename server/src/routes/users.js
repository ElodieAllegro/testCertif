const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Récupérer les utilisateurs depuis le module auth
const authModule = require('./auth');

// GET /api/users - Récupérer tous les utilisateurs (admin uniquement)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  const { search, role, status, limit = 10, page = 1 } = req.query;
  
  // Simulation - dans une vraie app, on récupérerait depuis la DB
  let users = [
    {
      id: 1,
      email: 'admin@customsneakers.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];
  
  let filteredUsers = [...users];
  
  // Filtrer par recherche
  if (search) {
    filteredUsers = filteredUsers.filter(u =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Filtrer par rôle
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }
  
  // Filtrer par statut
  if (status) {
    const isActive = status === 'active';
    filteredUsers = filteredUsers.filter(u => u.isActive === isActive);
  }
  
  // Trier par date de création
  filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    users: paginatedUsers,
    total: filteredUsers.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredUsers.length / limit)
  });
});

// GET /api/users/:id - Récupérer un utilisateur par ID
router.get('/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  
  // Un utilisateur ne peut voir que ses propres infos, sauf s'il est admin
  if (req.user.role !== 'admin' && req.user.userId !== userId) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  // Simulation - récupérer l'utilisateur
  const user = {
    id: userId,
    email: userId === 1 ? 'admin@customsneakers.com' : 'user@example.com',
    firstName: userId === 1 ? 'Admin' : 'John',
    lastName: userId === 1 ? 'User' : 'Doe',
    role: userId === 1 ? 'admin' : 'user',
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  
  res.json(user);
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id',
  authenticateToken,
  [
    body('firstName').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
    body('lastName').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('email').optional().isEmail().withMessage('Email invalide'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Rôle invalide'),
    body('isActive').optional().isBoolean().withMessage('Le statut doit être un booléen')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = parseInt(req.params.id);
    
    // Un utilisateur ne peut modifier que ses propres infos (sauf admin)
    // Un admin peut modifier n'importe quel utilisateur
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const { firstName, lastName, email, role, isActive, currentPassword, newPassword } = req.body;
    
    // Si un utilisateur non-admin essaie de changer son rôle ou statut
    if (req.user.role !== 'admin' && (role || isActive !== undefined)) {
      return res.status(403).json({ message: 'Vous ne pouvez pas modifier ces champs' });
    }
    
    // Simulation de mise à jour
    const updatedUser = {
      id: userId,
      email: email || (userId === 1 ? 'admin@customsneakers.com' : 'user@example.com'),
      firstName: firstName || (userId === 1 ? 'Admin' : 'John'),
      lastName: lastName || (userId === 1 ? 'User' : 'Doe'),
      role: role || (userId === 1 ? 'admin' : 'user'),
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date().toISOString()
    };
    
    // Gestion du changement de mot de passe
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Le mot de passe actuel est requis' });
      }
      
      // Ici on vérifierait le mot de passe actuel et on hasherait le nouveau
      // Pour la simulation, on accepte tout
    }
    
    res.json(updatedUser);
  }
);

// DELETE /api/users/:id - Supprimer/désactiver un utilisateur (admin uniquement)
router.delete('/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  const userId = parseInt(req.params.id);
  
  // Empêcher la suppression de son propre compte
  if (req.user.userId === userId) {
    return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
  }
  
  // Simulation - marquer comme inactif au lieu de supprimer
  res.json({ message: 'Utilisateur désactivé avec succès' });
});

// GET /api/users/stats/summary - Statistiques des utilisateurs (admin uniquement)
router.get('/stats/summary', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  // Simulation des statistiques
  const stats = {
    totalUsers: 156,
    activeUsers: 142,
    newUsersThisMonth: 23,
    adminUsers: 3
  };
  
  res.json(stats);
});

module.exports = router;