const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} = require('../controllers/productsController');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.patch('/:id/stock', adminAuth, updateStock);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
