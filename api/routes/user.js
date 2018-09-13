/* eslint no-underscore-dangle: 0 */
const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const CONFIG = require('../../CONFIG/CONFIG');

router.post('/signup', async (req, res, next) => {
  const doc = await User.findOne({ email: req.body.email }).catch(next);
  if (doc) {
    return res.status(409).json({
      message: 'Mail exists',
    });
  }
  return bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hash,
    });
    const result = await user.save().catch(next);
    console.log(result);
    return res.status(201).json({
      message: 'User created',
    });
  });
});

router.post('/login', async (req, res, next) => {
  console.log(CONFIG);
  const user = await User.findOne({ email: req.body.email }).catch(next);
  if (!user) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
  const match = await bcrypt.compare(req.body.password, user.password).catch(next);
  if (match) {
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      CONFIG.JWT.JWT_KEY,
      { expiresIn: '1h' },
    );
    return res.status(200).json({
      message: 'Auth successful',
      token,
    });
  }
  return res.status(401).json({
    message: 'Auth failed',
  });
});


router.delete('/:userId', async (req, res, next) => {
  const result = await User.deleteOne({ _id: req.params.userId }).catch(next);
  return res.status(200).json({
    result,
    message: 'User deleted',
  });
});
module.exports = router;
