$(window).resize(() => {
    const deviceWidth = $(window).width();
    const deviceHeight = $(window).height();
    const sideToolTab = $('.mapSideToolTab');
    const mobSearchBar = $('.choicePlaceDetail ');
    const curPlace = $('.curPlace');
    const tagOption = $('.choiceServiceTag');
    const titleDom = $('.titleWrap');
    const searchOptionDom = $('.availableHide');
    let topFixedMenu;
    if (deviceWidth >= 744) {
        const deviceHeight = $(window).height();
        $('.mapSideToolTab').css({
            maxHeight: deviceHeight,
        });
        mobSearchBar.attr('onclick', '()=>{}');
        mobSearchBar.attr('readonly', false);
        // alert();
        sideToolTab.css({
            top: '0vh',
        });
        $('.sideToolToggleBtn').css({
            top: '30vh',
        });
        sideToolTab.addClass('open');
        curPlace.css({top: 'auto', bottom: '24px', right: '24px'});
    } else {
        tagOption.removeClass('hide');
        titleDom.removeClass('hide');
        searchOptionDom.removeClass('hide');
        sideToolTab.css({
            top: '40vh',
        });
        $('.sideToolToggleBtn').css({
            top: '40vh',
        });
        sideToolTab.addClass('open');
        setTimeout(() => {
            curPlace.css({top: sideToolTab.offset().top - 14});
        }, 200);
    }
});
$(window).click(() => {
    $('.valueList').removeClass('open');
});
$('.mapSideToolTab').addClass('open');
// $(document).tooltip({delay: 0, opacity: 0.2});
if ($(window).width() <= 744) {
    const tagOption = $('.choiceServiceTag');
    const titleDom = $('.titleWrap');
    const searchOptionDom = $('.availableHide');
    tagOption.removeClass('hide');
    titleDom.removeClass('hide');
    searchOptionDom.removeClass('hide');
} else {
    const tagOption = $('.choiceServiceTag');
    const titleDom = $('.titleWrap');
    const searchOptionDom = $('.availableHide');
    const deviceHeight = $(window).height();
    // tagOption.addClass('hide');
    // titleDom.addClass('hide');
    // searchOptionDom.addClass('hide');
    $('.mapSideToolTab').css({
        maxHeight: deviceHeight,
    });
}

function hideFilter() {
    const tagOption = $('.choiceServiceTag');
    const titleDom = $('.titleWrap');
    const searchOptionDom = $('.availableHide');
    tagOption.toggleClass('hide');
    titleDom.toggleClass('hide');
    searchOptionDom.toggleClass('hide');
    let $btnCont = $('.fixedToolHideBtn');
    let $serviceCont =  $('.topFixedMenu .searchOption .titleWrap');
    $('.fixedToolHideBtn').toggleClass('close');

        if ($btnCont.hasClass('close')) {
                $btnCont.find('span').text('검색필터 열기');
                $serviceCont.hide();
        } else {
               $btnCont.find('span').text('검색필터 접기');
               $serviceCont.show();
        }
}
function toggleSideTollTab(btn, e) {
    const deviceWidth = $(window).width();
    const deviceHeight = $(window).height();
    const sideToolTab = $('.mapSideToolTab');
    const mobSearchBar = $('.choicePlaceDetail ');
    const curPlace = $('.curPlace');
    let topFixedMenu;
    if (deviceWidth >= 744) {
        // alert();
        sideToolTab.toggleClass('open');

    } else {
        // const tagOption = $('.choiceServiceTag');
        const tagOption = $($('.searchOption')[1]);
        const titleDom = $('.titleWrap');
        const searchOptionDom = $('.availableHide');
        sideToolTab.toggleClass('open');
        if (sideToolTab.hasClass('open')) {
            // $($('.searchOption')[1]).show();
            tagOption.removeClass('hide');
            titleDom.removeClass('hide');
            // searchOptionDom.removeClass('hide');
            sideToolTab.css({top: '40vh'});
            $('.myLocation').css('top', '34vh');

            $('.sideToolToggleBtn').css({
                top: '40vh',
            });
            
            mobSearchBar.attr('readonly', false);
            mobSearchBar.attr('onclick', '()=>{}');
            setTimeout(() => {
                curPlace.css({top: sideToolTab.offset().top - 14});
            }, 200);
        } else {
            // $($('.searchOption')[1]).hide();
            tagOption.addClass('hide');
            titleDom.addClass('hide');
            $('.myLocation').css('top', '82vh');
            // searchOptionDom.addClass('hide');
            topFixedMenu = $('.topFixedMenu').height();

            sideToolTab.css({
                top: deviceHeight - topFixedMenu - 32 + 'px',
            });
            $('.sideToolToggleBtn').css({
                top: deviceHeight - topFixedMenu - 32 + 'px',
            });
            mobSearchBar.attr('readonly', true);
            mobSearchBar.attr('onclick', 'toggleSideTollTab()');
            setTimeout(() => {
                curPlace.css({top: sideToolTab.offset().top - 14});
            }, 200);
        }
    }
}
// function drodownUl(btn, e) {
//     e.stopPropagation();
//     $(btn).siblings('.valueList').toggleClass('open');
// }

