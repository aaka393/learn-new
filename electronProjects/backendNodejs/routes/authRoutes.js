const express = require('express');
const router = express.Router();
const { register, login, logout, verifyToken } = require('../controllers/authController');

router.post('/auth/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verifyToken', verifyToken);

module.exports = router;
