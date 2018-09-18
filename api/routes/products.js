/* eslint no-underscore-dangle: 0 */

const express = require('express');
const checkAuth = require('../middleware/check_auth');
const upload = require('../middleware/upload');
const ProductsController = require('../controllers/products');

const router = express.Router();

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, upload.single('productImage'), ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;
