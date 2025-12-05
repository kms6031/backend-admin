require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

// 1. 공유 설정 및 미들웨어
const { connectDB } = require('./shared/config/database.cjs');
const { corsOptions } = require('./shared/config/cors.cjs');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler.cjs');

// 2. 도메인 라우트 불러오기
const authRoutes = require('./auth/routes.cjs');
const usersRoutes = require('./users/users.routes.cjs');
const reservationRoutes = require('./reservation/reservation.routes.cjs');
const hotelRoutes = require('./hotel/hotel.routes.cjs');
const couponRoutes = require('./coupon/coupon.routes.cjs');
const reviewRoutes = require('./review/review.routes.cjs');
const dashboardRoutes = require('./dashboard/routes.cjs');

// 3. 앱(Express) 설정
const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// DB 연결
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// 헬스 체크
app.get('/', (req, res) => {
    res.json({ message: 'Backend Server is Running!', timestamp: new Date() });
});

// 4. API 라우트 등록 (▼ 여기가 수정되었습니다!)
// 프론트엔드가 요청하는 주소(/admin/...)에 맞춰서 경로를 매핑해줍니다.

app.use('/api/auth', authRoutes); // 로그인은 그대로 둠

// [수정] 호텔 관리 주소 변경 (/api/hotel -> /api/admin/hotels)
app.use('/api/admin/hotels', hotelRoutes); 

// [수정] 회원 관리 주소 변경 (/api/users -> /api/admin/users)
app.use('/api/admin/users', usersRoutes);

// [수정] 예약 관리 주소 변경 (/api/reservation -> /api/admin/bookings)
// 주의: 프론트엔드는 bookings라고 부르고 백엔드 파일은 reservation입니다. 매핑을 맞춰줍니다.
app.use('/api/admin/bookings', reservationRoutes);

// [수정] 쿠폰 관리 주소 변경 (/api/coupon -> /api/admin/coupons)
app.use('/api/admin/coupons', couponRoutes);

// 리뷰 관리
app.use('/api/admin/reviews', reviewRoutes);

// 대시보드 (주소 확인 필요, 일단 유지)
app.use('/api/dashboard', dashboardRoutes);


// 에러 핸들러
app.use(notFoundHandler);
app.use(errorHandler);

// 5. 서버 실행
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`
  ################################################
  🚀  Hotel Server Started on Port: ${PORT}
  🏠  URL: http://localhost:${PORT}
  ################################################
  `);
});

process.on('SIGTERM', () => {
    server.close(() => { console.log('Process terminated'); });
});