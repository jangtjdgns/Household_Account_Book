// models/householdModel.js
const db = require('../index');

// 거래내역 목록 조회 쿼리
async function getTransactionList(startDate, endDate, type, offset, limit) {
    const [results] = await db.query(`
        SELECT t.*, c.name AS cName
        FROM transactions t
        INNER JOIN categories c ON t.category = c.code
        WHERE c.isActive IS TRUE
            AND ( ? = 'all' OR t.type = ? )
            AND t.regDate BETWEEN ? AND ?
        ORDER BY regDate DESC
        limit ? OFFSET ?
    `, [type, type, startDate, endDate, limit, offset]);

    return results;
}

// 전체 거래 수 가져오기
async function getTransactionCount(type, startDate, endDate) {
    const [results] = await db.query(`
        SELECT COUNT(*) AS totalCount FROM transactions
        WHERE (type = ? OR ? = 'all')
            AND regDate BETWEEN ? AND ?
    `, [type, type, startDate, endDate]);

    return results[0].totalCount;
}

// 거래내역 추가 쿼리
async function addTransaction(type, amount, category, regDate, memo) {
    await db.query(`
        INSERT INTO transactions (type, amount, category, regDate, memo)
        VALUES (?, ?, ?, ?, ?)
    `, [type, amount, category, regDate, memo]);
}

// 이번달 수입, 지출, 잔액 조회 쿼리
async function getMonthlySummary(curMonth) {
    const [results] = await db.query(`
            SELECT
                IFNULL(SUM(CASE WHEN TYPE = 'income' THEN amount END), 0) AS curMonthIncome,
                IFNULL(SUM(CASE WHEN TYPE = 'expense' THEN amount END), 0) AS curMonthExpense,
                IFNULL(SUM(CASE WHEN TYPE = 'income' THEN amount END), 0) - IFNULL(SUM(CASE WHEN TYPE = 'expense' THEN amount END), 0) AS curMonthBalance
            FROM transactions
            WHERE DATE_FORMAT(regDate, '%Y-%m') = ?;
    `, [curMonth]);

    return results;
}

module.exports = {
    getTransactionList,
    addTransaction,
    getMonthlySummary,
    getTransactionCount
};
