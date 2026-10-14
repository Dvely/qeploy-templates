const header = $('header');

if($(window).width() < 744){
    // 클래스로 모바일 애니메이션 빼도록 수정중
    $('*').not('.mobGnbWrap, .headerThemaChange, .firstBack, .seconBack, .thrdBack, .mobGnbs>li, .mobGnbs .twodepthWrap, .mobGnbs .dropIconWrap').css({transition: 'unset'})
    $('section').addClass('active')
    $('.contentHeader > h1.tabTitle').css({fontSize:'20px'})

}else{$('.contentHeader > h1.tabTitle').css({fontSize:'48px'})}
const bottomHeader = document.querySelector('.bottomHeader');

const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
        if ($('#fullpage').length == 1) {
        } else if ($('.storeView').length >= 1) {
        } else {
            if ($(window).scrollTop() < 32) {
                $('body').css({
                    transition: '0.3s',
                    paddingTop:
                        $('header .bottomHeader')[0].offsetTop +
                        $('header .bottomHeader')[0].offsetHeight,
                });
            }
        }

    }
});
observer.observe(bottomHeader);
$(window).resize(function(){
    if($(window).width() < 744){
        $('.contentHeader > h1.tabTitle').css({fontSize:'20px'})
        $('section').addClass('active')
    }else{
        $('.contentHeader > h1.tabTitle').css({fontSize:'48px'})
    }
})
$('html').css({width:'100%'})
function paddingHeaderStorePagePc() {
    var headerHeight = $('header').height();
    $('body').css({paddingTop: 0});
    $('.mapSideToolTab').css({paddingTop: headerHeight});
    $('header').children('.bottomHeader').css({width: '100vw', margin: '0 0'});
}
function paddingHeaderNormalPagePc(headerHeight) {
    // $('html, body').animate({scrollTop: 0}, 100);
    $('header').css({
        background: '#fff',
        transition: '0.2s',
        transform: 'translateY(0)',
        width: '100vw',
    });
    $('header').children('.bottomHeader').css({width: '100vw', margin: '0 0'});
    $('body').css({paddingTop: headerHeight});
}
function paddingHeaderStorePageMob() {
    var headerHeight = $('header').height();
    $('body').css({paddingTop: 0});
    $('.mapSideToolTab').css({paddingTop: 0});

}
function paddingHeaderNormalPageMob(headerHeight) {
    // $('html, body').animate({scrollTop: 0}, 100);
    $('header').css({
        background: '#fff',
        transition: '0.2s',
        transform: 'translateY(-28px)',
    });
    $('body').css({paddingTop: headerHeight - 28 + 'px'});
}
function mobGnbClose() {}
function responsiveHeaderLayout(headerHeight) {
    if ($(window).width() >= 744) {
        // 피씨
        if ($('#fullpage').length == 1) {
        } else if ($('.storeView').length >= 1) {
            paddingHeaderStorePagePc(headerHeight);
        } else {
            mobGnbClose();
            header
                .children('.bottomHeader')
                .css({width: '100vw', margin: '0 0'});
            paddingHeaderNormalPagePc(headerHeight);
        }
    } else {
        // 모바일
        if ($('#fullpage').length == 1) {
        } else if ($('.storeView').length >= 1) {
            paddingHeaderStorePageMob();
        } else {
            mobGnbClose();
            header
                .children('.bottomHeader')
                .css({marginLeft: '14px', width: 'calc(100vw - 28px)'});
            paddingHeaderNormalPageMob(headerHeight);
        }
    }
}
function scrollDownHeaderPc() {
    // document.getElementsByClassName('bottomHeader')[0].removeAttribute('style');
    header.css({
        background: 'rgba(255, 255, 255, .5)',
        // 'max-height': '64px',
        transform: 'translateY(-28px)',
        transition: '0.2s',
        color: '#fff',

        'backdrop-filter': 'blur(5px)',
        '-webkit-backdrop-filter': 'blur(5px)',
    });
    $('header').children('.bottomHeader').css({
        height: 0,
        marginLeft: '0px',
        width: '100%',
        overflow: 'hidden',
        opacity: '0',
        transition: '0.2s',
    });

    header.hover(
        function () {
            header.children('.bottomHeader').css({
                height: '78px',
                // overflow: 'hidden',
                transition: '0.2s',
                opacity: '1',
            });
        },
        function () {
            header.css({
                background: '#fff',
                color: '#fff',
                transition: '0.1s',
                transform: 'translateY(0)',
            });
        },

        function () {
            header.css({
                transform: 'translateY(0px)',
                background: 'rgba(255, 255, 255, .5)',
                color: '#fff',
                'backdrop-filter': 'blur(5px)',
                '-webkit-backdrop-filter': 'blur(5px)',
                transition: '0.3s',
            });
        },
    );
}
function offsetTopHeaderPc() {
    header.css({
        background: '#fff',
        transition: '0.2s',
        transform: 'translateY(0)',
    });
    header.children('.bottomHeader').css({
        height: '78px',
        // overflow: 'hidden',
        transition: '0.2s',
        width: '100%',
        margin: '0 0',
        opacity: '1',
    });
    $('header').children('.bottomHeader').css({
        width: 'calc(100vw )',
        margin: '0 0',
    });
}
function scrollUpHeaderMob() {
    header.css({
        background: 'rgba(255,255,255,0.5)',
        transition: '0.2s',
        'backdrop-filter': 'blur(10px)',
        '-webkit-backdrop-filter': 'blur(10px)',
        transform: 'translateY(-28px)',
    });
    header.children('.bottomHeader').css({
        height: '0px',
        overflow: 'hidden',
        marginLeft: '14px',
        // overflow: 'hidden',
        transition: '0s',
        opacity: '0',
    });
    header.unbind('hover');
}
function scrollDownHeaderMob() {
    header.css({
        background: 'rgba(255,255,255,0.5)',
        transition: '0.2s',
        'backdrop-filter': 'blur(10px)',
        '-webkit-backdrop-filter': 'blur(10px)',
        transform: 'translateY(-28px)',
    });
    header.children('.bottomHeader').css({
        position: 'absolute',
        // width: 'calc(100vw - 28px)',
        // margin: '0 auto',
        height: '78px',
        // overflow: 'hidden',
        transition: '0s',
        opacity: '1',
    });
    header.unbind('hover');
}
function insertScrollEvent() {
    if ($(window).width() >= 744) {
        $(window).scroll(function () {
            if ($(window).width() >= 744) {
                let scrollY = $(window).scrollTop();
                if (scrollY >= 8) {
                    scrollDownHeaderPc();
                } else {
                    offsetTopHeaderPc();
                }
            }
        });
    } else {
        $(window).scroll(function () {
            header.hover(
                function () {
                    header.children('.bottomHeader').css({
                        height: '78px',
                        // overflow: 'hidden',
                        transition: '0.2s',
                        opacity: '1',
                    });
                },
                function () {
                    header.css({
                        background: '#fff',
                        color: '#fff',
                        transition: '0.1s',
                        transform: 'translateY(-28px)',
                    });
                },

                function () {
                    header.css({
                        transform: 'translateY(-28px)',
                        background: 'rgba(255, 255, 255, 1)',
                    });
                },
            );
            window.onmousewheel = function (e) {
                if ($(window).width() < 744) {
                    if (e.wheelDelta > 0) {
                        scrollDownHeaderMob();
                    } else {
                        scrollUpHeaderMob();
                    }
                }
            };
        });
    }
}

