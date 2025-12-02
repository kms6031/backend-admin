const express = require('express');
const router = express.Router();

// 🔴 .cjs 확인!
const usersController = require('./users.controller.cjs'); 

router.get('/', usersController.getAllUsers);

module.exports = router;