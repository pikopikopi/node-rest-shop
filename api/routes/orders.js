/* eslint no-underscore-dangle: 0 */

const express = require('express');

const mongoose = require('mongoose');

const Order = require('../models/order');

const Product = require('../models/product');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const docs = await Order.find().catch(next);
  res.status(200).json({
    count: docs.length,
    orders: docs.map(doc => (
      {
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${doc._id}`,
        },
      })),
  });
});

router.post('/', async (req, res, next) => {
  const product = await Product.findById(req.body.productId).catch(next);
  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    product: req.body.productId,
    quantity: req.body.quantity,
  });
  const result = await order.save().catch(next);
  return res.status(201).json({
    message: 'Order stored',
    createdOrder: {
      _id: result._id,
      product: result.product,
      quantity: result.quantity,
    },
    request: {
      type: 'GET',
      url: `http://localhost:3000/${result._id}`,
    },
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order details',
    orderId: req.params.orderId,
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted',
    orderId: req.params.orderId,
  });
});

module.exports = router;
