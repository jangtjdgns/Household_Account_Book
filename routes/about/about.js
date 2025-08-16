const express = require('express');
const router = express.Router();

// '/about' 경로에 대응하는 실제 라우팅은 '/about' + '/'
router.get('/', (req, res) => {
  res.render('pages/about/main', {
    headTitle: '소개 페이지',
  });
});

module.exports = router;