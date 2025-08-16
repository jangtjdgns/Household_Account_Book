// householdService.js

const date = require('../utils/date');
const text = require('../utils/text');
const viewRenderer = require('../utils/viewRenderer');
const householdModel = require('../models/householdModel');

// 초기 거래목록 가져오기
async function getInitialTransactions(offset, limit) {
    const today = date.getToday();
    let endDate = date.getPastDateFrom(date.getToday(), "d", -1);
    const startDate = date.getPastDateFromToday("m", 1);

    const transactions = await householdModel.getTransactionList(startDate, endDate, "all", offset, limit);

    transactions.forEach(t => {
        t.memo = text.nl2br(t.memo);
    });

    const { html, count } = await viewRenderer.renderTransactionList(transactions);
    endDate = today;        // 초기화

    return { today, startDate, endDate, html, count };
}

// 조회시 목록 가져오기
async function getList(startDate, endDate, type, offset, limit) {

    endDate = date.getPastDateFrom(endDate, 'd', -1);

    const transactions = await householdModel.getTransactionList(startDate, endDate, type, offset, limit);

    transactions.forEach(t => {
        t.memo = text.nl2br(t.memo);
    });

    return await viewRenderer.renderTransactionList(transactions);
}

// 전체 거래 수 가져오기
async function getTransactionCount(type, startDate = date.getPastDateFromToday("m", 1), endDate = date.getPastDateFrom(date.getToday(), "d", -1)) {
    
    return await householdModel.getTransactionCount(type, startDate, endDate);
}

// 거래 내역 추가
async function addTransaction(type, amount, category, addDate, memo) {
    const regDate = `${addDate} ${date.getNow()}`;

    await householdModel.addTransaction(type, amount, category, regDate, memo);
}

// 이번달 수입, 지출, 잔액 현황 가져오기
async function getMonthlySummary() {
    const today = date.getToday();
    const curMonth = today.slice(0, 7);
    const monthSummary = await householdModel.getMonthlySummary(curMonth);
    const curMonthIncome = Number(monthSummary[0].curMonthIncome).toLocaleString();
    const curMonthExpense = Number(monthSummary[0].curMonthExpense).toLocaleString();
    const curMonthBalance = Number(monthSummary[0].curMonthBalance).toLocaleString();
    return { curMonthIncome, curMonthExpense, curMonthBalance };
}


module.exports = {
    getInitialTransactions,
    getList,
    addTransaction,
    getMonthlySummary,
    getTransactionCount
};
