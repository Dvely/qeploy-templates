function mobGnbClose(e) {
    let mobGnbWrap = $('.mobGnbWrap');
    let dropIconWrap = $('.mobGnbWrap .dropIconWrap');
    let twodepthWrap = $('.mobGnbWrap .twodepthWrap');
    let mobGnbName = $('.mobGnbWrap .mobGnbName');
    let headerThemaChange = $('.mobGnbWrap .headerThemaChange');
    let logo = $('.mainLogo img');
    let gnbBtn = $('.topHeader .right');
    mobGnbWrap.removeClass('gnbOpen');
    gnbBtn.removeClass('open');
    dropIconWrap.removeClass('open');
    twodepthWrap.removeClass('open');
    mobGnbName.removeClass('open');
    headerThemaChange.removeClass('open');
    logo.removeClass('open');
    logo.attr('src', 'images/daywell24-logo.svg');
}
function mobGnbOpen(e) {
    let mobGnbWrap = $('.mobGnbWrap');
    let dropIconWrap = $('.mobGnbWrap .dropIconWrap');
    let twodepthWrap = $('.mobGnbWrap .twodepthWrap');
    let mobGnbName = $('.mobGnbWrap .mobGnbName');
    let headerThemaChange = $('.mobGnbWrap .headerThemaChange');
    let logo = $('.mainLogo img');
    if ($(window).width() <= 768) {
        $(e).toggleClass('open');
        mobGnbWrap.toggleClass('gnbOpen');
        headerThemaChange.toggleClass('open');
        dropIconWrap.removeClass('open');
        twodepthWrap.removeClass('open');
        mobGnbName.removeClass('open');

        if (logo.hasClass('open')) {
            console.log(logo.attr);
            logo.removeClass('open');
            logo.attr('src', 'images/daywell24-logo.svg');
        } else {
            logo.css({opacity: '0', transition: '0.2s', maxWidth: '0'});
            logo.addClass('open');
            logo.attr('src', 'images/daywell24-logo-white.svg'); // 2026-05-07 [개선] 홈페이지 컨텐츠 및 ui 수정
            setTimeout(() => {
                logo.css({opacity: '1', maxWidth: 'none'});
            }, 100);
        }
    } else {
        return false;
    }
}
function mobGnbTwodepOpen(e) {
    let dropIconWrap = $(e).children('.ondepthWrap').children('.dropIconWrap');
    let mobGnbName = $(e)
        .children('.ondepthWrap')
        .children('.titleWrap')
        .children('.mobGnbName');
    let twodepthWrap = $(e).children('.twodepthWrap');
    // console.log($(e).children('.dropIconWrap'));
    // let twodepthWrap =
    dropIconWrap.toggleClass('open');
    twodepthWrap.toggleClass('open');
    mobGnbName.toggleClass('open');
}
