// // 현재 날짜 설정 및 표시
// document.addEventListener('DOMContentLoaded', function () {
//     const today = new Date();
//     const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
//     document.querySelector('.current-date').textContent = today.toLocaleDateString('ko-KR', options);
//     document.getElementById('date').value = today.toISOString().substr(0, 10);

//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//     document.getElementById('start-date').value = oneMonthAgo.toISOString().substr(0, 10);
//     document.getElementById('end-date').value = today.toISOString().substr(0, 10);

//     const incomeRadio = document.getElementById('income');
//     const expenseRadio = document.getElementById('expense');
//     const submitBtn = document.getElementById('submit-btn');
//     const incomeCategories = document.getElementById('income-categories');
//     const expenseCategories = document.getElementById('expense-categories');

//     const filterAllRadio = document.getElementById('filter-all');
//     const filterIncomeRadio = document.getElementById('filter-income');
//     const filterExpenseRadio = document.getElementById('filter-expense');
//     const filterApplyBtn = document.getElementById('apply-filters');

//     function updateButtonStyle() {
//         if (incomeRadio.checked) {
//             submitBtn.className = 'btn btn-income';
//             incomeCategories.style.display = 'block';
//             expenseCategories.style.display = 'none';
//             document.getElementById('category').selectedIndex = 0;
//         } else {
//             submitBtn.className = 'btn btn-expense';
//             incomeCategories.style.display = 'none';
//             expenseCategories.style.display = 'block';
//             document.getElementById('category').selectedIndex = 0;
//         }
//     }

//     incomeRadio.addEventListener('change', updateButtonStyle);
//     expenseRadio.addEventListener('change', updateButtonStyle);
//     updateButtonStyle();

//     function updateFilterButtonStyle() {
//         if (filterIncomeRadio.checked) {
//             filterApplyBtn.className = 'filter-btn apply-filters btn-income';
//         } else if (filterExpenseRadio.checked) {
//             filterApplyBtn.className = 'filter-btn apply-filters btn-expense';
//         } else {
//             filterApplyBtn.className = 'filter-btn apply-filters';
//         }
//     }

//     filterAllRadio.addEventListener('change', updateFilterButtonStyle);
//     filterIncomeRadio.addEventListener('change', updateFilterButtonStyle);
//     filterExpenseRadio.addEventListener('change', updateFilterButtonStyle);
//     updateFilterButtonStyle();

//     let transactions = []; 

    // const categoryNames = {
    //     'salary': '급여',
    //     'bonus': '보너스',
    //     'interest': '이자/배당금',
    //     'gift': '선물/용돈',
    //     'other-income': '기타 수입', 
    //     'food': '식비',
    //     'transportation': '교통비',
    //     'housing': '주거비',
    //     'utilities': '공과금',
    //     'shopping': '쇼핑/의류',
    //     'entertainment': '여가/오락',
    //     'healthcare': '의료/건강',
    //     'education': '교육',
    //     'other-expense': '기타 지출'
    // };

//     function formatCurrency(amount) {
//         return '₩' + parseInt(amount).toLocaleString('ko-KR');
//     }

//     let currentFilter = {
//         startDate: document.getElementById('start-date').value,
//         endDate: document.getElementById('end-date').value,
//         type: 'all'
//     };

//     document.getElementById('apply-filters').addEventListener('click', function () {
//         currentFilter.startDate = document.getElementById('start-date').value;
//         currentFilter.endDate = document.getElementById('end-date').value;

//         // ✅ 라디오 버튼 필터값 반영
//         const selectedFilter = document.querySelector('input[name="filter-type"]:checked');
//         currentFilter.type = selectedFilter ? selectedFilter.value : 'all';

//         if (!currentFilter.startDate || !currentFilter.endDate) {
//             alert('조회 시작일과 종료일을 모두 입력해주세요.');
//             return;
//         }

//         if (new Date(currentFilter.startDate) > new Date(currentFilter.endDate)) {
//             alert('조회 종료일은 시작일보다 이후여야 합니다.');
//             return;
//         }

//         updateTransactionList();
//     });

//     document.getElementById('reset-filters').addEventListener('click', function () {
//         document.getElementById('start-date').value = oneMonthAgo.toISOString().substr(0, 10);
//         document.getElementById('end-date').value = today.toISOString().substr(0, 10);

//         filterAllRadio.checked = true;
//         updateFilterButtonStyle();

//         currentFilter = {
//             startDate: oneMonthAgo.toISOString().substr(0, 10),
//             endDate: today.toISOString().substr(0, 10),
//             type: 'all'
//         };

//         updateTransactionList();
//     });

//     function updateSummary() {
//         const totalIncomeElement = document.getElementById('total-income');
//         const totalExpenseElement = document.getElementById('total-expense');
//         const totalBalanceElement = document.getElementById('total-balance');

//         const currentDate = new Date();
//         const currentMonth = currentDate.getMonth();
//         const currentYear = currentDate.getFullYear();

//         const thisMonthTransactions = transactions.filter(transaction => {
//             const transDate = new Date(transaction.date);
//             return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
//         });

