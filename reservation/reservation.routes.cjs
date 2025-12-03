const express = require('express');
const router = express.Router();

// 🔴 .cjs 확인!
const reservationController = require('./reservation.controller.cjs');

// 목록 조회
router.get('/', reservationController.getAllReservations);

// 상태 변경
router.patch('/:id/status', reservationController.updateStatus);

module.exports = router;