// utils/viewRenderer.js
const path = require('path');
const ejs = require('ejs');

// 거래내역 목록
async function renderTransactionList(transactions) {
  const ejsFilePath = path.join(__dirname, '../views/pages/household/getTransactionList.ejs');
  const html = await ejs.renderFile(ejsFilePath, { transactions });
  return {
    html,
    count: transactions.length
  };
}

// 페이지네이션
// 페이지네이션 HTML 렌더링 (공통 컴포넌트 템플릿 사용)
async function renderPagination({ fromPage, endPage, currentPage, totalPageCount }) {
  const ejsFilePath = path.join(__dirname, '../views/components/pagination.ejs');
  const html = await ejs.renderFile(ejsFilePath, {
    fromPage,
    endPage,
    currentPage,
    totalPageCount,
  });
  return html;
}

module.exports = {
  renderTransactionList,
  renderPagination
};