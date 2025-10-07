const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/patterns'));
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
let patterns = [
  {
    id: 1,
    name: 'Dior Pattern',
    ref: 'DIOR-001',
    description: 'Pattern inspiré de la marque Dior',
    image: 'pattern-dior.jpg',
    category: 'Luxury',
    price: 5000, // Prix supplémentaire en centimes
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Gucci Blue',
    ref: 'GUCCI-BLUE-001',
    description: 'Pattern Gucci en bleu',
    image: 'pattern-gucci-blue.jpg',
    category: 'Luxury',
    price: 4500,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Supreme Red',
    ref: 'SUPREME-RED-001',
    description: 'Pattern Supreme rouge classique',
    image: 'pattern-supreme-red.jpg',
    category: 'Streetwear',
    price: 3000,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Louis Vuitton',
    ref: 'LV-CLASSIC-001',
    description: 'Pattern Louis Vuitton classique',
    image: 'pattern-lv-classic.jpg',
    category: 'Luxury',
    price: 5500,
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

let nextId = 5;

// GET /api/patterns - Récupérer tous les patterns
router.get('/', (req, res) => {
  const { category, search, status, limit = 10, page = 1 } = req.query;
  
  let filteredPatterns = [...patterns];
  
  // Filtrer par catégorie
  if (category) {
    filteredPatterns = filteredPatterns.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filtrer par recherche
  if (search) {
    filteredPatterns = filteredPatterns.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Filtrer par statut
  if (status) {
    filteredPatterns = filteredPatterns.filter(p => p.status === status);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPatterns = filteredPatterns.slice(startIndex, endIndex);
  
  res.json({
    patterns: paginatedPatterns,
    total: filteredPatterns.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredPatterns.length / limit)
  });
});

// GET /api/patterns/:id - Récupérer un pattern par ID
router.get('/:id', (req, res) => {
  const pattern = patterns.find(p => p.id === parseInt(req.params.id));
  
  if (!pattern) {
    return res.status(404).json({ message: 'Pattern non trouvé' });
  }
  
  res.json(pattern);
});

// POST /api/patterns - Créer un nouveau pattern
router.post('/', 
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('ref').notEmpty().withMessage('La référence est requise'),
    body('description').optional().isString(),
    body('category').notEmpty().withMessage('La catégorie est requise'),
    body('price').optional().isNumeric().withMessage('Le prix doit être un nombre')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, ref, description, category, price = 0, status = 'active' } = req.body;
    
    // Vérifier si la référence existe déjà
    const existingPattern = patterns.find(p => p.ref === ref);
    if (existingPattern) {
      return res.status(400).json({ message: 'Un pattern avec cette référence existe déjà' });
    }
    
    const image = req.file ? req.file.filename : null;
    
    if (!image) {
      return res.status(400).json({ message: 'Une image est requise' });
    }
    
    const newPattern = {
      id: nextId++,
      name,
      ref,
      description: description || '',
      image,
      category,
      price: parseInt(price),
      status,
      createdAt: new Date().toISOString()
    };
    
    patterns.push(newPattern);
    
    res.status(201).json(newPattern);
  }
);

// PUT /api/patterns/:id - Mettre à jour un pattern
router.put('/:id',
  upload.single('image'),
  [
    body('name').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('ref').optional().notEmpty().withMessage('La référence ne peut pas être vide'),
    body('description').optional().isString(),
    body('category').optional().notEmpty().withMessage('La catégorie ne peut pas être vide'),
    body('price').optional().isNumeric().withMessage('Le prix doit être un nombre')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const patternIndex = patterns.findIndex(p => p.id === parseInt(req.params.id));
    
    if (patternIndex === -1) {
      return res.status(404).json({ message: 'Pattern non trouvé' });
    }
    
    const { name, ref, description, category, price, status } = req.body;
    
    // Vérifier si la nouvelle référence existe déjà (si elle est différente)
    if (ref && ref !== patterns[patternIndex].ref) {
      const existingPattern = patterns.find(p => p.ref === ref);
      if (existingPattern) {
        return res.status(400).json({ message: 'Un pattern avec cette référence existe déjà' });
      }
    }
    
    const updatedPattern = {
      ...patterns[patternIndex],
      ...(name && { name }),
      ...(ref && { ref }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(price !== undefined && { price: parseInt(price) }),
      ...(status && { status })
    };
    
    // Mettre à jour l'image si une nouvelle est uploadée
    if (req.file) {
      updatedPattern.image = req.file.filename;
    }
    
    patterns[patternIndex] = updatedPattern;
    
    res.json(updatedPattern);
  }
);

// DELETE /api/patterns/:id - Supprimer un pattern
router.delete('/:id', (req, res) => {
  const patternIndex = patterns.findIndex(p => p.id === parseInt(req.params.id));
  
  if (patternIndex === -1) {
    return res.status(404).json({ message: 'Pattern non trouvé' });
  }
  
  patterns.splice(patternIndex, 1);
  
  res.json({ message: 'Pattern supprimé avec succès' });
});

// GET /api/patterns/category/:category - Récupérer les patterns par catégorie
router.get('/category/:category', (req, res) => {
  const categoryPatterns = patterns.filter(p => 
    p.category.toLowerCase() === req.params.category.toLowerCase() && 
    p.status === 'active'
  );
  
  res.json(categoryPatterns);
});

module.exports = router;