const express = require('express');
const router = express.Router();
const { createUser, getUser, getAllUsers } = require('../controllers/userController');

router.post('/create_user', createUser);
router.get('/users:id', getUser);
router.get('/', getAllUsers)

module.exports = router;
