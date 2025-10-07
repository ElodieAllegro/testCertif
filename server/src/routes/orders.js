const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Simulation d'une base de données
let orders = [
  {
    id: 1,
    userId: 2,
    customerInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '0123456789',
      address: '123 Rue Example',
      city: 'Paris',
      zipCode: '75001'
    },
    items: [
      {
        productId: 1,
        productName: 'Air Force 1 Custom Dior',
        quantity: 1,
        price: 29900,
        customization: {
          size: '42',
          colors: ['Blanc', 'Or'],
          patterns: ['Dior Pattern'],
          laces: 'Blanc'
        }
      }
    ],
    totalAmount: 29900,
    status: 'pending', // pending, confirmed, in_production, shipped, delivered, cancelled
    paymentStatus: 'paid', // pending, paid, failed, refunded
    paymentMethod: 'card',
    shippingMethod: 'standard',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextOrderId = 2;

// GET /api/orders - Récupérer toutes les commandes (admin) ou les commandes de l'utilisateur
router.get('/', authenticateToken, (req, res) => {
  const { status, paymentStatus, limit = 10, page = 1 } = req.query;
  
  let filteredOrders = [...orders];
  
  // Si l'utilisateur n'est pas admin, ne montrer que ses commandes
  if (req.user.role !== 'admin') {
    filteredOrders = filteredOrders.filter(o => o.userId === req.user.userId);
  }
  
  // Filtrer par statut
  if (status) {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }
  
  // Filtrer par statut de paiement
  if (paymentStatus) {
    filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
  }
  
  // Trier par date de création (plus récent en premier)
  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  res.json({
    orders: paginatedOrders,
    total: filteredOrders.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredOrders.length / limit)
  });
});

// GET /api/orders/:id - Récupérer une commande par ID
router.get('/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ message: 'Commande non trouvée' });
  }
  
  // Vérifier que l'utilisateur peut accéder à cette commande
  if (req.user.role !== 'admin' && order.userId !== req.user.userId) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  res.json(order);
});

// POST /api/orders - Créer une nouvelle commande
router.post('/',
  authenticateToken,
  [
    body('customerInfo.firstName').notEmpty().withMessage('Le prénom est requis'),
    body('customerInfo.lastName').notEmpty().withMessage('Le nom est requis'),
    body('customerInfo.email').isEmail().withMessage('Email invalide'),
    body('customerInfo.phone').notEmpty().withMessage('Le téléphone est requis'),
    body('customerInfo.address').notEmpty().withMessage('L\'adresse est requise'),
    body('customerInfo.city').notEmpty().withMessage('La ville est requise'),
    body('customerInfo.zipCode').notEmpty().withMessage('Le code postal est requis'),
    body('items').isArray({ min: 1 }).withMessage('Au moins un article est requis'),
    body('paymentMethod').isIn(['card', 'paypal', 'bank_transfer']).withMessage('Méthode de paiement invalide'),
    body('shippingMethod').isIn(['standard', 'express']).withMessage('Méthode de livraison invalide')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { customerInfo, items, paymentMethod, shippingMethod, notes = '' } = req.body;
    
    // Calculer le montant total
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Calculer la date de livraison estimée
    const deliveryDays = shippingMethod === 'express' ? 3 : 7;
    const estimatedDelivery = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toISOString();
    
    const newOrder = {
      id: nextOrderId++,
      userId: req.user.userId,
      customerInfo,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      shippingMethod,
      estimatedDelivery,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    res.status(201).json(newOrder);
  }
);

// PUT /api/orders/:id - Mettre à jour une commande (admin uniquement)
router.put('/:id',
  authenticateToken,
  [
    body('status').optional().isIn(['pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled']),
    body('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded'])
  ],
  (req, res) => {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    const { status, paymentStatus, notes } = req.body;
    
    const updatedOrder = {
      ...orders[orderIndex],
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(notes !== undefined && { notes }),
      updatedAt: new Date().toISOString()
    };
    
    orders[orderIndex] = updatedOrder;
    
    res.json(updatedOrder);
  }
);

// DELETE /api/orders/:id - Annuler une commande
router.delete('/:id', authenticateToken, (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Commande non trouvée' });
  }
  
  const order = orders[orderIndex];
  
  // Vérifier que l'utilisateur peut annuler cette commande
  if (req.user.role !== 'admin' && order.userId !== req.user.userId) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  // Vérifier que la commande peut être annulée
  if (['shipped', 'delivered'].includes(order.status)) {
    return res.status(400).json({ message: 'Cette commande ne peut plus être annulée' });
  }
  
  // Marquer comme annulée au lieu de supprimer
  orders[orderIndex] = {
    ...order,
    status: 'cancelled',
    updatedAt: new Date().toISOString()
  };
  
  res.json({ message: 'Commande annulée avec succès' });
});

// GET /api/orders/stats/summary - Statistiques des commandes (admin uniquement)
router.get('/stats/summary', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((total, order) => total + order.totalAmount, 0);
  
  res.json({
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue
  });
});

module.exports = router;