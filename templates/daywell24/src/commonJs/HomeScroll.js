// const options = {rootMargin: '118px', threshold: 0, root: null};
// let snsSlider;
// const callback = (entries, observer) => {
//     entries.forEach((entry) => {
//         let result = 0;
//         if (entry.isIntersecting) {
//             console.log('화면에서 나타남');
//             entry.target.classList.add('active');
//             if (entry.target.classList[0] == 'buisnessSection') {
//                 document.getElementsByClassName(
//                     'yellowBackground',
//                 )[0].style.transform = ' translateX(0)';
//                 document.getElementsByClassName(
//                     'yellowBackground',
//                 )[0].style.opacity = 1;
//                 document.getElementsByClassName(
//                     'yellowBackground',
//                 )[0].style.borderRadius = '64px 0px 0px 192px';
//
//                 setTimeout(() => {
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[0].style.maxWidth = '100%';
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[0].style.transform = 'translateY(0%)';
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[0].style.opacity = '1';
//                 }, 100);
//                 setTimeout(() => {
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[1].style.maxWidth = '100%';
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[1].style.transform = 'translateY(0%)';
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[1].style.opacity = '1';
//                 }, 300);
//
//                 setTimeout(() => {
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[2].style.maxWidth = '100%';
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[2].style.transform = 'translateY(0%)';
//                     document.getElementsByClassName(
//                         'icon3dWrap',
//                     )[2].style.opacity = '1';
//                 }, 500);
//             } else if (entry.target.classList[0] == 'appServiceSection') {
//                 document.getElementsByClassName(
//                     'grayBackground',
//                 )[0].style.transform = ' translateX(0)';
//                 document.getElementsByClassName(
//                     'grayBackground',
//                 )[0].style.opacity = 1;
//             } else if (entry.target.classList[0] == 'mapServiceSection') {
//                 document.getElementsByClassName('pin')[0].style.width = '523px';
//                 document.getElementsByClassName('pin')[0].style.height =
//                     '420px';
//                 console.log(document.getElementsByClassName('pin'));
//                 document.getElementsByClassName('pin')[0].style.transform =
//                     'translateY(0%)';
//             } else if (entry.target.classList[0] == 'magazinSection') {
//                 ('translateY(0%)');
//                 setTimeout(() => {
//                     document.getElementsByClassName(
//                         'snsItem',
//                     )[0].style.opacity = '1';
//                     document.getElementsByClassName(
//                         'snsItem',
//                     )[0].style.transform = 'translateX(0%)';
//                 }, 100);
//                 setTimeout(() => {
//                     document.getElementsByClassName(
//                         'snsItem',
//                     )[1].style.opacity = '1';
//                     document.getElementsByClassName(
//                         'snsItem',
//                     )[1].style.transform = 'translateY(0%)';
//                 }, 300);
//                 setTimeout(() => {
//                     document.getElementsByClassName(
//                         'snsItem',
//                     )[2].style.opacity = '1';
//                     document.getElementsByClassName(
//                         'snsItem',
//                     )[2].style.transform = 'translateY(0%)';
//                 }, 500);
//                 setTimeout(() => {
//                     snsSlider = new Swiper('.snsItemSliderWrap', {
//                         loop: false,
//                         updateOnWindowResize: true,
//                         slidesPerView: 3,
//                         initialSlide: 1,
//                         slidesPerGroup: 1,
//                         // spaceBetween: 16,
//                         centeredSlides: true,
//                         autoplay: false,
//                         observer: true,
//                         observeParents: true,
//                         navigation: {
//                             nextEl: '.snsRightControler',
//                             prevEl: '.snsLeftControler',
//                         },
//                         breakpoints: {
//                             360: {
//                                 slidesPerView: 1,
//                                 slidesPerGroup: 1,
//                             },
//                             640: {
//                                 slidesPerView: 1,
//                                 slidesPerGroup: 1,
//                             },
//                             768: {
//                                 slidesPerView: 1,
//                                 slidesPerGroup: 1,
//                                 centeredSlides: true,
//                             },
//                             968: {
//                                 slidesPerView: 2,
//                                 slidesPerGroup: 1,
//                             },
//                             1040: {
//                                 slidesPerView: 3,
//                                 slidesPerGroup: 1,
//                             },
//                         },
//                         // autoplay: {
//                         //     delay: 2500,
//                         //     disableOnInteraction: false,
//                         // },
//                     });
//                 }, 500);
//             } else if (entry.target.classList[0] == 'emartHistorySection') {
//                 let offsetLeftHistory = $('.emartHistorySection').offset().left;
//                 // let offsetRightHistory =
//                 //     $('.emartHistorySection').offset().left +
//                 //     $('.emartHistorySection').outerWidth();
//                 var prevScrollTop = 0;
//                 var nowScrollTop = 0;
//                 let storeCount = $('.storeCount');
//                 let yearCount = $('.fixedYear');
//
//                 function wheelDelta(e) {
//                     return prevScrollTop - nowScrollTop > 0 ? 'up' : 'down';
//                 }
//                 $(window).scroll(function () {
//                     let bar = $('.storeCount').children('.bar');
//                     let count = $('.storeCount > .count > h1');
//
//                     let startHistoryOffset =
//                         $('header').outerHeight(true) +
//                         $('.mainBannerView').outerHeight(true) +
//                         $('.emartBiSection').outerHeight(true) +
//                         $('.emartSloganSection').outerHeight(true) +
//                         $('.emartHistorySection > .titleWrap').outerHeight(
//                             true,
//                         );
//                     let historyHeight = $('.emartHistorySection').outerHeight(
//                         true,
//                     );
//                     let storePersent =
//                         ((nowScrollTop +
//                             $(window).height() -
//                             startHistoryOffset) /
//                             historyHeight) *
//                         100;
//                     nowScrollTop = $(this).scrollTop();
//
//                     if (nowScrollTop >= startHistoryOffset) {
//                         yearCount.css({
//                             opacity: '1',
//                         });
//                         storeCount.css({
//                             opacity: '1',
//                             bottom: '48px',
//                             position: 'fixed',
//                             // left: offsetRightHistory - 170 + 'px',
//                         });
//                         if (wheelDelta() == 'down') {
//                             if (result >= 6000) {
//                                 result = 6000;
//                                 bar.css({height: '100%'});
//                             } else {
//                                 result = 6000 * (storePersent / 100) * 1.06;
//                                 bar.css({
//                                     height: parseInt(storePersent) - 30 + '%',
//                                 });
//                             }
//                         }
//                         if (wheelDelta() == 'up') {
//                             if (result <= 1) {
//                                 result = 0;
//                                 bar.css({height: '0%'});
//                             } else {
//                                 if (6000 * (storePersent / 100) >= 6000) {
//                                     result = 6000;
//                                 } else {
//                                     result = 6000 * (storePersent / 100);
//                                 }
//
//                                 bar.css({
//                                     height: parseInt(storePersent) - 30 + '%',
//                                 });
//                             }
//                         }
//                     } else {
//                         result = 0;
//                         bar.css({height: '0%'});
//                         yearCount.css({
//                             left: offsetLeftHistory + 'px',
//                             opacity: '0',
//                         });
//                         storeCount.css({opacity: '0', bottom: '10%'});
//                     }
//
//                     prevScrollTop = nowScrollTop;
//                     count.text(parseInt(result));
//                 });
//             }
//         } else {
//             console.log('화면에서 제외됨');
//             entry.target.classList.remove('active');
//             if (entry.target.classList[0] == 'buisnessSection') {
//                 document.getElementsByClassName(
//                     'yellowBackground',
//                 )[0].style.transform = ' translateX(10%)';
//                 document.getElementsByClassName(
//                     'yellowBackground',
//                 )[0].style.opacity = 0;
//                 document.getElementsByClassName(
//                     'yellowBackground',
//                 )[0].style.borderRadius = '512px 0px 0px 192px';
//                 document.getElementsByClassName(
//                     'icon3dWrap',
//                 )[0].style.maxWidth = '0px';
//                 document.getElementsByClassName(
//                     'icon3dWrap',
//                 )[1].style.maxWidth = '0px';
//                 document.getElementsByClassName(
//                     'icon3dWrap',
//                 )[2].style.maxWidth = '0px';
//
//                 document.getElementsByClassName('icon3dWrap')[0].style.opacity =
//                     '0';
//                 document.getElementsByClassName('icon3dWrap')[1].style.opacity =
//                     '0';
//                 document.getElementsByClassName('icon3dWrap')[2].style.opacity =
//                     '0';
//             } else if (entry.target.classList[0] == 'appServiceSection') {
//                 document.getElementsByClassName(
//                     'grayBackground',
//                 )[0].style.transform = ' translateX(-10%)';
//                 document.getElementsByClassName(
//                     'grayBackground',
//                 )[0].style.opacity = 1;
//             } else if (entry.target.classList[0] == 'mapServiceSection') {
//                 document.getElementsByClassName('pin')[0].style.width = '0px';
//                 document.getElementsByClassName('pin')[0].style.height = '0px';
//                 document.getElementsByClassName('pin')[0].style.transform =
//                     'translateY(130%)';
//                 // document.getElementsByClassName('pin').style.width =
//                 //     '300px';
//                 console.log(document.getElementsByClassName('pin'));
//             } else if (entry.target.classList[0] == 'magazinSection') {
//                 console.log(document.getElementsByClassName('snsItem'));
//                 snsSlider.destroy();
//                 snsSlider = undefined;
//                 document.getElementsByClassName('snsItem')[0].style.opacity =
//                     '0';
//                 document.getElementsByClassName('snsItem')[0].style.transform =
//                     'translateX(-60%)';
//
//                 document.getElementsByClassName('snsItem')[1].style.opacity =
//                     '0';
//                 document.getElementsByClassName('snsItem')[1].style.transform =
//                     'translateY(60%)';
//                 document.getElementsByClassName('snsItem')[2].style.opacity =
//                     '0';
//                 document.getElementsByClassName('snsItem')[2].style.transform =
//                     'translateY(-60%)';
//             } else if (entry.target.classList[0] == 'emartHistorySection') {
//                 result = 0;
//                 let storeCount = $('.storeCount');
//                 let yearCount = $('.fixedYear');
//                 storeCount.css({opacity: '0', bottom: '10%'});
//                 yearCount.css({
//                     opacity: '0',
//                 });
//             }
//         }
//     });
// };
// const observer = new IntersectionObserver(callback, options);
// const sectionList = document.querySelectorAll('section');
// sectionList.forEach((el) => observer.observe(el));


