const express = require('express');
const router = express.Router();

// 🔴 .cjs 확인!
const reservationController = require('./reservation.controller.cjs');

// 목록 조회
router.get('/', reservationController.getAllReservations);

// 상태 변경 (PUT 방식으로 변경 - 프론트엔드와 일치)
router.put('/:id/status', reservationController.updateStatus);

module.exports = router;