const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB 연결 주소 (환경변수 우선, 없으면 도커 환경 기본값)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://mongodb:27017/hotel-project";

// 모델 정의는 제거 - 서버에서 이미 로드된 모델을 사용

// 2. 데이터 초기화 함수 (서버에서 호출 가능하도록 export)
const initData = async () => {
  try {
    console.log("📡 초기 데이터 확인 중...");

    // 기존에 정의된 모델 사용 (이미 컴파일된 모델 재사용)
    // 모델이 이미 있으면 가져오고, 없으면 require로 로드
    let User, Hotel, Review, Coupon, Booking;
    
    try {
      User = mongoose.model("User");
    } catch {
      require('./models/User.cjs');
      User = mongoose.model("User");
    }
    
    try {
      Hotel = mongoose.model("Hotel");
    } catch {
      require('./models/Hotel.cjs');
      Hotel = mongoose.model("Hotel");
    }
    
    try {
      Review = mongoose.model("Review");
    } catch {
      require('./review/review.model.cjs');
      Review = mongoose.model("Review");
    }
    
    try {
      Coupon = mongoose.model("Coupon");
    } catch {
      require('./coupon/model.cjs');
      Coupon = mongoose.model("Coupon");
    }
    
    // Booking 모델은 동적으로 생성
    if (mongoose.models.Booking) {
      Booking = mongoose.models.Booking;
    } else {
      const bookingSchema = new mongoose.Schema({}, { strict: false });
      Booking = mongoose.model("Booking", bookingSchema);
    }

    // 데이터가 이미 있는지 확인
    const userCount = await User.countDocuments();
    const hotelCount = await Hotel.countDocuments();
    const reviewCount = await Review.countDocuments();
    const couponCount = await Coupon.countDocuments();
    const bookingCount = await Booking.countDocuments();

    console.log(`📊 현재 데이터 상태: User(${userCount}), Hotel(${hotelCount}), Review(${reviewCount}), Coupon(${couponCount}), Booking(${bookingCount})`);

    // 데이터가 이미 있으면 초기화 스킵
    if (userCount > 0 && hotelCount > 0 && reviewCount > 0 && couponCount > 0 && bookingCount > 0) {
      console.log("✅ 초기 데이터가 이미 존재합니다. 스킵합니다.");
      return;
    }

    console.log("📝 초기 데이터 삽입 시작...");

    // 비밀번호 암호화 준비
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("hotel1234", salt); // 관리자 비번
    const hashedUserPassword = await bcrypt.hash("1234", salt);      // 유저 비번

    // --- [데이터 정의 시작] ---

    // 1) 유저 데이터
    const users = [
      {
        name: "관리자",
        email: "hotel1@hotel.com",
        password: hashedAdminPassword,
        phone: "010-0000-0000",
        role: "admin",
        status: "active",
        createdAt: new Date(),
      },
      {
        name: "김민수",
        email: "minsu@example.com",
        password: hashedUserPassword,
        phone: "010-1234-5678",
        role: "user",
        status: "active",
        createdAt: new Date("2023-12-01"),
      },
      {
        name: "임우진",
        email: "woojin@example.com",
        password: hashedUserPassword,
        phone: "010-2345-6789",
        role: "business",
        status: "active",
        createdAt: new Date("2023-12-15"),
      },
    ];

    // 2) 호텔 데이터
    const hotels = [
      {
        name: "서울 그랜드 호텔",
        address: "서울시 강남구 테헤란로 123",
        description: "서울의 중심에서 즐기는 럭셔리한 휴식",
        rating: 4.5,
        price: 150000,
        status: "approved",
        createdAt: new Date("2024-01-15"),
      },
      {
        name: "부산 오션뷰 리조트",
        address: "부산 해운대구 해운대해변로 296",
        description: "바다가 보이는 최고의 전망",
        rating: 4.8,
        price: 220000,
        status: "active",
        createdAt: new Date("2024-02-01"),
      },
      {
        name: "제주 힐링 펜션",
        address: "제주 서귀포시 성산읍",
        description: "자연과 함께하는 힐링 공간",
        rating: 4.2,
        price: 85000,
        status: "pending",
        createdAt: new Date("2024-02-10"),
      }
    ];

    // 3) 예약 데이터
    const bookings = [
      {
        hotelName: "서울 그랜드 호텔",
        userName: "김민수",
        userEmail: "minsu@example.com",
        checkIn: new Date("2024-03-01"),
        checkOut: new Date("2024-03-03"),
        guests: { adults: 2, children: 1 },
        amount: 300000,
        status: "confirmed",
        createdAt: new Date("2024-02-20"),
      },
      {
        hotelName: "부산 오션뷰 리조트",
        userName: "임우진",
        userEmail: "woojin@example.com",
        checkIn: new Date("2024-04-05"),
        checkOut: new Date("2024-04-07"),
        guests: { adults: 2, children: 0 },
        amount: 440000,
        status: "pending",
        createdAt: new Date("2024-03-10"),
      }
    ];

    // 4) 리뷰 데이터
    const reviews = [
      {
        hotelId: null,
        hotelName: "서울 그랜드 호텔",
        userName: "김민수",
        rating: 5,
        content: "정말 편안하게 잘 쉬다 갑니다. 직원분들이 친절해요.",
        reported: false,
        createdAt: new Date("2024-03-05"),
      },
      {
        hotelId: null,
        hotelName: "서울 그랜드 호텔",
        userName: "익명",
        rating: 2,
        content: "방음이 잘 안돼서 시끄러웠습니다.",
        reported: true,
        createdAt: new Date("2024-03-06"),
      }
    ];

    // 5) 쿠폰 데이터
    const coupons = [
      {
        code: "WELCOME2024",
        discountType: "percent",
        value: 10,
        expiresAt: new Date("2024-12-31"),
        usesLimit: 1000,
        usedCount: 150,
        active: true,
        createdAt: new Date("2024-01-01"),
      },
      {
        code: "SUMMER_SALE",
        discountType: "amount",
        value: 30000,
        expiresAt: new Date("2024-08-31"),
        usesLimit: 500,
        usedCount: 0,
        active: true,
        createdAt: new Date("2024-05-01"),
      }
    ];

    // --- [데이터 처리 시작] ---

    // 새 데이터 삽입
    console.log("  → 회원 데이터 삽입 중...");
    const insertedUsers = await User.insertMany(users);
    console.log(`  ✅ 회원 ${insertedUsers.length}개 삽입 완료`);

    console.log("  → 호텔 데이터 삽입 중...");
    const insertedHotels = await Hotel.insertMany(hotels);
    console.log(`  ✅ 호텔 ${insertedHotels.length}개 삽입 완료`);

    console.log("  → 예약 데이터 삽입 중...");
    const insertedBookings = await Booking.insertMany(bookings);
    console.log(`  ✅ 예약 ${insertedBookings.length}개 삽입 완료`);

    console.log("  → 리뷰 데이터 삽입 중...");
    const insertedReviews = await Review.insertMany(reviews);
    console.log(`  ✅ 리뷰 ${insertedReviews.length}개 삽입 완료`);

    console.log("  → 쿠폰 데이터 삽입 중...");
    const insertedCoupons = await Coupon.insertMany(coupons);
    console.log(`  ✅ 쿠폰 ${insertedCoupons.length}개 삽입 완료`);

    console.log("🎉 초기 데이터 삽입 완료!");
    console.log(`   총 ${insertedUsers.length + insertedHotels.length + insertedBookings.length + insertedReviews.length + insertedCoupons.length}개의 데이터가 저장되었습니다.`);

  } catch (error) {
    console.error("❌ 초기 데이터 삽입 실패:", error.message);
    // 에러가 나도 서버는 계속 실행되도록 함
  }
};

// 직접 실행 시 (node init-data.cjs) - 이때는 모델을 새로 정의해야 함
if (require.main === module) {
  (async () => {
    try {
      console.log("📡 MongoDB 연결 중...");
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB 연결 성공!");
      
      // 직접 실행 시에는 모델을 새로 정의
      const userSchema = new mongoose.Schema({}, { strict: false });
      const hotelSchema = new mongoose.Schema({}, { strict: false });
      const bookingSchema = new mongoose.Schema({}, { strict: false });
      const reviewSchema = new mongoose.Schema({}, { strict: false });
      const couponSchema = new mongoose.Schema({}, { strict: false });

      mongoose.model("User", userSchema);
      mongoose.model("Hotel", hotelSchema);
      mongoose.model("Booking", bookingSchema);
      mongoose.model("Review", reviewSchema);
      mongoose.model("Coupon", couponSchema);
      
      await initData();
      process.exit(0);
    } catch (error) {
      console.error("❌ 데이터 초기화 실패:", error);
      process.exit(1);
    }
  })();
}

// 서버에서 호출 시 export
module.exports = { initData };