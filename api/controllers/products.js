/* eslint no-underscore-dangle: 0 */

const mongoose = require('mongoose');
const Product = require('../models/product');

// router.get('/', ProductsController.products_get_all);
module.exports.products_get_all = async (req, res, next) => {
  const docs = await Product.find().catch(next);
  // console.log(docs);
  const response = {
    count: docs.length,
    products: docs.map(doc => ({
      name: doc.name,
      price: doc.price,
      productImage: doc.productImage,
      _id: doc._id,
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${doc._id}`,
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
};

// router.post('/', checkAuth, upload.single('productImage'),
//             ProductsController.products_create_product);
module.exports.products_create_product = async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  const result = await product.save().catch(next);
  res.status(201).json({
    meesage: 'Created product successfully',
    createdProduct: {
      name: result.name,
      price: result.price,
      _id: result._id,
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${result._id}`,
      },
    },
  });
};

// router.get('/:productId', ProductsController.products_get_product);
module.exports.products_get_product = async (req, res, next) => {
  const doc = await Product.findById(req.params.productId).select('-__v').catch(next);
  if (doc) {
    res.status(200).json({
      product: doc,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/products',
      },
    });
  } else {
    res.status(404).json({ message: 'No valid entry found for provided ID' });
  }
};

// router.patch('/:productId', checkAuth, ProductsController.products_update_product);
module.exports.products_update_product = async (req, res, next) => {
  const result = await Product
    .findByIdAndUpdate(req.params.productId, req.body, { new: true })
    .catch(next);
  res.status(200).json({
    message: 'Product updated',
    result,
    request: {
      type: 'GET',
      url: `http://localhost:3000/products/${result._id}`,
    },
  });
};

// router.delete('/:productId', checkAuth, ProductsController.products_delete_product);
module.exports.products_delete_product = async (req, res, next) => {
  const result = await Product.findByIdAndDelete(req.params.productId).catch(next);
  res.status(200).json({
    message: 'Product deleted',
    request: {
      result,
      type: 'POST',
      url: 'http://localhost:3000/products',
      body: { name: 'String', price: 'Number' },
    },
  });
};
