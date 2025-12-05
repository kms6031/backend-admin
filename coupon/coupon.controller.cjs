const Coupon = require('./model.cjs'); // coupon 폴더의 모델 사용

// 1. 쿠폰 생성하기 (관리자용)
exports.createCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        return res.status(201).json(successResponse('쿠폰 생성 성공', newCoupon, 201));
    } catch (error) {
        console.error('coupon.createCoupon error', error);
        return res.status(500).json(errorResponse('쿠폰 생성 실패', error, 500));
    }
};

const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 2. 모든 쿠폰 목록 조회
exports.getCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, active } = req.query;
        const query = {};

        // 검색 필터
        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } }
            ];
        }

        // 활성화 필터
        if (active !== undefined && active !== '') {
            query.active = active === 'true';
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Coupon.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        return res.json(successResponse('쿠폰 목록 조회 성공', {
            coupons,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('coupon.getCoupons error', error);
        return res.status(500).json(errorResponse('쿠폰 목록 조회 실패', error, 500));
    }
};

// 3. 쿠폰 삭제하기
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        return res.json(successResponse('쿠폰 삭제 완료', null));
    } catch (error) {
        console.error('coupon.deleteCoupon error', error);
        return res.status(500).json(errorResponse('쿠폰 삭제 실패', error, 500));
    }
};