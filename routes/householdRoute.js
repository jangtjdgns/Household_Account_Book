// 라우트 householdRoute

const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');

// 페이지 첫 로딩 시 -- 초기 쿼리를 실행, 초기 세팅값을 가져옴 (거래 내역 목록, 일자, 이번달 수입, 지출, 잔액 등)
router.get('/', householdController.mainPage);

// 거래내역 목록 조회 (AJAX 요청 처리용)
router.get('/getList', householdController.getList);

// 거래내역 추가
router.post('/addTransaction', householdController.addTransaction);

module.exports = router;