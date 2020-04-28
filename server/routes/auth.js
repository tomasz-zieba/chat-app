const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Password must contain at least 5 characters.'),
  body('name')
    .trim()
    .custom((value) => User.findOne({ name: value }).then((userDoc) => {
      if (userDoc) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('User name already exist!');
      }
      return true;
    }))
    .not()
    .isEmpty()
    .withMessage('Please enter a valid name.'),
],
authController.signup);

router.post('/login', authController.login);

router.post('/auto-login', isAuth, authController.autoLogin);


module.exports = router;
