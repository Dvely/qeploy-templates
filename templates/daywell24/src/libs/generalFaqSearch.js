const KIND = "GENERAL";
const PAGE_LENGTH = 15;
let gState = {};

$(function () {
    gState.search = window.searchTxt || null;
    let $container = $('.faqSearchResultSection .top5Wrap');
    let $quickSearch = $('.autoSerchList');
    $('.centerGrayBtnWrap .button').click(function () {
        drawPage($container, false);
    });
    $('.searchBarForm input').keyup(function () {
        let $me = $(this),
            inputLen = $me.val().length;

        gState.search = $me.val();

        $quickSearch.children().remove();
        if (inputLen) {
            loadFaq(1, function (data) {
                for(let i = 0; i < data.length; i ++) {
                    var $quick = drawAutoSearchItem(data[i]);
                    $quick.appendTo($quickSearch)
                }

            }, function () {}, true);
        }
    });

    $('.searchBtn').click(function () {
        $('form.searchBarForm').submit();
    })

    $('.textButton').click(function () {
     location.href="daywell24-helpdesk.html";
    })

        $('.last').click(function (e) {
           e.preventDefault();
           e.stopPropagation();
           let url = 'daywell24-contracts.html';
           let width = $(window).width();

           if(width > 744 ) {
              window.open(url,"_blank");
              return;
           }

           if(width < 745 ) {
              alert('PC에서 이용해주세요.');
           }
        })
});

function loadFaq(page, success, failure, titleSearch) {
    let parm = {
        KIND: KIND,
        search: gState.search,
        length: PAGE_LENGTH
    };

    if (titleSearch) {
        parm.page = 1;
        parm.search_target = 'QUESTION';
    } else {
        parm.page = 1;
        parm.CATEGORY_SEQ = gState.CATEGORY_SEQ || 0;
    }

    $.ajax({
        url: "/api1/faq/",
        type: "get",
        data: parm,
        success: function(response) {
            success(response?.data || [], response?.count || 0);
        },
        error: function(xhr) {
            failure();
        }
    });
}


function drawPage($container, reset) {
    if (reset) {
        $container.children().remove();
    }
    let page = Math.floor($container.children('.question').length / PAGE_LENGTH) + 1;
    let $showBtn = $('.centerGrayBtnWrap');
    loadFaq(page, function (dat, count) {
        for (let i = 0; i < dat.length; i ++) {
            let cls = 'faq-' + dat[i].SEQ;
            if (!$container.find('.' + cls).length) {
                let $faq = drawFaqItem(dat[i])
                $faq.appendTo($container);
            }
        }
        if (count <= $container.children().length) {
            $showBtn.hide();
        } else {
            $showBtn.show();
        }
    }, function () {}, false);
}

function drawFaqItem(aItem) {
    let id = 'FAQ_ID' + aItem.number;

    if (gState.search && gState.search.length) {
        aItem.QUESTION = aItem.QUESTION.replace(new RegExp(gState.search) , "<bold class=\"focus\">" + gState.search + "</bold>");
        aItem.ANSWER = aItem.ANSWER.replace(new RegExp(gState.search) , "<bold class=\"focus\">" + gState.search + "</bold>");
    }
    return $(`
        <li class="question faq-${aItem.SEQ}">
            <input id="${id}" type="checkbox" />
            <label for="${id}">
                <div class="qTitleWrap">
                    <div class="icon">
                        <img
                                src="assets/assets/imgs/quest.png"
                                alt="question"
                        />
                    </div>
                    <div class="questionText">
                        <span>${aItem.QUESTION}</span>
                        <div class="icon">
                            <img
                                    src="assets/assets/imgs/arrowDown40.png"
                                    alt="드롭따운"
                            />
                        </div>
                    </div>
                </div>
            </label>
            <div class="aContent">
                <div class="icon">
                    <img
                            src="assets/assets/imgs/answer.png"
                            alt="question"
                    />
                </div>
                <div class="answerText">
                    <span>${aItem.ANSWER}</span>
                </div>
            </div>
        </li>
    `);
}

function drawAutoSearchItem(faqItem) {
    let boldTitle = faqItem?.QUESTION?.replace(new RegExp(gState.search, 'g'), "<bold class=\"focus\">" + gState.search + "</bold>")
    let $keyword = $(`
            <li class="autoSerchKeyword">
                <span>${boldTitle}</span>
            </li>
        `);
    $keyword.mousedown(function () {
        location.href = 'daywell24-helpdesk.html?faq=' + faqItem.SEQ + '&search=' + faqItem?.QUESTION;
    });

    return $keyword;
}