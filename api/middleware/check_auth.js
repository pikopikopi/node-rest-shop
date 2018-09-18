const jwt = require('jsonwebtoken');
const CONFIG = require('../../CONFIG/CONFIG');

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(new Error('No token'));
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, CONFIG.JWT.JWT_KEY);
    req.userData = decoded;
    return next();
  } catch (error) {
    return next(error);
  }
};
