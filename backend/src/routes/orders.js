const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const { createOrder, getAllOrders } = require('../controllers/ordersController');

router.post('/', createOrder);
router.get('/', adminAuth, getAllOrders);

module.exports = router;
