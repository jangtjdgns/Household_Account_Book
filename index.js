// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const date = require('./utils/date');
const mysql = require('mysql2');

// ====================
// MySQL 연결 설정
// Render 환경변수 사용
// ====================
const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,       // Render 환경변수
    user: process.env.DB_USER,       // Render 환경변수
    password: process.env.DB_PASSWORD, // Render 환경변수
    database: process.env.DB_NAME,   // Render 환경변수
    port: process.env.DB_PORT || 3306, // Render 환경변수, 기본값 3306
    ssl: {
        rejectUnauthorized: true     // Aiven MySQL SSL 적용
    }
});

dbConnection.connect(err => {
    if (err) {
        console.error('❌ DB 연결 실패:', err);
        process.exit(1); // 연결 실패 시 앱 종료
    }
    console.log('✅ DB 연결 성공');
});

// ====================
// Express 앱 설정
// ====================
const app = express();

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// 정적 파일 위치 설정 (css, js, images 등)
app.use(express.static('public'));

// 공통 데이터 미들웨어 (모든 요청에 적용)
app.use((req, res, next) => {
    res.locals.headerCurrentDate = date.getToday(true); // 모든 페이지에서 공통으로 사용
    next();
});

// ====================
// 라우터 불러오기
// ====================
const mainRouter = require('./routes/index/main');
const aboutRouter = require('./routes/about/about');
const householdRouter = require('./routes/householdRoute');

// 라우터 등록
app.use('/', mainRouter);
app.use('/about', aboutRouter);
app.use('/household', householdRouter);

// ====================
// 서버 실행
// ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});

// ====================
// DB 연결 export (다른 모듈에서 사용 가능)
// ====================
module.exports = dbConnection;
