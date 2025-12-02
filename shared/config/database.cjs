const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_db';
        
        // Mongoose 6버전 이상부터는 옵션 객체 없이 연결해도 됩니다.
        const conn = await mongoose.connect(mongoUri);

        console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
        return mongoose.connection;
    } catch (error) {
        console.error(`❌ MongoDB 연결 실패: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB 연결 해제');
    } catch (error) {
        console.error('MongoDB 연결 해제 실패:', error.message);
    }
};

module.exports = { connectDB, disconnectDB };