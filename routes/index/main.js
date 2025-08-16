const express = require('express');
const router = express.Router();

// 메인 페이지 루트 경로 (index)
router.get('/', (req, res) => {
  res.render('pages/index', {
    headTitle: '메인 페이지',
  });
});

module.exports = router;
