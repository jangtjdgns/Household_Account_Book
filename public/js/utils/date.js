// 페이지 utils-date.js
// 날짜 및 시간 관련 유틸리티

// 시간 초기화
export function formatDate(date, useKor = false) {
    date = new Date(date);
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);

    return useKor ? `${y}년 ${m}월 ${d}일` : `${y}-${m}-${d}`;
}

// 현재 날짜 반환
export function getToday(useKor = false) {
    return formatDate(new Date(), useKor);
}