responsiveHeaderLayout(
    $('header .bottomHeader')[0].offsetTop +
    $('header .bottomHeader')[0].offsetHeight,
);
insertScrollEvent();
$(window).resize(() => {
    responsiveHeaderLayout(
        $('header .bottomHeader')[0].offsetTop +
        $('header .bottomHeader')[0].offsetHeight,
    );
    insertScrollEvent();
});

$(function () {
    $('li>a, li>h1>a, li>p>a, li.lnbMenu>.textWrap>a').each(function (i, anchor) {
        let $a = $(this);
        let loc = $a.attr('href');

        if (loc && loc.length ) {
            $a.closest('li').click(function (e) {
                if($a.parent('li').hasClass('fnbMenu')){

                }else{
                    e.preventDefault();
                    e.stopPropagation();
                    if ($a.attr('target') == '_blank') {
                        window.open(loc);
                    } else {
                        window.location.href = loc;
                    }
                }

            });
        }
    });
    $('h2.twodepthName>a').each(function (i, anchor) {
        let $a = $(this);
        let loc = $a.attr('href');
        if (loc && loc.length) {
            $a.parent().click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($a.attr('target') == '_blank') {
                    window.open(loc);
                } else {
                    window.location.href = loc;
                }
            });
        }
    });
    $('.siteMapView ul.siteMenu .list a').each(function (i, anchor) {
        let $a = $(this);
        let loc = $a.attr('href');
        if (loc && loc.length) {
            $a.parent().click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                if ($a.attr('target') == '_blank') {
                    window.open(loc);
                } else {
                    window.location.href = loc;
                }
            });
        }
    });
});
$('footer #familySite').click(function(event){
    event.stopPropagation()
})
$(document).click(function() {
    // console.log( $('footer #familySite').prop('checked'))
    if( $('footer #familySite').prop('checked') == true){
        $('footer #familySite').prop('checked', false);
    }
});

