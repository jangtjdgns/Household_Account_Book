// 컨트롤러 householdController

const pagenation = require('../utils/pagination');
const viewRenderer = require('../utils/viewRenderer');
const householdService = require('../services/householdService');

// 페이지 첫 로딩 시 초기값 세팅 및 거래 내역 조회
async function mainPage(req, res) {
    try {
        const { curMonthIncome, curMonthExpense, curMonthBalance } = await householdService.getMonthlySummary();

        let totalCount = await householdService.getTransactionCount("all");

        const { offset, totalPageCount, currentPage, fromPage, endPage } = pagenation.getPaginationInfo(1, 25, totalCount);

        const { today, startDate, endDate, html, count } = await householdService.getInitialTransactions(offset, 25);

        // 페이지네이션 HTML 생성
        const paginationHtml = await viewRenderer.renderPagination({
            fromPage,
            endPage,
            currentPage,
            totalPageCount
        });

        res.render('pages/household/household', {
            headTitle: '가계부 페이지',
            today,
            startDate,
            endDate,
            transactionList: html,
            count,
            curMonthIncome,
            curMonthExpense,
            curMonthBalance,
            offset,
            totalCount,
            totalPageCount,
            currentPage,
            fromPage,
            endPage,
            paginationHtml   // 추가해서 EJS에 같이 보냄
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류');
    }
}

// 거래 내역 목록 조회
async function getList(req, res) {
    try {
        let { startDate, endDate, type, limit, page } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 25;

        let totalCount = await householdService.getTransactionCount(type, startDate, endDate);

        const { offset, totalPageCount, currentPage, fromPage, endPage } = pagenation.getPaginationInfo(page, limit, totalCount);

        const { html, count } = await householdService.getList(startDate, endDate, type, offset, limit);

        const { curMonthIncome, curMonthExpense, curMonthBalance } = await householdService.getMonthlySummary();

        // 페이지네이션 HTML 생성
        const paginationHtml = await viewRenderer.renderPagination({
            fromPage,
            endPage,
            currentPage,
            totalPageCount
        });

        res.json({
            html,
            count,
            offset,
            totalCount,
            totalPageCount,
            currentPage,
            fromPage,
            endPage,
            paginationHtml,  // 추가해서 클라이언트로 보냄
            curMonthIncome,
            curMonthExpense,
            curMonthBalance
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('조회 실패');
    }
}

// 거래 내역 추가
async function addTransaction(req, res) {
    try {
        let { type, amount, category, addDate, memo } = req.body;

        await householdService.addTransaction(type, amount, category, addDate, memo);

        res.status(201).json({ message: '거래 내역이 추가되었습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('조회 실패');
    }
}

module.exports = {
    mainPage,
    getList,
    addTransaction,
};
