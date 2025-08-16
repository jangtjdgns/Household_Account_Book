import * as inputUtils from '../utils/input.js';
import { CountUp } from '../ui/countUp.js';

document.addEventListener('DOMContentLoaded', () => {
    let startDate = document.getElementById('start-date').value;
    let endDate = document.getElementById('end-date').value;
    const getApplyFiltersBtn = document.getElementById('apply-filters');

    // 조회 일자 업데이트
    ['start-date', 'end-date'].forEach(id => {
        document.getElementById(id).addEventListener('change', (e) => {
            if (e.target.id === 'start-date') startDate = e.target.value;
            else if (e.target.id === 'end-date') endDate = e.target.value;
        });
    });

    // CountUp.js 애니메이션
    function countUPanim(element, endVal = 0, startVal = 0) {
        const options = {
            startVal,
            duration: 2.5,
            prefix: '₩',
        };

        const countUp = new CountUp(element, endVal, options);
        if (!countUp.error) {
            countUp.start();
        } else {
            console.error(countUp.error);
        }
    }

    // 상단 수입, 지출, 잔액 요약 패널 갱신
    let tempSummary = {
        income: 0,
        expense: 0,
        balance: 0,
    };
    function updateSummary() {
        const totalIncome = Number(inputUtils.removeAll(document.getElementById('total-income').textContent.trim(), ','));
        const totalExpense = Number(inputUtils.removeAll(document.getElementById('total-expense').textContent.trim(), ','));
        const totalBalance = Number(inputUtils.removeAll(document.getElementById('total-balance').textContent.trim(), ','));

        countUPanim('total-income', totalIncome, tempSummary.income);
        countUPanim('total-expense', totalExpense, tempSummary.expense);
        countUPanim('total-balance', totalBalance, tempSummary.balance);

        // 백업 / 이전 숫자 사용
        tempSummary.income = totalIncome;
        tempSummary.expense = totalExpense;
        tempSummary.balance = totalBalance;
    }
    // updateSummary();

    // 거래내역 목록 조회 요청 함수
    async function getTransactionList(page = 1) {
        const sDate = document.querySelector('#start-date').value;
        const eDate = document.querySelector('#end-date').value;
        const type = document.querySelector('input[name="filter-type"]:checked').value;
        const limit = document.querySelector('#filter-section #limit').value;

        try {
            const res = await fetch(`/household/getList?startDate=${sDate}&endDate=${eDate}&type=${type}&limit=${limit}&page=${page}`);
            if (!res.ok) throw new Error('조회 실패');

            const data = await res.json();

            // 상단 수입, 지출, 잔액 갱신
            document.getElementById('total-income').innerHTML = data.curMonthIncome;
            document.getElementById('total-expense').innerHTML = data.curMonthExpense;
            document.getElementById('total-balance').innerHTML = data.curMonthBalance;
            updateSummary();    // 업데이트

            // 거래내역 테이블 갱신
            document.getElementById('transactions-body').innerHTML = data.html;

            // 총 거래 건수 업데이트
            const transactionListCount = document.getElementById('transaction-count');
            if (transactionListCount) {
                transactionListCount.textContent = `총 ${data.count}건`;
            }

            // 페이지네이션 HTML 업데이트
            const paginationContainer = document.getElementById('pagination-container');
            paginationContainer.innerHTML = data.paginationHtml;

        } catch (err) {
            alert(err.message);
        }
    }

    // 필터 적용 버튼 클릭 시 1페이지부터 조회
    if (getApplyFiltersBtn) {
        getApplyFiltersBtn.addEventListener('click', () => getTransactionList(1));
    }

    // 페이지네이션 버튼 클릭 이벤트 위임
    const paginationContainer = document.getElementById('pagination-container');

    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button[data-page]');
            if (!target) return;

            const page = parseInt(target.dataset.page);
            if (!isNaN(page)) getTransactionList(page);
        });
    }

    // 거래 추가 관련 거래 구분 변경시 카테고리 옵션 업데이트
    const addTypeRadios = document.querySelectorAll('input[name="add-type"]');
    addTypeRadios.forEach(radio => {
        radio.addEventListener('click', (e) => {
            if (e.target.checked) {
                const incomeOptions = document.getElementById('income-categories');
                const expenseOptions = document.getElementById('expense-categories');
                const selectElem = document.getElementById('add-category');

                if (e.target.value === 'income') {
                    incomeOptions.classList.remove('hidden');
                    expenseOptions.classList.add('hidden');
                } else if (e.target.value === 'expense') {
                    incomeOptions.classList.add('hidden');
                    expenseOptions.classList.remove('hidden');
                }
                selectElem.selectedIndex = 0;
            }
        });
    });

    // 메모 글자 수 표시
    const memoLimit = 200;
    document.getElementById('memo-limit').textContent = memoLimit;
    document.getElementById('add-memo').addEventListener('input', (e) => {
        const curTextLength = inputUtils.getTextareaLength(e.target);
        document.getElementById('memo-length').textContent = curTextLength;
    });

    // 거래 추가 폼 제출
    document.getElementById('transaction-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const type = document.querySelector('input[name="add-type"]:checked')?.value;
        const amount = document.getElementById('add-amount').value.trim();
        const category = document.getElementById('add-category').value;
        const addDate = document.getElementById('add-date').value;
        const memo = document.getElementById('add-memo').value.trim();

        if (!type) return alert('거래 유형을 선택해주세요.');
        if (!amount) return alert('금액을 입력해주세요.');
        if (!category) return alert('카테고리를 선택해주세요.');
        if (!addDate) return alert('날짜를 선택해주세요.');
        if (memo.length > memoLimit) return alert('메모는 200자 이내로 입력해주세요.');

        try {
            const res = await fetch('/household/addTransaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, amount, category, addDate, memo })
            });
            if (!res.ok) throw new Error('거래 추가 실패');
            alert('저장되었습니다!');
            getTransactionList(1); // 추가 후 목록 1페이지 갱신
        } catch (err) {
            alert(err.message);
        }
    });

    // 전체 선택 체크박스 이벤트
    document.getElementById('checkbox-all').addEventListener('change', (e) => {
        const checkboxItems = document.querySelectorAll('#transactions-body .checkbox-item');
        checkboxItems.forEach(item => item.checked = e.target.checked);
    });

    // 초기 목록 조회
    getTransactionList(1);
});
