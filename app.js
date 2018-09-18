const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const CONFIG = require('./CONFIG/CONFIG');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
// const bodyParser = require('body-parser');

const app = express();


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(CONFIG.DB.URL, { useNewUrlParser: true });

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  return next();
});


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});


module.exports = app;
