let dupCount = 0;
$(function () {
    $('.tubeBox').click(function () {
        var $me = $(this),
            url = $me.data('movie'),
            seq = $me.data('seq');

        console.log("open Youtube")
        openYouTube(url, seq)
    });
    $('.modalHeader').click(function () {
        $('.tubeModal').css({display: 'none'});
        $('#youtube_player')[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
    });

    $('.sucessTube .tubeBox').mouseenter(function () {
        $(this).children('.yutub').show();
        $(this).children('.tubeIcon').hide();
    });
    $('.sucessTube .tubeBox').mouseleave(function () {
        $(this).children('.yutub').css('display', 'none');
        $(this).children('.tubeIcon').show();
    }); // modal

    //상단 조회
    $.ajax({
        url: "/api1/board/story/top",
        type: "GET",
        success: function(response) {
            if (response.error >= 0) {
                storyTopItem(response);
            }
        },
        error: function(xhr) {
        }
    });

    $('.moreViewBtn a').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        drawPage()
    });
    drawPage()
});

function openYouTube(url, seq) {
    $('.tubeModal').find('iframe').attr("src", url);
    $('.tubeModal').css({display: 'flex'});

    $.ajax({
        url: "/api1/board/read/" + seq,
        type: "POST",
    });
}

function drawPage() {
    let $cont = $('.sucessTube');
    let tubeBoxCnt = $cont.children('.tubeBox').length;
    let page = Math.floor(tubeBoxCnt / 9) + 1;

    loadStory(page, function (data, count) {
        dupCount = 0;
        each(data || [], function (i, item) {
            storyStoryItem(item, $cont, count);
        });
        if ($cont.children().length >= count - dupCount) {
            $('.moreViewBtn').hide();
         }
    }, function () {})
}

function loadStory(page, success, failure) {
    //일반
    $.ajax({
        url: "/api1/board/story",
        type: "GET",
        data: {
            page: page,
            length: 9
        },
        success: function(response) {
            if (response.error >= 0) {
                success(response.data, response.count);
            }
        },
        error: function(xhr) {
            failure();
        }
    });
}

function storyTopItem(response) {
    if(response.count < 1) {
        return;
    }

    let data = response.data[0];

    //동적으로 html 생성
    let html = "";
    //html += "<div class='interviewWrap'>";
    if(data.PC_IMAGE) {
        html += "<div class='interviewImg'>";
        html += "<img src='" + data.PC_IMAGE.url + "'/>";
        html += "</div>";
    }
    html += "<div class='interviewTxt'>";
    html += "<div class='info'>";
    if(data.CNTE_CATE_NM) {
        html += "<span>";
        html += data.CNTE_CATE_NM
        html += "</span>";
    }
    if(data.OWR_NM) {
        html += "<p class='name'>" + data.OWR_NM + "</p>";
    }
    if(data.STR_NM) {
        html += "<p>" + data.STR_NM + "</p>";
    }
    html += "</div>";
    html += "<div class='desc'>";
    if(data.CNTE_M_CTNTS) {
        html += data.CNTE_M_CTNTS;
    }
    if(data.CNTE_D_CTNTS) {
        html += "<br>";
        html += data.CNTE_D_CTNTS;
    }
    html += "</div>";
    if(data.URL) {
        html += "<div class='btnMore'>";
        html += "<div class='basicBtnWrap white'>";

        let linkType = "_self";

        if(data.LNK_TYPE_CD) {
            if(data.LNK_TYPE_CD == "NEW") {
                linkType = "_blank";
            }

            if(data.LNK_TYPE_CD == "NOW") {
                linkType = "_self";
            }
        }

        html += "<a href='" + data.URL + "' target='" + linkType + "'>자세히 보기</a>";
        html += "</div>";
        html += "</div>";
    }
    html += "</div>";
    //html += "</div>";

    $(".interviewWrap").append(html);

    //return html;
}

function storyStoryItem(storyItem, $cont, count) {
    if ($cont.find('.board-' + storyItem?.SEQ).length) {
        dupCount =+ 1;
        return null;
    }
    let $item = $(`
        <div class="tubeBox board-${storyItem?.SEQ}" data-movie=${storyItem?.movie}>
            <div class="yutub"></div>
            <div class="tubeWrap">
                <img onerror="this.src='images/daywell24-store.png'" src="${storyItem?.PC?.url}" alt="" />
            </div>
            <div class="tubeIcon"></div>
            <h3 th:text="">${storyItem?.TITLE}</h3>
            <p th:utext="">${storyItem?.EXPLAIN}</p>
        </div>
    `).appendTo($cont);

    $item.mouseenter(function () {
        $(this).children('.yutub').show();
        $(this).children('.tubeIcon').hide();
    });
    $item.mouseleave(function () {
        $(this).children('.yutub').css('display', 'none');
        $(this).children('.tubeIcon').show();
    }); // modal
    $item.click(function () {
        openYouTube(storyItem?.movie, storyItem?.SEQ);
    });

    $item.data('seq', storyItem.SEQ);
}