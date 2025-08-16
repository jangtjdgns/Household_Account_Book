// utils/pagination.js

// 페이지네이션 정보 반환
function getPaginationInfo(page = 1, limit = 25, totalCount) {
    if (page <= 0) {
        throw new Error('페이지 번호가 올바르지 않습니다.');
    }

    const offset = (page - 1) * limit;
    const totalPageCount = Math.ceil(totalCount / limit);


    const fromPage = Math.floor((page - 1) / 10) * 10 + 1;
    let endPage = fromPage + 9;
    if (endPage > totalPageCount) {
        endPage = totalPageCount;
    }

    // console.log("page : " + page);
    // console.log("limit : " + limit);
    // console.log("offset : " + offset)
    // console.log("totalCount : " + totalPageCount)
    // console.log("fromPage : " + fromPage)
    // console.log("endPage : " + endPage)

    return {
        offset,                 // LIMIT 시작 위치
        // limit,                  // 페이지당 항목 수
        // totalCount,             // 전체 항목 수
        totalPageCount,         // 전체 페이지 수
        currentPage: page,      // 현재 페이지
        fromPage,               // 페이지네이션 시작 번호       // 현재 표시되는 페이지네이션의 첫번째 번호 / 1페이지 아님
        endPage,                // 페이지네이션 끝 번호         // 현재 표시되는 페이지네이션의 마지막 번호 / 마지막 페이지 아님
        // prevPage: fromPage > 1 ? fromPage - 1 : null, // 이전 페이징 구간의 첫 페이지 번호 (예: 현재 11이면 10)
        // nextPage: endPage < totalPageCount ? endPage + 1 : null // 다음 페이징 구간의 첫 페이지 번호 (예: 현재 10이면 11)
    };
}

module.exports = { getPaginationInfo };