//         const income = thisMonthTransactions
//             .filter(t => t.type === 'income')
//             .reduce((sum, t) => sum + parseInt(t.amount), 0);

//         const expense = thisMonthTransactions
//             .filter(t => t.type === 'expense')
//             .reduce((sum, t) => sum + parseInt(t.amount), 0);

//         const balance = income - expense;

//         totalIncomeElement.textContent = formatCurrency(income);
//         totalExpenseElement.textContent = formatCurrency(expense);
//         totalBalanceElement.textContent = formatCurrency(balance);
//     }

//     function updateTransactionList() {
//         const transactionList = document.getElementById('transaction-list');
//         const transactionsBody = document.getElementById('transactions-body');
//         const emptyMessage = document.getElementById('empty-list-message');
//         const transactionCount = document.getElementById('transaction-count');

//         const filteredTransactions = transactions.filter(transaction => {
//             const transactionDate = new Date(transaction.date);
//             const startDate = new Date(currentFilter.startDate);
//             const endDate = new Date(currentFilter.endDate);
//             endDate.setHours(23, 59, 59);

//             const dateMatches = transactionDate >= startDate && transactionDate <= endDate;
//             const typeMatches = currentFilter.type === 'all' || transaction.type === currentFilter.type;

//             return dateMatches && typeMatches;
//         });

//         if (filteredTransactions.length > 0) {
//             transactionList.style.display = 'table';
//             emptyMessage.style.display = 'none';
//             transactionCount.textContent = `총 ${filteredTransactions.length}건`;

//             transactionsBody.innerHTML = '';
//             const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));

//             sortedTransactions.forEach(transaction => {
//                 const row = document.createElement('tr');

//                 const dateCell = document.createElement('td');
//                 dateCell.setAttribute('data-label', '날짜');
//                 dateCell.textContent = new Date(transaction.date).toLocaleDateString('ko-KR');
//                 row.appendChild(dateCell);

//                 const categoryCell = document.createElement('td');
//                 categoryCell.setAttribute('data-label', '카테고리');
//                 const categorySpan = document.createElement('span');
//                 categorySpan.className = 'transaction-category';
//                 categorySpan.textContent = categoryNames[transaction.category] || transaction.category;
//                 categoryCell.appendChild(categorySpan);
//                 row.appendChild(categoryCell);

//                 const memoCell = document.createElement('td');
//                 memoCell.setAttribute('data-label', '메모');
//                 memoCell.textContent = transaction.memo || '-';
//                 row.appendChild(memoCell);

//                 const amountCell = document.createElement('td');
//                 amountCell.setAttribute('data-label', '금액');
//                 amountCell.className = 'transaction-amount ' +
//                     (transaction.type === 'income' ? 'transaction-income' : 'transaction-expense');
//                 amountCell.textContent = (transaction.type === 'income' ? '+ ' : '- ') + formatCurrency(transaction.amount);
//                 row.appendChild(amountCell);

//                 const actionsCell = document.createElement('td');
//                 actionsCell.setAttribute('data-label', '관리');
//                 actionsCell.className = 'transaction-actions';

//                 const deleteButton = document.createElement('button');
//                 deleteButton.className = 'action-button';
//                 deleteButton.textContent = '삭제';
//                 deleteButton.addEventListener('click', () => {
//                     if (confirm('이 거래를 삭제하시겠습니까?')) {
//                         const originalIndex = transactions.findIndex(t => t.id === transaction.id);
//                         if (originalIndex !== -1) {
//                             transactions.splice(originalIndex, 1);
//                             updateTransactionList();
//                             updateSummary();
//                         }
//                     }
//                 });

//                 actionsCell.appendChild(deleteButton);
//                 row.appendChild(actionsCell);

//                 transactionsBody.appendChild(row);
//             });
//         } else {
//             transactionList.style.display = 'none';
//             emptyMessage.style.display = 'block';
//             transactionCount.textContent = '총 0건';
//         }
//     }

//     document.getElementById('transaction-form').addEventListener('submit', function (e) {
//         e.preventDefault();

//         const type = document.querySelector('input[name="type"]:checked').value;
//         const amount = document.getElementById('amount').value;
//         const category = document.getElementById('category').value;
//         const date = document.getElementById('date').value;
//         const memo = document.getElementById('memo').value;

//         if (!amount || !category || !date) {
//             alert('금액, 카테고리, 날짜는 필수 항목입니다.');
//             return;
//         }

//         if (isNaN(amount) || amount <= 0) {
//             alert('유효한 금액을 입력해주세요.');
//             return;
//         }

//         const newTransaction = {
//             id: Date.now().toString(),
//             type,
//             amount,
//             category,
//             date,
//             memo
//         };

//         transactions.push(newTransaction);
//         updateTransactionList();
//         updateSummary();

//         this.reset();
//         document.getElementById('date').value = today.toISOString().substr(0, 10);
//         updateButtonStyle();

//         alert('거래가 추가되었습니다!');
//     });

//     updateTransactionList();
//     updateSummary();
// });
