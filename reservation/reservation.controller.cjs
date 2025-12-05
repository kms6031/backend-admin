const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// Booking 모델 사용 (init-data.cjs에서 Booking으로 저장됨)
let Booking;
if (mongoose.models.Booking) {
    Booking = mongoose.models.Booking;
} else {
    const bookingSchema = new mongoose.Schema({}, { strict: false });
    Booking = mongoose.model("Booking", bookingSchema);
}

// 1. 모든 예약 목록 가져오기
exports.getAllReservations = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status, dateFrom, dateTo } = req.query;
        const query = {};

        // 검색 필터
        if (search) {
            query.$or = [
                { hotelName: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } }
            ];
        }

        // 상태 필터
        if (status) {
            query.status = status;
        }

        // 날짜 필터
        if (dateFrom) {
            query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) };
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            query.createdAt = { ...query.createdAt, $lte: toDate };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Booking.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        // 프론트엔드가 기대하는 형식으로 변환
        const formattedBookings = bookings.map((booking, index) => ({
            id: booking._id?.toString() || index + 1,
            hotelName: booking.hotelName,
            userName: booking.userName,
            userEmail: booking.userEmail,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            amount: booking.amount,
            status: booking.status,
            createdAt: booking.createdAt
        }));

        return res.json(successResponse('예약 목록 조회 성공', {
            bookings: formattedBookings,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('reservation.getAllReservations error', error);
        return res.status(500).json(errorResponse('예약 목록 조회 실패', error, 500));
    }
};

// 2. 예약 상태 변경하기
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json(errorResponse('예약을 찾을 수 없습니다', null, 404));
        }

        return res.json(successResponse('예약 상태 변경 성공', updatedBooking));
    } catch (error) {
        console.error('reservation.updateStatus error', error);
        return res.status(500).json(errorResponse('상태 변경 실패', error, 500));
    }
};