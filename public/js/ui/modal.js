// 페이지 ui.js
// 모달 화면을 띄우기위한 ui용 js

import * as dateUtils from '../utils/date.js';
import * as inputUtils from '../utils/input.js';

// transaction 목록 상세보기용 모달 / 이벤트 감지
document.addEventListener('click', (e) => {
    if (e.target.matches('button.show-detail-btn')) {
        showTransactionModal(e.target);
    }
});

// 수정 버튼 클릭 시
document.getElementById('edit-active-btn').addEventListener('click', () => {
    const transactionId = document.querySelector('#modal-content > #transaction-id').value;
    
})

function showTransactionModal(button) {
    // 버튼이 없으면 리턴
    if (!button) return;

    // data-id, data-item 가져오기
    // const id = button.getAttribute('data-id');          // 현재 표시되는 목록의 번호(순서)
    const itemStr = button.getAttribute('data-item');   // 해당 목록 값의 고유 번호
    // 값이 비었으면 리턴 - 오류
    if (!itemStr) {
        return;
    }
    // 이상없으면 객체로 변환
    const itemObj = JSON.parse(itemStr);

    const modal = document.getElementById('transaction-modal');     // 모달 창
    const content = document.getElementById('modal-content');       // 모달 내용
    // <input id="transaction-id" />


    // 모달에 추가할 내용
    const html = `
        <input id="transaction-id" value="${itemObj.id}" class="hidden" />
        <h3 class="text-lg font-bold pb-6">상세보기</h3>
        <div class="flex flex-col text-sm">
            <div class="h-16 border-b border-gray-300 flex items-center">
                <div class="flex-1 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 font-bold">
                    거래 추가일
                </div>
                <div class="flex-3 h-full flex items-center px-2">
                    ${dateUtils.formatDate(itemObj.regDate)}
                </div>
            </div>
            <div class="h-16 border-b flex items-center">
                <div class="flex-1 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 font-bold">
                    거래 수정일
                </div>
                <div class="flex-3 h-full flex items-center px-2">
                    ${dateUtils.formatDate(itemObj.updateDate)}
                </div>
            </div>
            <div class="h-16 border-b flex items-center">
                <div class="flex-1 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 font-bold">
                    거래 구분
                </div>
                <div class="flex-3 h-full flex items-center px-2">
                    ${itemObj.type === 'income' ? '수입' : '지출'}
                </div>
            </div>
            <div class="h-16 border-b flex items-center">
                <div class="flex-1 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 font-bold">
                    카테고리
                </div>
                <div class="flex-3 h-full flex items-center px-2">
                    ${itemObj.cName}
                </div>
            </div>
            <div class="h-16 border-b flex items-center">
                <div class="flex-1 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 font-bold">
                    거래 금액
                </div>
                <div class="flex-3 h-full flex items-center px-2">
                    ${Number(itemObj.amount).toLocaleString()}원
                </div>
            </div>
            <div class="h-64 border-b flex items-center">
                <div class="flex-1 h-full flex items-center justify-center bg-gray-100 border-r border-gray-300 font-bold">
                    메모
                </div>
                <div class="flex-3 h-full p-2 overflow-y-scroll">
                    ${inputUtils.getTextLength(itemObj.memo) === 0 ? '-' : itemObj.memo}
                </div>
            </div>
        </div>
    `;

    // 추가
    content.innerHTML = html;
    // 표시
    modal.showModal();
}

