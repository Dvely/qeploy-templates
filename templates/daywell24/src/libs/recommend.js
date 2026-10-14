let gState = {
    areaSeq : 0,
    areaTitle: null,
    PAGE_LENGTH: 10
}

$(function () {
    $('.tag').click(function () {
        let areaSeq = $(this).data('areaseq');
        let areaTitle = changeBigArea(areaSeq);
        // let place = $(this).attr('value');
        // let areaTitle = $(this).find('p').text();
        //
        // $('.mapArea').removeClass('active');
        // $('.tag').removeClass('focus');
        // $(this).toggleClass('focus');
        // $('.mapArea' + '.' + place).toggleClass('active');
        //
        // selectBigCategory(areaSeq);
        gState.areaSeq = areaSeq || 0;
        gState.areaTitle = areaTitle || null;
        drawPage(1);
    });

    $('.mapArea').click(function () {
        let place = $(this).attr('value');
        let areaSeq = $('.tag.' + place).data('areaseq');
        let areaTitle = changeBigArea(areaSeq);
        // $('.mapArea').removeClass('active');
        // $('.tag').removeClass('focus');
        // $(this).toggleClass('active');
        //
        // $('.tag.' + place).toggleClass('focus');
        //
        // let areaSeq = $('.tag.' + place).data('areaseq');
        // let areaTitle = $('.tag.' + place).find('p').text();
        // selectBigCategory(areaSeq);
        gState.areaSeq = areaSeq || 0;
        gState.areaTitle = areaTitle || null;
        drawPage(1);
    });

    $(".bigCategory .dropLabel, .smallCategory .dropLabel").click(function () {
        $(this).parent().find('.policyUl').toggleClass('selectOpen');
    })

    $(".bigCategory .policyUl li").click(function () {
        bigSelectHandler($(this));
    })

    $('.search-btn').click(function () {
        // let areaSeq = $('select.smallCategoryInput').find('option:selected').val();
        let $smallCategory = $('.smallCategory'),
            curLabel = $smallCategory.find('.dropLabel span').text(),
            areaSeq = 0, areaTitle = null;

        $smallCategory.find('.policyUl li').each(function (i, li) {
            if ($(li).text() == curLabel) {
                areaSeq = $(li).data('areaseq');
                areaTitle = $(li).text();
                return false;
            }
        })

        let titles = [];
        let smallTitle = $smallCategory.find('.select .dropLabel span').text();
        let bigTitle = $('.bigCategory').find('.select .dropLabel span').text();
        if (bigTitle != '전국') {
            titles.push(bigTitle);
        }
        if (smallTitle != '전체') {
            titles.push(smallTitle);
        }

        //사이트 개편으로 지도 UI 제거로 주석처리
        //changeBigArea($smallCategory.find('.policyUl li:first').data('areaseq'));

        if (titles.length) {
            gState.areaTitle = titles.join(">");
        } else {
            gState.areaTitle = null;
        }

        gState.areaSeq = areaSeq;
        drawPage(1);
    });

    $('.searchTitleSection .buttonText').click(function () {
        gState.areaSeq = 0;
        gState.areaTitle = null;
        $('.mapArea').removeClass('active');
        $('.tag').removeClass('focus');
        drawPage(1);
    })

    drawPage(1);
})

function changeBigArea(areaSeq) {
    //  지도를 클리어한다.
    $('.mapArea').removeClass('active');
    $('.tag').removeClass('focus');

    //  tag 를 새팅한다.
    let $targetTag = null;
    $('.tagClickChoiceBox .tags li.tag').each(function (i, li) {
        let $li = $(li);
        if ($li.data('areaseq') == areaSeq) {
            $targetTag = $li;
            return false;
        }
    });
    let areaTitle = $targetTag.find('p').text();
    let place = $targetTag.attr('value');

    //  map, bigCategory를 새팅한다.
    $targetTag.addClass('focus');
    $('.mapArea' + '.' + place).addClass('active');
    selectBigCategory(areaSeq);

    return areaTitle;
}

function selectBigCategory(areaSeq) {
    const $bigSelect = $('.bigCategory'),
        $label = $bigSelect.find('.dropLabel span'),
        $list = $bigSelect.find('ul');

    $list.find('li').each(function (index, item) {
        var $item = $(item),
            itemAreaSeq = $item.data('areaseq');

        if (itemAreaSeq == areaSeq) {
            if ($item.text() != $label.text()) {
                bigSelectHandler($item);
            }
        }
    });
}

