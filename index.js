require('dotenv').config({ path: '/etc/secrets/.env' });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const date = require('./utils/date');

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
    // 필요하면 더 공통 데이터 추가 가능
    next();
});

// 라우터 불러오기
const mainRouter = require('./routes/index/main');
const aboutRouter = require('./routes/about/about');
const householdRouter = require('./routes/householdRoute');
// 필요한 라우터 더 추가

// 라우터 등록
app.use('/', mainRouter);                   // 메인페이지 (=index)
app.use('/about', aboutRouter);             // '/about' 같은 경로는 aboutRouter가 처리
app.use('/household', householdRouter);     // household 관련
// 필요한 라우터 더 등록

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
