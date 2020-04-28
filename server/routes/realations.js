const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const relationsController = require('../controllers/relations');
const router = express.Router();

router.post('/findUsers', [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must contain at least 5 characters.'),
], isAuth, relationsController.findUsers);

router.put('/sendInvitation', isAuth, relationsController.sendInvitation);

router.put('/acceptInvitation', isAuth, relationsController.acceptInvitation);

router.put('/decline-invitation', isAuth, relationsController.declineInvitation);

router.put('/add-message', isAuth, relationsController.addMessage);


module.exports = router;