const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const date = require('./utils/date');
const mysql = require('mysql2');

const app = express();

// ====================
// DB 연결 (Aiven MySQL)
// ====================
const db = mysql.createPool({
    host: process.env.DB_HOST,           // Render 환경변수
    user: process.env.DB_USER,           // Render 환경변수
    password: process.env.DB_PASSWORD,   // Render 환경변수
    database: process.env.DB_NAME,       // Render 환경변수
    port: process.env.DB_PORT,           // Render 환경변수
    connectionLimit: 10,
    ssl: { rejectUnauthorized: true }    // Aiven MySQL SSL 필수
}).promise();  // async/await 사용 가능

// ====================
// Express 앱 설정
// ====================
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(
    helmet({ contentSecurityPolicy: false })
);
app.use(express.static('public'));
app.use((req, res, next) => {
    res.locals.headerCurrentDate = date.getToday(true);
    next();
});

// ====================
// 라우터 등록
// ====================
const mainRouter = require('./routes/index/main');
const aboutRouter = require('./routes/about/about');
const householdRouter = require('./routes/householdRoute');

app.use('/', mainRouter);
app.use('/about', aboutRouter);
app.use('/household', householdRouter);

// ====================
// 서버 실행
// ====================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중`);
});

// ====================
// DB 연결 export
// ====================
module.exports = { db };  // db를 export