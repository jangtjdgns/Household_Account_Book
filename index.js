// index.js
require('dotenv').config({ path: '/etc/secrets/.env' }); // Render Secret File

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const date = require('./utils/date');
const mysql = require('mysql2');

const app = express();

// ===== DB Pool 생성 =====
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    ssl: { rejectUnauthorized: true }
}).promise();

// ===== 뷰 엔진 설정 =====
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// ===== 미들웨어 =====
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(express.static('public'));

// 공통 데이터 미들웨어
app.use((req, res, next) => {
    res.locals.headerCurrentDate = date.getToday(true);
    next();
});

// ===== 라우터 =====
const mainRouter = require('./routes/index/main');
const aboutRouter = require('./routes/about/about');
const householdRouter = require('./routes/householdRoute');

app.use('/', mainRouter);
app.use('/about', aboutRouter);
app.use('/household', householdRouter);

// ===== 서버 실행 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});

// ===== export DB Pool =====
module.exports = db; // 모델에서 import 해서 db.query 사용 가능
