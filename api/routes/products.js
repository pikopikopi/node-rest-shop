const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/product');

// Handle incoming GET requests to /orders
router.get('/', async (req, res, next) => {
  // const handleError = (err) => {
  //   console.log(err);
  //   res.status(500).json({ error: err });
  // };
  const docs = await Product.find().select('-__v').catch(next);
  // console.log(docs);
  const response = {
    count: docs.length,
    products: docs.map(doc => ({
      name: doc.name,
      price: doc.price,
      _id: doc._id, /* eslint no-underscore-dangle: 0 */
      request: {
        type: 'GET',
        url: `localhost:3000/products/${doc._id}`,
      },
    })),
  };
  if (docs.length > 0) {
    res.status(200).json(response);
  } else {
    res.status(404).json({
      message: 'No entries found',
    });
  }
});

router.post('/', async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  const result = await product.save().catch(next);
  res.status(201).json({
    meesage: 'Created product successfully',
    createdProduct: {
      name: result.name,
      price: result.price,
      _id: result._id,
      request: {
        type: 'POST',
        url: `http://localhost:3000/products/${result._id}`,
      },
    },
  });
});
// .catch((err) => {
//   console.log(err);
//   res.status(500).json({
//     error: err,
//   });
// });


// router.get('/:productId', (req, res, next) => {
//   const id = req.params.productId;
//   Product.findById(id).exec().then((doc) => {
//     console.log(doc);
//   }).catch((err) => { console.log(err); });
// });

router.get('/:productId', async (req, res, next) => {
  // const id = req.params.productId;
  // const handleError = (err) => {
  //   console.log(err);
  //   res.status(500).json({ error: err });
  // };
  const doc = await Product.findById(req.params.productId).catch(next);
  // console.log('From database', doc);
  if (doc) {
    res.status(200).json(doc);
  } else {
    res.status(404).json({ message: 'No valid entry found for provided ID' });
  }
});

router.patch('/:productId', async (req, res, next) => {
  // const id = req.params.productId;
  // const handleError = (err) => {
  //   console.log(err);
  //   res.status(500).json({
  //     error: err,
  //   });
  // };
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.valude;
  // }
  // req.body.forEach((ops) => {
  //   updateOps[ops.propName] = ops.value;
  // });
  const result = await Product
    // .updateOne({ _id: id }, { $set: updateOps })
    .findByIdAndUpdate(req.params.productId, req.body, { new: true })
    .catch(next);
  // console.log(result);
  res.status(200).json(result);
});

router.delete('/:productId', async (req, res, next) => {
  // const id = req.params.productId;
  // const handleError = (err) => {
  //   console.log(err);
  //   res.status(500).json({
  //     error: err,
  //   });
  // };
  const result = await Product.findByIdAndRemove(req.params.productId).catch(next);
  res.status(200).json(result);
});

module.exports = router;
