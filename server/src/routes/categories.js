const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Simulation d'une base de données
let categories = [
  {
    id: 1,
    name: 'Nike',
    slug: 'nike',
    description: 'Personnalisez vos Nike préférées',
    parentId: null,
    order: 1,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Adidas',
    slug: 'adidas',
    description: 'Créez vos Adidas uniques',
    parentId: null,
    order: 2,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Converse',
    slug: 'converse',
    description: 'Personnalisez vos Converse',
    parentId: null,
    order: 3,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Vans',
    slug: 'vans',
    description: 'Customisez vos Vans',
    parentId: null,
    order: 4,
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

let nextId = 5;

// GET /api/categories - Récupérer toutes les catégories
router.get('/', (req, res) => {
  const { parent, status } = req.query;
  
  let filteredCategories = [...categories];
  
  // Filtrer par parent
  if (parent !== undefined) {
    const parentId = parent === 'null' ? null : parseInt(parent);
    filteredCategories = filteredCategories.filter(c => c.parentId === parentId);
  }
  
  // Filtrer par statut
  if (status) {
    filteredCategories = filteredCategories.filter(c => c.status === status);
  }
  
  // Trier par ordre
  filteredCategories.sort((a, b) => a.order - b.order);
  
  res.json(filteredCategories);
});

// GET /api/categories/:id - Récupérer une catégorie par ID
router.get('/:id', (req, res) => {
  const category = categories.find(c => c.id === parseInt(req.params.id));
  
  if (!category) {
    return res.status(404).json({ message: 'Catégorie non trouvée' });
  }
  
  res.json(category);
});

// GET /api/categories/slug/:slug - Récupérer une catégorie par slug
router.get('/slug/:slug', (req, res) => {
  const category = categories.find(c => c.slug === req.params.slug);
  
  if (!category) {
    return res.status(404).json({ message: 'Catégorie non trouvée' });
  }
  
  res.json(category);
});

// POST /api/categories - Créer une nouvelle catégorie
router.post('/',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('description').optional().isString(),
    body('parentId').optional().isNumeric(),
    body('order').optional().isNumeric()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, parentId, order, status = 'active' } = req.body;
    
    // Vérifier si le slug existe déjà
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const existingCategory = categories.find(c => c.slug === slug);
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Une catégorie avec ce nom existe déjà' });
    }
    
    const newCategory = {
      id: nextId++,
      name,
      slug,
      description: description || '',
      parentId: parentId ? parseInt(parentId) : null,
      order: order ? parseInt(order) : categories.length + 1,
      status,
      createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    
    res.status(201).json(newCategory);
  }
);

// PUT /api/categories/:id - Mettre à jour une catégorie
router.put('/:id',
  [
    body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('description').optional().isString(),
    body('parentId').optional().isNumeric(),
    body('order').optional().isNumeric()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const categoryIndex = categories.findIndex(c => c.id === parseInt(req.params.id));
    
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    const { name, description, parentId, order, status } = req.body;
    
    const updatedCategory = {
      ...categories[categoryIndex],
      ...(name && { name, slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }),
      ...(description !== undefined && { description }),
      ...(parentId !== undefined && { parentId: parentId ? parseInt(parentId) : null }),
      ...(order !== undefined && { order: parseInt(order) }),
      ...(status && { status })
    };
    
    categories[categoryIndex] = updatedCategory;
    
    res.json(updatedCategory);
  }
);

// DELETE /api/categories/:id - Supprimer une catégorie
router.delete('/:id', (req, res) => {
  const categoryIndex = categories.findIndex(c => c.id === parseInt(req.params.id));
  
  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Catégorie non trouvée' });
  }
  
  // Vérifier s'il y a des sous-catégories
  const hasChildren = categories.some(c => c.parentId === parseInt(req.params.id));
  
  if (hasChildren) {
    return res.status(400).json({ message: 'Impossible de supprimer une catégorie qui a des sous-catégories' });
  }
  
  categories.splice(categoryIndex, 1);
  
  res.json({ message: 'Catégorie supprimée avec succès' });
});

module.exports = router;