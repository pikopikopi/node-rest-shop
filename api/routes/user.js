/* eslint no-underscore-dangle: 0 */

const express = require('express');
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;
