//최초 로딩 시 에디터 저장 데이터 href에 id 부여 (에디터에서 id 등록 불가)
window.addEventListener("DOMContentLoaded", function() {
    
    document.querySelectorAll("a").forEach(link => {
        if (link.textContent.includes("(현황보기)")) {
            link.setAttribute("href", "#");
        }
    });

    setTimeout(function(){
        var modalLink = document.querySelector('a[href="#"]');
        modalLink.setAttribute("id", "modalLink");
    
        // 링크 클릭 시 모달 열기
        modalLink.addEventListener("click", function(event) {
            $('.cardModal').fadeIn(200);
            //협력사 리스트 로드
            $("#partnerNmSearch").val("");
            loadPartnerCompanyPopup();
        });
    }, 500);
    
    //최초 로딩 시 협력사 데이터 조회
    $("#partnerCompanyArea").hide();
    //loadPartnerCompany();
});

$(function () {
    const $policyBodySection = $(".policyVer");
    $(".policySelect .select").click(function () {
        $(this).toggleClass("active");
    });

    $(".policySelect .dropOption").click(function () {
        let $me = $(this),
            curText = $me.text(),
            seq = $me.data("policy_seq");

        if (seq) {
            loadPolicy(
                seq,
                function (data) {
                    let body = data?.[0].BODY;

                    $policyBodySection.html(body);

                    $(".policySelect .dropLabel").text(curText);
                    $(".policySelect .select").removeClass("active");
                },
                function () {
                    window.alert("정보를 읽는데 실패하였습니다.");
                }
            );
        }
    });
});

function loadPolicy(seq, success, failure) {
    $.ajax({
        url: "/api1/policy/" + seq,
        type: "get",
        success: function (response) {
            success(response.data);
        },
        error: function (xhr) {
            failure();
        },
    });
}

function loadPartnerCompany() {
    $.ajax({
        url: "/api1/policy/partnerCompanyList",
        type: "get",
        success: function (response) {
            var data = response.data;
            var str = "";

            if (data.length == 0) {
                $("#partnerCompanyArea").hide();
            } else {
                $("#partnerCompanyArea").show();

                str += "<table>";
                str += "<tbody>";

                for (var i = 0; i < data.length; i++) {
                    if (i % 4 === 0) {
                        if (i !== 0) {
                            str += "</tr>";
                        }
                        str += "<tr>";
                    }

                    str += "<td><div>" + data[i].TITLE + "</div></td>";

                    if (i % 4 === 3 || i === data.length - 1) {
                        str += "</tr>";
                    }
                }

                str += "</tbody>";
                str += "</table>";
                $("#partnerCompanyTableList").append(str);
            }
        },
        error: function (xhr) {
            alert("협력사 정보를 읽는데 실패하였습니다.");
        },
    });
}

function loadPartnerCompanyPopup() {
    $.ajax({
        url: "/api1/policy/partnerCompanyList",
        type: "get",
        data: {"search": $("#partnerNmSearch").val()},
        success: function (response) {
            var data = response.data;
            var str = "";
            
            if(data.length == 0){
                $("#company_list").empty();
                $("#company_list").append("<br><br><br><br><br><br><br><br><br><br><p style='text-align: center; font-weight: bold;'>검색 결과가 없습니다.</p>");
                // 페이징 없앰
                $(".prevButtons").empty();
                $(".pageNation").empty();
                $(".nextButtons").empty();
            }else{
                $("#company_list").empty();
                for(var i=0;i<data.length;i++){
                    var num = i+1;
                    str += "<li>"+data[i].TITLE+"</li>";
                    
                    if(num == data.length){
                        $("#company_list").append(str);
                        
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
                    }
                    
                }
            }
        },
        error: function (xhr) {
            alert("협력사 정보를 읽는데 실패하였습니다.");
        },
    });
}

function handleKeyPress(event) {
    // Enter 키로 검색
    if (event.keyCode === 13) {
        loadPartnerCompanyPopup();
    }
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
