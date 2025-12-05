const express = require('express');
const router = express.Router();

const controller = require('./controller.cjs'); 

router.post('/register', controller.register);
router.post('/login', controller.login);

// ▼ 로그아웃 라우트 추가
router.post('/logout', controller.logout);

module.exports = router;