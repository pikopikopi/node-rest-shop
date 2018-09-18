/* eslint no-underscore-dangle: 0 */

const express = require('express');
const checkAuth = require('../middleware/check_auth');
const OrdersController = require('../controllers/orders');

const router = express.Router();

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;
