const express = require('express');
const { 
  getAllProperties, 
  createProperty, 
  deleteProperty, 
  getOneProperties, 
  updateProperty // Make sure to import the updated controller
} = require('../controllers/propertyController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure 'uploads' directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  },
});

// Multer upload setup
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

// Property routes
router.get('/', getAllProperties);
router.get('/:id', authMiddleware, getOneProperties);

// Create property (with image upload)
router.post(
  '/', 
  authMiddleware, 
  adminOnly, 
  upload.single('image'), 
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }
    next();
  }, 
  createProperty
);

// Update property (with optional image upload)
router.put(
  '/:id', 
  authMiddleware, 
  adminOnly, 
  upload.single('image'), // This handles image upload if provided
  updateProperty
);

// Delete property
router.delete('/:id', authMiddleware, adminOnly, deleteProperty);

module.exports = router;