function drawSmallCategoryItem(parentAreaSeq) {
    const $smallCategory = $('.smallCategory'),
        $label = $smallCategory.find('.dropLabel span'),
        $list = $smallCategory.find('ul')

    $list.children().remove();
    $('<li data-areaseq="' + parentAreaSeq + '">전체</li>').appendTo($list);
    $label.text('전체');

    if (parentAreaSeq > 0) {
        loadArea(parentAreaSeq, function (data) {
            for (let i = 0; i < data.length; i ++) {
                $('<li data-areaseq="' + data[i].SEQ + '">' + data[i].TITLE + '</li>').appendTo($list);
            }
            $list.find('li').click(function () {
                smallSelectHandler($(this));
            })
        }, function () {})
    }
}

function bigSelectHandler($li) {
    $li.closest('.select').find('.dropLabel span').text($li.text());
    $('.bigCategory .policyUl').removeClass('selectOpen');
    $('.smallCategory .policyUl').removeClass('selectOpen');

    drawSmallCategoryItem($li.data('areaseq'));
}

function smallSelectHandler($li) {
    $('.smallCategory .policyUl').removeClass('selectOpen');
    $li.closest('.select').find('.dropLabel span').text($li.text());
}

function drawPage(page) {
    const $cont = $('.rcmd-list')
    let $pageCont = $('.pageNationWrap')
    drawSearchTitleSection();

    $cont.children('.colum.cliker').remove();
    loadRecommend(page, gState.areaSeq || 0, function (data, count) {
        each(data || [], function (i, itemData) {
            let $item = drawRcmdItem(itemData)
            $item.appendTo($cont);
        });

        drawPaging(page, gState.PAGE_LENGTH, count, function (newPage) {
            drawPage(newPage)
        }, '.pageNationWrap')
    }, function () {})
}

function drawSearchTitleSection() {
    let $searchTitle = $('.searchTitleSection');

    if (empty(gState.areaTitle)) {
        $searchTitle.hide();
    } else {
        $searchTitle.find('.faqTitle').text("'" + gState.areaTitle + "' 검색결과")
        $searchTitle.fadeIn();
    }
}

function loadArea(areaSeq, success, failure) {
    $.ajax({
        url: "/api1/area/" + areaSeq,
        type: "get",
        success: function(response) {
            if (areaSeq == 1) {
                response.data.push({
                    PARENT_SEQ: 6,
                    SEQ: 52,
                    TITLE: "세종시"
                })
            }
            success(response.data);
        },
        error: function(xhr) {
            failure();
        }
    });
}

function loadRecommend(page, areaSeq, success, failure) {

    $.ajax({
        url: "/api1/recommend/" + areaSeq,
        type: "get",
        data: {
            page: page,
            length: gState.PAGE_LENGTH
        },
        success: function(response) {
            success(response.data, response.count);
        },
        error: function(xhr) {
            failure();
        }
    });
}

