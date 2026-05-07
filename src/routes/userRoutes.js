const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect, admin } = require('../middlewares/authMiddleware');

// --- Rutas Públicas ---
// Obtener todos los productos y obtener uno por ID
router.route('/')
  .get(getProducts);

router.route('/:id')
  .get(getProductById);

// --- Rutas Privadas (Solo Administrador) ---
// Se recomienda usar router.route para agrupar métodos en la misma URL
router.route('/')
  .post(protect, admin, createProduct);

router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;