// index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const date = require('./utils/date');

const app = express();

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
