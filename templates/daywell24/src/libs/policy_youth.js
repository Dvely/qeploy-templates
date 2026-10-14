$(function () {
    const $videoOperateBodySection = $(".policyVer");
    $(".policySelect .select").click(function () {
        $(this).toggleClass("active");
    });

    $(".policySelect .dropOption").click(function () {
		let $me = $(this),
            curText = $me.text(),
            seq = $me.data("policy_seq");

        if (seq) {
            loadVideoOperate(
                seq,
                function (data) {
                    let body = data?.[0].BODY;

                    $videoOperateBodySection.html(body);

                    $(".policySelect .dropLabel").text(curText);
                    $(".policySelect .select").removeClass("active");
                },
                function () {
                    window.alert("정보를 읽는데 실패하였습니다.");
                }
            );
        }
    });

    var itemsPerPage = 6;
    var totalItems = $('.company_list li').length;
    var totalPages = Math.ceil(totalItems / itemsPerPage);
    var currentPage = 1;

    // 페이지 로드시 초기화
    updatePagination();
    updatePaginationMo();

    // 이전 페이지 버튼 클릭
    $('.prev').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            updatePaginationMo();
        }
    });

    // 다음 페이지 버튼 클릭
    $('.next').on('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            updatePaginationMo();
        }
    });

    // 이전 페이지 버튼(10 페이지 전) 클릭
    $('.doublePrev').on('click', function() {
        if (currentPage > 10) {
            currentPage -= 10;
            updatePagination();
        }
    });

    // 다음 페이지 버튼(10 페이지 후) 클릭
    $('.doubleNext').on('click', function() {
        if (currentPage + 10 <= totalPages) {
            currentPage += 10;
            updatePagination();
        }
    });

    // 페이지 번호 클릭
    $('.pageNation').on('click', '.pIndex', function() {
        currentPage = parseInt($(this).text());
        updatePagination();
        updatePaginationMo();
    });

    // 페이지 표시 함수
    function updatePagination() {
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;

        $('.company_list li').hide().slice(startIndex, endIndex).show();

        $('.prev, .doublePrev').css('opacity', currentPage > 1 ? 1 : 0.3);
        $('.next, .doubleNext').css('opacity', currentPage < totalPages ? 1 : 0.3);

        var pageLinks = '';
        var startPage = 1;
        var endPage = totalPages;

        if (totalPages > 10) {
            startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
            endPage = Math.min(startPage + 9, totalPages);
        }

        for (var i = startPage; i <= endPage; i++) {
            var focusClass = (i === currentPage) ? 'focus' : '';
            pageLinks += '<li class="pIndex ' + focusClass + '"><span>' + i + '</span></li>';
        }

        $('.pageNation.only_pc').html(pageLinks);

        // 현재 페이지에 있는 10개의 넘버 이전에 돌아갈 페이지가 없을 경우 .doublePrev의 스타일 변경
        if (currentPage <= 10) {
            $('.doublePrev').css('opacity', 0.3);
        }

        // 현재 페이지에 있는 10개의 넘버 이후 나올 페이지가 없을 경우 .doubleNext의 스타일 변경
        if (currentPage + 10 > totalPages) {
            $('.doubleNext').css('opacity', 0.3);
        }

    }

    // 페이지 표시 함수
    function updatePaginationMo() {
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;

        $('.company_list li').hide().slice(startIndex, endIndex).show();

        $('.prev').css('opacity', currentPage > 1 ? 1 : 0.3);
        $('.next').css('opacity', currentPage < totalPages ? 1 : 0.3);

        var pageLinks = '';
        var startPage = 1;
        var endPage = totalPages;

        if (totalPages > 3) {
            startPage = Math.floor((currentPage - 1) / 3) * 3 + 1;
            endPage = Math.min(startPage + 2, totalPages);
        }

        for (var i = startPage; i <= endPage; i++) {
            var focusClass = (i === currentPage) ? 'focus' : '';
            pageLinks += '<li class="pIndex ' + focusClass + '"><span>' + i + '</span></li>';
        }

        $('.pageNation.only_mo').html(pageLinks);
    }
});

function loadVideoOperate(seq, success, failure) {
	$.ajax({
        url: "/api1/youthPolicy/" + seq,
        type: "get",
        success: function (response) {
			success(response.data);
        },
        error: function (xhr) {
            failure();
        },
    });
}

$(".cardModal").on("click", function (event) {
    // Check if the clicked element is the background (not .cardInfo)
    if ($(event.target).is(".cardModal")) {
        $(".cardModal").fadeOut(200);
    }
});

$(".close").click(function () {
    $(".cardModal").fadeOut(200);
});
