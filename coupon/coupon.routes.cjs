const express = require('express');
const router = express.Router();

// 🔴 .cjs 확인!
const couponController = require('./coupon.controller.cjs');

router.get('/', couponController.getCoupons);
router.post('/', couponController.createCoupon);
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;