$('footer .familySiteItem').css({padding: '16px 12px',
        cursor: 'pointer',
        display: '-webkit-box',
        display: '-ms-flexbox',
        display: 'flex',
   ' -webkit-box-align': 'center',
'-ms-flex-align': 'center',
alignItems: 'center',
fontSize: '14px',
fontWeight: '400',
fontFamily: "'Noto Sans KR', sans-serif",
lineHeight: '30px',
letterSpacing: '-0.025rem',})

$('footer .familySiteItem span').css({display: '-webkit-box',
        display: "-ms-flexbox",
        display: 'flex',
    '-webkit-box-align': 'center',
'-ms-flex-align': 'center',
alignItems: 'center',
fontSize: '15px',
fontWeight: '400',
fontFamily: "'Noto Sans KR', sans-serif",
lineHeight: '30px',
letterSpacing: '-0.025rem',
height: '14px',})

$('footer .fnbMenu').hover(function(e){
    if($(window).width() < 744){
        // $(this).children('.textWrap').children('.familySite > span').css({color:'#333',cursor: 'unset'})
        $(this).css({color:'#333',cursor: 'unset'})
    }else{
        // $(this).children('.textWrap').children('.familySite > span').css({color:'#F9BB00',cursor: 'pointer'})
        $(this).css({color:'#F9BB00',cursor: 'pointer'})
    }
    // $('footer .fnbMenu').css({color:'#F9BB00'})

},function(){
    if($(window).width() < 744){
        // $(this).children('.textWrap').children('.familySite > span').css({color:'#333',cursor: 'unset'})
        $(this).css({color:'#333',cursor: 'unset'})
    }else{
        // $(this).children('.textWrap').children('.familySite > span').css({color:'#333',cursor: 'pointer'})
        $(this).css({color:'#333',cursor: 'pointer'})
    }
})

$('footer .famMenu').hover(function(e){
    if($(window).width() < 744){
        console.log(
            $(this).children('.textWrap').children('label ').children('span').css({color:'#333',cursor: 'unset'})
        )
        $(this).children('.textWrap').children('label > span').css({color:'#333',cursor: 'unset'})
        $(this).children('.textWrap').children('label ').children('span').children('.icon').css({color:'#333',cursor: 'unset'})
        // $(this).css({color:'#333',cursor: 'unset'})
    }else{
        $(this).children('.textWrap').children('label > span').css({color:'#F9BB00',cursor: 'pointer'})
        $(this).children('.textWrap').children('label ').children('span').children('.icon').css({color:'#F9BB00',cursor: 'pointer'})
        // $(this).css({color:'#F9BB00',cursor: 'pointer'})
    }
    // $('footer .fnbMenu').css({color:'#F9BB00'})

},function(){
    if($(window).width() < 744){
        console.log(
            $(this).children('.textWrap').children('label ').children('span').css({color:'#333',cursor: 'unset'})
        )
        $(this).children('.textWrap').children('label ').children('span').css({color:'#333',cursor: 'unset'})
        $(this).children('.textWrap').children('label ').children('span').children('.icon').css({color:'#333',cursor: 'unset'})
        // $(this).css({color:'#333',cursor: 'unset'})
    }else{
        $(this).children('.textWrap').children('label').children('span').css({color:'#333',cursor: 'pointer'})
        $(this).children('.textWrap').children('label ').children('span').children('.icon').css({color:'#333',cursor: 'pointer'})
        // $(this).css({color:'#333',cursor: 'pointer'})
    }
})
setTimeout(()=>{
    if ($(window).width() < 744) {
        console.log($('.tabContent'))
        let scrollLeftPos = 0;
        if ($('.tabContent .tabBtn .active').offset() && $('.tabContent .tabBtn .active').offset().left) {
            scrollLeftPos = $('.tabContent .tabBtn .active').offset().left - 24
        }
        if ($('.tabContent').length > 0){
            $('.tabContent .tabBtn').animate({
                scrollLeft: scrollLeftPos,
            },300,);
        } else {
            $('.tabContent0 .tabBtn').animate({
                scrollLeft: scrollLeftPos,
            },300,);
        }


    }

},300)