function drawRcmdItem(rcmd) {
    let areas = []
    if (!empty(rcmd.PAREAS)) {
        areas.push(rcmd.PAREAS);
    }
    areas.push(rcmd.AREAS);
    let areaName = areas.join(" ");

    let have2Pay = [];
    let allPrice = 0, allPriceDesc;
    if (!empty(rcmd.INVESTMENT)) {
        have2Pay.push("개점투자비(" + commify(rcmd.INVESTMENT) + ")");
        allPrice += parseInt(rcmd.INVESTMENT);
    }
    if (!empty(rcmd.PREMIUM)) {
        have2Pay.push("권리금(" + commify(rcmd.PREMIUM) + ")");
        allPrice += parseInt(rcmd.PREMIUM);
    }
    if (!empty(rcmd.DEPOSIT)) {
        have2Pay.push("보증금(" + commify(rcmd.DEPOSIT) + ")");
        allPrice += parseInt(rcmd.DEPOSIT);
    }
    allPriceDesc = have2Pay.join(" + ");
    allPrice = commify(Math.round(allPrice));

    let $item = $(`
        <li class="colum cliker">
            <div class="viewContents">
                <div class="row oneRow dataNum"><span>${rcmd.number}</span></div>
                <div class="row fiveRow dataPlace">
                    <span>${areaName || ''}</span>
                </div>
                <div class="row twoRow dataStorePlace">
                    <span >${rcmd.SPECIAL || ''}</span>
                </div>
                <div class="row twoRow dataCost">
                    <span>${allPrice} 만원</span>
                </div>
                <div class="row twoRow dataArea">
                    <span> ${rcmd.AREASIZE}&#13217; </span>
                    <div class="icon dropIcon openDropIcon">
                        <img
                            src="assets/assets/imgs/arrowDown40.png"
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div class="hideContents borderNone rightAlign paddingNone">
                <div class="row elevenRow line">
                    <span></span>
                </div>
            </div>
            <div class="hideContents borderNone">
                <div class="row oneRow">
                    <span></span>
                </div>
                <div class="row oneRow leftAlign captionColor">
                    <span>면적</span>
                </div>
                <div class="row tenRow leftAlign">
                    <span>${rcmd.AREASIZE}&#13217;</span>
                </div>
            </div>
            ${
            rcmd.STF_TEL_NO ?
            `
            <div
                class="hideContents borderNone rightAlign paddingNone">
                <div class="row elevenRow line">
                    <span></span>
                </div>
            </div>
            <div class="hideContents borderNone">
                <div class="row oneRow">
                    <span></span>
                </div>
                <div class="row oneRow leftAlign captionColor">
                    <span>문의</span>
                </div>
                <div class="row tenRow leftAlign">
                    <span>
                        <a href="tel:${rcmd.STF_TEL_NO}">${rcmd.STF_TEL_NO}</a>
                    </span>
                </div>
            </div>
            ` : ''
            }
            <div class="hideContents borderNone rightAlign paddingNone">
                <div class="row elevenRow line">
                    <span></span>
                </div>
            </div>
            <div class="hideContents borderNone rightAlign paddingNone">
                <div class="row elevenRow line">
                    <span></span>
                </div>
            </div>
            <div class="hideContents borderNone">
                <div class="row oneRow">
                    <span></span>
                </div>
                <div class="row oneRow leftAlign captionColor">
                    <span>내용</span>
                </div>
                <div class="row tenRow leftAlign multiLine">
                    <span >${rcmd.EXPLAIN}</span>
                </div>
            </div>
            <div class="hideContents borderNone">
                <div class="row oneRow">
                    <span></span>
                </div>
                <div class="row twoRow leftAlign">
                    <div class="button go_request">상담신청</div>
                </div>
            </div>
        </li>
    `);
    $item.find('.go_request').click(function () {
        location.href = "daywell24-franchise-contact.html?space=" + rcmd.SEQ;
    });
    $item.data('rcmd', rcmd);

    openPanelConfig($item.find('.viewContents'));

    return $item;
}


function openPanelConfig($item) {
    $item.unbind('click').click(function () {
        let $me = $(this);
        let rcmd = $me.parent().data('rcmd');

        $me.parent().find('.hideContents').toggleClass('open');
        $me.find('.row .dropIcon').toggleClass('openDropIcon');

        openHideTable(null, rcmd)
    })
}

function openHideTable(e, listData) {
    let windowWidth = $(window).width();
    // let modalTitle = $(e).attr('data-value');
    let modal = $('.modal');


    if (windowWidth <= 744) {
        let areas = listData?.AREAS;
        let special = listData?.SPECIAL;
        let areaSize = listData?.AREASIZE;
        let explain = listData?.EXPLAIN;
        let rcmdSeq = listData?.SEQ;
        let stfTelNo = listData?.STF_TEL_NO;

        $('.modalList .title').text(areas)
        $('.modalList .dataCost span').text(special)
        $('.modalList .dataAreaSize span').text( areaSize + '㎡')
        $('.modalList .dataExplain span').text(explain)

        //전화번호에 대한 처리
        if(stfTelNo) {
            //inline style 삭제(display: none 삭제)
            $('.modalList .TelNo').removeAttr("style");

            //텍스트 변경
            $('.modalList .dataTelNo span a').text(stfTelNo);

            //링크 처리
            $('.modalList .dataTelNo span a').attr("href", "tel:" + stfTelNo);
        } else {
            //번호가 없는 경우에는 다시 style 적용
            $('.modalList .TelNo').attr("style", "display:none");
        }


        $('.modalList .buttonWrap .button').unbind('click').click(function () {
            location.href = "daywell24-franchise-contact.html?space=" + rcmdSeq;
        })

        // modal.parent().toggleClass('open');
        $('.modalList').addClass('open')
        modal.addClass('open');
    } else {
        // $(e).siblings().toggleClass('open');
        // $(e)
        //     .children('.row')
        //     .children('.dropIcon')
        //     .toggleClass('openDropIcon');
    }
}

function closeTable() {
    $('.modalList').removeClass('open');
    $('.modal').removeClass('open');
}
// function onClickSelect(e) {
//     console.log(this);
//     $(e).children('.policyUl').toggleClass('selectOpen');
// }
//
// function onClickOption(e) {
//     const selectedValue = $(e).text();
//     console.log(selectedValue);
//     $(e)
//         .parent('.policyUl')
//         .siblings()
//         .children('span')
//         .html(selectedValue);
//     selectedValue;
// }