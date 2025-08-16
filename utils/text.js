// utils/text.js

// [문자열 포맷 관련]
/**
 * \n 줄바꿈 → <br/>로 변경
 * @param {string} text
 * @returns {string}
 */
function nl2br(text) {
    if (!text) return '';
    return text.replace(/\n/g, '<br/>');
}

module.exports = {
    nl2br
};