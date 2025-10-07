const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/products'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Simulation d'une base de données
let products = [
  {
    id: 1,
    name: 'Air Force 1 Base',
    description: 'Sneaker Nike Air Force 1 prête pour la personnalisation',
    price: 19900, // Prix en centimes
    stock: 15,
    categoryId: 1,
    category: 'Nike',
    images: ['af1-base.jpg'],
    colors: ['Blanc', 'Noir'],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    patterns: [],
    slug: 'air-force-1-base',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jordan Mid Base',
    description: 'Sneaker Jordan Mid prête pour la personnalisation',
    price: 24900,
    stock: 8,
    categoryId: 1,
    category: 'Nike',
    images: ['jordan-mid-base.jpg'],
    colors: ['Blanc', 'Noir', 'Rouge'],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    patterns: [],
    slug: 'jordan-mid-base',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// GET /api/products - Récupérer tous les produits
router.get('/', (req, res) => {
  const { category, search, status, limit = 10, page = 1 } = req.query;
  
  let filteredProducts = [...products];
  
  // Filtrer par catégorie
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filtrer par recherche
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Filtrer par statut
  if (status) {
    filteredProducts = filteredProducts.filter(p => p.status === status);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    total: filteredProducts.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredProducts.length / limit)
  });
});

// GET /api/products/:id - Récupérer un produit par ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }
  
  res.json(product);
});

// POST /api/products - Créer un nouveau produit
router.post('/', 
  upload.array('images', 5),
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('description').notEmpty().withMessage('La description est requise'),
    body('price').isNumeric().withMessage('Le prix doit être un nombre'),
    body('stock').isNumeric().withMessage('Le stock doit être un nombre'),
    body('categoryId').isNumeric().withMessage('La catégorie est requise')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, price, stock, categoryId, category, colors, sizes, patterns, status = 'active' } = req.body;
    
    const images = req.files ? req.files.map(file => file.filename) : [];
    
    const newProduct = {
      id: nextId++,
      name,
      description,
      price: parseInt(price),
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      category,
      images,
      colors: Array.isArray(colors) ? colors : [colors].filter(Boolean),
      sizes: Array.isArray(sizes) ? sizes : [sizes].filter(Boolean),
      patterns: Array.isArray(patterns) ? patterns : [patterns].filter(Boolean),
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      status,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.status(201).json(newProduct);
  }
);

// PUT /api/products/:id - Mettre à jour un produit
router.put('/:id',
  upload.array('images', 5),
  [
    body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('price').optional().isNumeric().withMessage('Le prix doit être un nombre'),
    body('stock').optional().isNumeric().withMessage('Le stock doit être un nombre')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    const { name, description, price, stock, categoryId, category, colors, sizes, patterns, status } = req.body;
    
    const updatedProduct = {
      ...products[productIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: parseInt(price) }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(category && { category }),
      ...(colors && { colors: Array.isArray(colors) ? colors : [colors].filter(Boolean) }),
      ...(sizes && { sizes: Array.isArray(sizes) ? sizes : [sizes].filter(Boolean) }),
      ...(patterns && { patterns: Array.isArray(patterns) ? patterns : [patterns].filter(Boolean) }),
      ...(status && { status }),
      ...(name && { slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') })
    };
    
    // Ajouter nouvelles images si uploadées
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      updatedProduct.images = [...updatedProduct.images, ...newImages];
    }
    
    products[productIndex] = updatedProduct;
    
    res.json(updatedProduct);
  }
);

// DELETE /api/products/:id - Supprimer un produit
router.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }
  
  products.splice(productIndex, 1);
  
  res.json({ message: 'Produit supprimé avec succès' });
});

// GET /api/products/category/:categorySlug - Récupérer les produits par catégorie
router.get('/category/:categorySlug', (req, res) => {
  const categoryProducts = products.filter(p => 
    p.category.toLowerCase() === req.params.categorySlug.toLowerCase()
  );
  
  res.json(categoryProducts);
});

module.exports = router;