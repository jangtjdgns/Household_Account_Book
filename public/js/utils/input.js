// 페이지 utils-input.js
// input, textarea 등 텍스트 입력에 대한 유틸리티
// 사용법
// 1. 모든 함수 사용 : import * as inputUtils from '파일경로./utils/input.js';
// 2. 특정 함수 사용 : import { limitTextareaLength } from '파일경로./utils/input.js'

/**
 * textarea 글자 수가 limit을 초과했는지 여부
 * @param {Element} textarea    텍스트아레아 태그
 * @param {Number} limit        글자 수 제한값
 * @returns {boolean}           true || false 반환
*/
export function isTextareaOverLimit(textarea, limit) {

    return textarea.value.length > limit;
}

/**
 * 현재 입력한 textarea 글자 수 반환
 * @param {Element} textarea    텍스트아레아 태그
 * @returns {Number}            글자 수 반환
 */
export function getTextareaLength(textarea) {

    return textarea.value.length;
}

/**
 * 글자 길이 반환 (기본)
 * @param {String} text         텍스트
 * @returns {Number}            글자 수 반환
 */
export function getTextLength(text) {

    return text.length;
}


/**
 * 특정 문자를 제거하는 함수
 * @param {String} text         텍스트(문자열)
 * @param {String} target       제거할 문자 (특수문자 포함)
 * @returns {String}            제거된 텍스트 반환
 */
export function removeAll(text, target) {
    const regex = new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    return text.replace(regex, '');
}