function observerPc() {
    const options = {rootMargin: '118px', threshold: 0, root: null};
    const callback = (entries, observer) => {
        entries.forEach((entry) => {
            let result = 0;
            if (entry.isIntersecting) {
                if ($(window).width() > 744) {
                    entry.target.classList.add('active');
                }

                if (entry.target.classList[0] == 'buisnessSection') {
                    document.getElementsByClassName(
                        'yellowBackground',
                    )[0].style.transform = ' translateX(0)';
                    document.getElementsByClassName(
                        'yellowBackground',
                    )[0].style.opacity = 1;
                    document.getElementsByClassName(
                        'yellowBackground',
                    )[0].style.borderRadius = '64px 0px 0px 192px';

                    setTimeout(() => {
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[0].style.maxWidth = '100%';
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[0].style.transform = 'translateY(0%)';
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[0].style.opacity = '1';
                    }, 100);
                    setTimeout(() => {
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[1].style.maxWidth = '100%';
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[1].style.transform = 'translateY(0%)';
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[1].style.opacity = '1';
                    }, 300);

                    setTimeout(() => {
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[2].style.maxWidth = '100%';
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[2].style.transform = 'translateY(0%)';
                        document.getElementsByClassName(
                            'icon3dWrap',
                        )[2].style.opacity = '1';
                    }, 500);
                } else if (entry.target.classList[0] == 'appServiceSection') {
                    document.getElementsByClassName(
                        'grayBackground',
                    )[0].style.transform = ' translateX(0)';
                    document.getElementsByClassName(
                        'grayBackground',
                    )[0].style.opacity = 1;
                } else if (entry.target.classList[0] == 'mapServiceSection') {
                    document.getElementsByClassName('pin')[0].style.width =
                        '523px';
                    document.getElementsByClassName('pin')[0].style.height =
                        '420px';
                    console.log(document.getElementsByClassName('pin'));
                    document.getElementsByClassName('pin')[0].style.transform =
                        'translateY(0%)';
                } else if (entry.target.classList[0] == 'magazinSection') {
                    // ('translateY(0%)');
                    setTimeout(() => {
                        document.getElementsByClassName(
                            'snsItem',
                        )[0].style.opacity = '1';
                        document.getElementsByClassName(
                            'snsItem',
                        )[0].style.transform = 'translateX(0%)';
                    }, 100);
                    setTimeout(() => {
                        document.getElementsByClassName(
                            'snsItem',
                        )[1].style.opacity = '1';
                        document.getElementsByClassName(
                            'snsItem',
                        )[1].style.transform = 'translateY(0%)';
                    }, 300);
                    setTimeout(() => {
                        document.getElementsByClassName(
                            'snsItem',
                        )[2].style.opacity = '1';
                        document.getElementsByClassName(
                            'snsItem',
                        )[2].style.transform = 'translateY(0%)';
                    }, 500);
                } else if (entry.target.classList[0] == 'emartHistorySection') {
                    let offsetLeftHistory = $('.emartHistorySection').offset()
                        .left;
                    // let offsetRightHistory =
                    //     $('.emartHistorySection').offset().left +
                    //     $('.emartHistorySection').outerWidth();
                    var prevScrollTop = 0;
                    var nowScrollTop = 0;
                    let storeCount = $('.storeCount');
                    let yearCount = $('.fixedYear');

                    function wheelDelta(e) {
                        return prevScrollTop - nowScrollTop > 0 ? 'up' : 'down';
                    }
                    $(window).scroll(function () {
                        let bar = $('.storeCount').children('.bar');
                        let count = $('.storeCount > .count > h1');

                        let startHistoryOffset =
                            $('header').outerHeight(true) +
                            $('.mainBannerView').outerHeight(true) +
                            $('.emartBiSection').outerHeight(true) +
                            $('.emartSloganSection').outerHeight(true) +
                            $('.emartHistorySection > .titleWrap').outerHeight(
                                true,
                            );
                        let historyHeight = $(
                            '.emartHistorySection',
                        ).outerHeight(true);
                        let storePersent =
                            ((nowScrollTop +
                                    $(window).height() -
                                    startHistoryOffset) /
                                historyHeight) *
                            100;
                        nowScrollTop = $(this).scrollTop();

                        if (nowScrollTop >= startHistoryOffset) {
                            yearCount.css({
                                opacity: '1',
                            });
                            storeCount.css({
                                opacity: '1',
                                bottom: '48px',
                                position: 'fixed',
                                // left: offsetRightHistory - 170 + 'px',
                            });
                            if (wheelDelta() == 'down') {
                                if (result >= 6000) {
                                    result = 6000;
                                    bar.css({height: '100%'});
                                } else {
                                    result = 6000 * (storePersent / 100) * 1.06;
                                    bar.css({
                                        height:
                                            parseInt(storePersent) - 30 + '%',
                                    });
                                }
                            }
                            if (wheelDelta() == 'up') {
                                if (result <= 1) {
                                    result = 0;
                                    bar.css({height: '0%'});
                                } else {
                                    if (6000 * (storePersent / 100) >= 6000) {
                                        result = 6000;
                                    } else {
                                        result = 6000 * (storePersent / 100);
                                    }

                                    bar.css({
                                        height:
                                            parseInt(storePersent) - 30 + '%',
                                    });
                                }
                            }
                        } else {
                            result = 0;
                            bar.css({height: '0%'});
                            yearCount.css({
                                left: offsetLeftHistory + 'px',
                                opacity: '0',
                            });
                            storeCount.css({opacity: '0', bottom: '10%'});
                        }

                        prevScrollTop = nowScrollTop;
                        count.text(parseInt(result));
                    });
                }
            } else {
                if ($(window).width() > 744) {
                    entry.target.classList.remove('active');
                }

                if (entry.target.classList[0] == 'buisnessSection') {
                    document.getElementsByClassName(
                        'yellowBackground',
                    )[0].style.transform = ' translateX(10%)';
                    document.getElementsByClassName(
                        'yellowBackground',
                    )[0].style.opacity = 0;
                    document.getElementsByClassName(
                        'yellowBackground',
                    )[0].style.borderRadius = '512px 0px 0px 192px';
                    document.getElementsByClassName(
                        'icon3dWrap',
                    )[0].style.maxWidth = '0px';
                    document.getElementsByClassName(
                        'icon3dWrap',
                    )[1].style.maxWidth = '0px';
                    document.getElementsByClassName(
                        'icon3dWrap',
                    )[2].style.maxWidth = '0px';

                    document.getElementsByClassName(
                        'icon3dWrap',
                    )[0].style.opacity = '0';
                    document.getElementsByClassName(
                        'icon3dWrap',
                    )[1].style.opacity = '0';
                    document.getElementsByClassName(
                        'icon3dWrap',
                    )[2].style.opacity = '0';
                } else if (entry.target.classList[0] == 'appServiceSection') {
                    document.getElementsByClassName(
                        'grayBackground',
                    )[0].style.transform = ' translateX(-10%)';
                    document.getElementsByClassName(
                        'grayBackground',
                    )[0].style.opacity = 1;
                } else if (entry.target.classList[0] == 'mapServiceSection') {
                    document.getElementsByClassName('pin')[0].style.width =
                        '0px';
                    document.getElementsByClassName('pin')[0].style.height =
                        '0px';
                    document.getElementsByClassName('pin')[0].style.transform =
                        'translateY(130%)';
                    // document.getElementsByClassName('pin').style.width =
                    //     '300px';
                } else if (entry.target.classList[0] == 'magazinSection') {
                    // snsSlider.destroy();
                    // snsSlider = undefined;
                    snsSlider.navigation.init();
                    document.getElementsByClassName(
                        'snsItem',
                    )[0].style.opacity = '0';
                    document.getElementsByClassName(
                        'snsItem',
                    )[0].style.transform = 'translateX(-60%)';
                    document.getElementsByClassName(
                        'snsItem',
                    )[1].style.opacity = '0';
                    document.getElementsByClassName(
                        'snsItem',
                    )[1].style.transform = 'translateY(60%)';
                    document.getElementsByClassName(
                        'snsItem',
                    )[2].style.opacity = '0';
                    document.getElementsByClassName(
                        'snsItem',
                    )[2].style.transform = 'translateY(-60%)';
                    snsSlider.navigation.init(1);
                } else if (entry.target.classList[0] == 'emartHistorySection') {
                    result = 0;
                    let storeCount = $('.storeCount');
                    let yearCount = $('.fixedYear');
                    storeCount.css({opacity: '0', bottom: '10%'});
                    yearCount.css({
                        opacity: '0',
                    });
                }
            }
        });
    };
    const observer = new IntersectionObserver(callback, options);
    const sectionList = document.querySelectorAll('section');

    sectionList.forEach((el) => observer.observe(el));
    let snsSlider =
        document.getElementsByClassName('snsItemSliderWrap').length !== 0
            ? new Swiper('.snsItemSliderWrap', {
                loop: false,
                parallax: true,
                slidesPerView: 3,
                initialSlide: 1,
                slidesPerGroup: 1,
                spaceBetween: 10,
                autoplay: false,
                observer: true,
                observeParents: true,
                centeredSlides: true,

                navigation: {
                    nextEl: '.snsRightControler',
                    prevEl: '.snsLeftControler',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        centeredSlides: true,
                        spaceBetween: 8,
                    },
                    744: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        centeredSlides: true,
                        spaceBetween: 8,
                    },
                    968: {
                        slidesPerView: 1.7,
                        slidesPerGroup: 1,
                        centeredSlides: true,
                    },
                    1040: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                    },
                },
                // autoplay: {
                //     delay: 2500,
                //     disableOnInteraction: false,
                // },
            })
            : null;
}
if ($(window).width() >= 744) {
    observerPc();
} else {
    if ($('section').hasClass('active')) {
    } else {
        $('section').addClass('active');
    }
    let yellowBg = document.getElementsByClassName('yellowBackground');
    if (yellowBg && yellowBg[0]) {
        yellowBg[0].style = yellowBg[0].style || {};
        yellowBg[0].style.transform = ' translateX(0)';
        yellowBg[0].style.opacity = 1.0;
        yellowBg[0].style.borderRadius = '64px 0px 0px 192px';
    }
    // document.getElementsByClassName('yellowBackground')?.[0].style.transform =
    //     ' translateX(0)';
    // document.getElementsByClassName('yellowBackground')?.[0]?.style?.opacity = 1;
    // document.getElementsByClassName('yellowBackground')?.[0]?.style?.borderRadius =
    //     '64px 0px 0px 192px';
}
$(window).resize(() => {
    if ($(window).width() >= 744) {
        observerPc();
    } else {
//        alert();
        if ($('section').hasClass('active')) {
        } else {
            $('section').addClass('active');
        }
    }
});

