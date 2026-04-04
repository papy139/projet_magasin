const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const { createOrder, getAllOrders, getOrdersByEmail, updateOrderStatus } = require('../controllers/ordersController');

router.post('/', createOrder);
router.get('/by-email', getOrdersByEmail);
router.get('/', adminAuth, getAllOrders);
router.patch('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
