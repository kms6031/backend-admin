// 🔴 [수정] 뒤에 .cjs 를 꼭 붙여야 합니다!
const Reservation = require('../models/Reservation.cjs');

// 1. 모든 예약 목록 가져오기
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "예약 목록 조회 실패" });
    }
};

// 2. 예약 상태 변경하기
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: "상태 변경 실패" });
    }
};