function toggleService(e) {
    $(e).toggleClass('activeTag');
}

function detailPopOpen(e) {
    $(e).siblings('.placeinfo').toggleClass('open');
}

// function modalOpen(e) {
//     e && e.stopPropagation();
//     $('.storePopup').toggleClass('popUpOpen');
// }
function valueChange(e) {
    let value = $(e).text();
    $(e).parent().siblings().children('span').text(value);
    $(e).parent().toggleClass('open');
}
$(window).resize(() => {
    $(window).width() <= 744 &&
    $('.mapSideToolTab').draggable({
        axis: 'y',
        create: function (event, ui) {},
        start: (event, ui) => {
            $($(event)[0].target).css({transition: '0s'});
        },
        handle: '.sideToolToggleBtn',
        drag: (event, ui) => {
            // console.log($($(event)[0].target).offset().top);
            $('.sideToolToggleBtn').css({
                transition: '0s',
                top: $($(event)[0].target).offset().top,
            });
        },
        stop: function (event, ui) {
            if (
                ui.position.top - ui.originalPosition.top >
                88
            ) {
                $($(event)[0].target).css({
                    transition: '0.2s',
                });
                $('.sideToolToggleBtn').css({
                    transition: '0.2s',
                });
                toggleSideTollTab();
            } else {
                $($(event)[0].target).css({
                    transition: '0.2s',
                    top: ui.originalPosition.top,
                });
                $('.sideToolToggleBtn').css({
                    transition: '0.2s',
                    top: ui.originalPosition.top,
                });
                toggleSideTollTab();
            }
            // console.log(ui.position.top - ui.originalPosition.top > 88);
        },
    });
});
$(window).width() <= 744 &&
$('.mapSideToolTab').draggable({
    axis: 'y',
    create: function (event, ui) {},
    start: (event, ui) => {
        $($(event)[0].target).css({transition: '0s'});
    },
    handle: '.sideToolToggleBtn',
    drag: (event, ui) => {
        // console.log($($(event)[0].target).offset().top);
        $('.sideToolToggleBtn').css({
            transition: '0s',
            top: $($(event)[0].target).offset().top,
        });
    },
    stop: function (event, ui) {
        if (ui.position.top - ui.originalPosition.top > 88) {
            $($(event)[0].target).css({
                transition: '0.2s',
            });
            $('.sideToolToggleBtn').css({
                transition: '0.2s',
            });
            toggleSideTollTab();
        } else {
            $($(event)[0].target).css({
                transition: '0.2s',
                top: ui.originalPosition.top,
            });
            $('.sideToolToggleBtn').css({
                transition: '0.2s',
                top: ui.originalPosition.top,
            });
            toggleSideTollTab();
        }
        // console.log(ui.position.top - ui.originalPosition.top > 88);
    },
});
