// utils/date.js

// [날짜 관련]
/**
 * 날짜 형식 초기화
 * @param {Date} date 
 * @param {boolean} useKor 한글 형식 여부
 * @returns {string}
 */
function formatDate(date, useKor = false) {
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);

    return useKor ? `${y}년 ${m}월 ${d}일` : `${y}-${m}-${d}`;
}

/**
 * 현재 날짜 반환
 * @param {boolean} useKor 한글 형식 여부
 * @returns {string} 날짜 문자열
 */
function getToday(useKor = false) {
    return formatDate(new Date(), useKor);
}


/**
 * [기준일]로부터 y(년), m(월), d(일) 만큼 과거 날짜 반환
 * @param {Date} baseDate - 기준 날짜 (Date 객체)
 * @param {'y'|'m'|'d'} unit - 연/y, 월/m, 일/d 구분자
 * @param {number} amount - 빼고 싶은 숫자
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
function getPastDateFrom(baseDate, unit, amount) {
    const date = new Date(baseDate); // 원본 훼손 방지 위해 복사

    switch (unit) {
        case 'y':
            date.setFullYear(date.getFullYear() - amount);
            break;
        case 'm':
            date.setMonth(date.getMonth() - amount);
            break;
        case 'd':
            date.setDate(date.getDate() - amount);
            break;
        default:
            throw new Error("unit은 'y', 'm', 'd' 중 하나여야 합니다.");
    }

    return formatDate(date);
}

/**
* [현재일]로부터 y(년), m(월), d(일) 만큼 과거 날짜 반환
* @param {'y'|'m'|'d'} unit - 연/y, 월/m, 일/d 구분자
* @param {number} amount - 빼고 싶은 숫자
* @returns {string} YYYY-MM-DD 형식의 날짜 문자열
*/
function getPastDateFromToday(unit, amount) {

    return getPastDateFrom(getToday(), unit, amount);
}







// [시간 관련]
/**
 * 시간 형식 초기화
 * @param {Date} date 
 * @param {String} type 시간 표기 방식 (24시간제 | 12시간제)
 * @returns {string}
 */
function formatTime(date, is24Hour = true) {
    const h = date.getHours();
    const m = ('0' + date.getMinutes()).slice(-2);
    const s = ('0' + date.getSeconds()).slice(-2);

    // 12시간 표기 방식 일때
    if (!is24Hour) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const ampm = h < 12 ? 'AM' : 'PM';
        return `${ampm} ${hour12}:${m}:${s}`;
    } else {
        return `${h}:${m}:${s}`;
    }
}

/** 
 * 현재시간 반환
 * @returns {string} HH:mm:ss 형식의 24시간제 문자열 or A hh:mm:ss 형식의 12시간제 문자열
*/
function getNow(is24Hour = true) {

    return formatTime(new Date(), is24Hour);
}





// 반환
module.exports = {
    formatDate,
    getToday,
    getPastDateFrom,
    getPastDateFromToday,
    formatTime,
    getNow
};