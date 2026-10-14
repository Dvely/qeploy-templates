let productSLider = null;
$(function () {
    // 쿠키 가져오기
    function getCookie(name) {
        var nameOfCookie = name + "=";
        var x = 0;
        while (x <= document.cookie.length) {
            var y = (x + nameOfCookie.length);

            if (document.cookie.substring(x, y) == nameOfCookie) {
                if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                    endOfCookie = document.cookie.length;
                return unescape(document.cookie.substring(y, endOfCookie));
            }

            x = document.cookie.indexOf(" ", x) + 1;

            if (x == 0) break;
        }

        return "";
    }

    // 24시간 기준 쿠키 설정하기
    // expiredays 후의 클릭한 시간까지 쿠키 설정
    // function setCookie24(name, value, expiredays) {
    //     var todayDate = new Date();
    //
    //     todayDate.setDate(todayDate.getDate() + expiredays);
    //
    //     document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
    // }

    // 00:00 시 기준 쿠키 설정하기 // expiredays 의 새벽 00:00:00 까지 쿠키 설정
    function setCookie00(name, value, expiredays) {
        var todayDate = new Date(); todayDate = new Date(parseInt(todayDate.getTime() / 86400000) * 86400000 + 54000000);

        if (todayDate > new Date()) {
            expiredays = expiredays - 1;
        }

        todayDate.setDate(todayDate.getDate() + expiredays);

        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
    }

    // 팝업을 숨기는 함수
    function hidePopup() {
        $("div[name='appDwlPop']").fadeOut(200);
        $('body').removeClass('dim');
    }

    // 페이지 로드 시 쿠키 확인
    if (getCookie("hideAppDwlPop") === "true") {
        $("div[name='appDwlPop']").hide(); // 페이지가 로드될 때 팝업을 숨김
        $('body').removeClass('dim');
    } else {
        $("div[name='appDwlPop']").show(); // 페이지가 로드될 때 팝업을 표시
        $('body').addClass('dim');
    }

    // '닫기' 버튼 클릭 시
    $(".btnPopUpClose").click(function() {
        hidePopup();
    });

    // '오늘 하루 보지 않기' 버튼 클릭 시
    $(".todayClose").click(function() {
        setCookie00("hideAppDwlPop", "true", 1); // 1일 동안 유지되는 쿠키
        hidePopup();
    });

    $('.popUpCloseBtn').on('click', function () {
        $('.eventPopUpWrap').removeClass('open');
    });
    productSLider = createProductSlider()

    if ($('.popUpSwiperCont .popUpSwiper .swiper-slide').length) {
        $('.eventPopUpWrap').addClass('open');
        $('.viewContentsWrap .close-popup').click(function () {
            $('.eventPopUpWrap').removeClass('open');
        })
        let eventPopSlider = new Swiper('.popUpSwiperCont', {
            loop: false,
            updateOnWindowResize: true,
            centeredSlides: false,
            speed: 300,
            observer: true,
            observeParents: true,
            autoplay: {
                delay: 2500, // 시간 설정
                disableOnInteraction: false, // false-스와이프 후 자동 재생
            },

            pagination: {
                // 호출(pager) 여부
                el: '.popUpPagenation', //버튼을 담을 태그 설정
                clickable: true, // 버튼 클릭 여부
                // type: 'progressbar',
            },
        });
        setTimeout(()=>{
            eventPopSlider.update()
        },400)
    }
    let mainSlider = new Swiper('.mainBannerView', {
        loop: true,
        slidesPerView: 1,
        updateOnWindowResize: true,
        centeredSlides: false,
        speed: 300,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 2500, // 시간 설정
            disableOnInteraction: false, // false-스와이프 후 자동 재생
        },
        navigation: {
            nextEl: '.nextBtn',
            prevEl: '.prevBtn',
        },
        pagination: {
            // 호출(pager) 여부
            el: '.mainBannerView .swiper-pagination', //버튼을 담을 태그 설정
            clickable: true, // 버튼 클릭 여부
            type: 'progressbar',
        },
        on: {
            slideChange: function () {
                $('.curNumChange').text(mainSlider.realIndex + 1);
                // console.log(mainSlider);
            },
        },
    });
    if (empty($('.totalChange').text() )) {
        $('.totalChange').text(1)
    }
    let only24Loop = $('.pbItemsWrap li.item').length > 4;
    if(!only24Loop) {
        $('.pbRightControler').hide()
        $('.pbLeftControler').hide()
    }
    let pbItemSlider = new Swiper('.pbItemsWrap', {
        loop: only24Loop,
        // updateOnWindowResize: true,
        slidesPerView: 4,
        spaceBetween: 16,
        // speed: 100,
        centeredSlides: false,
        observer: true,
        observeParents: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation:  {
            // 네비게이션
            nextEl: '.pbRightControler', // 오른쪽(다음) 화살표
            prevEl: '.pbLeftControler', // 왼쪽(이전) 화살표
        } ,
        breakpoints: {
            640: {
                slidesPerView: 1.5,
                slidesPerGroup: 1,
                centeredSlides: true,
            },
            744: {
                slidesPerView: 1.5,
                slidesPerGroup: 1,
                centeredSlides: true,
            },
            968: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                // centeredSlides: true,
            },
            1040: {
                slidesPerView: 3,
                slidesPerGroup: 1,
            },
        },
    });
    $('.mainSlider').hover(
        function () {
            mainSlider.autoplay.stop();
            $('.pauseAndPlayBtn > img').attr(
                'src',
                'assets/assets/imgs/sliderPlay.png',
            );
        },
        function () {
            if ($('.pauseAndPlayBtn').hasClass('play')) {
                $('.pauseAndPlayBtn > img').attr(
                    'src',
                    'assets/assets/imgs/sliderPlay.png',
                );
            } else {
                mainSlider.autoplay.start();
                // alert();
                $('.pauseAndPlayBtn').removeClass('play');
                $('.pauseAndPlayBtn > img').attr(
                    'src',
                    'assets/assets/imgs/sliderPause.png',
                );
            }
        },
    );
    $('.pauseAndPlayBtn').on('click', function () {
        if ($('.pauseAndPlayBtn').hasClass('play')) {
            mainSlider.autoplay.start();
            $('.pauseAndPlayBtn').removeClass('play');
            $('.pauseAndPlayBtn > img').attr(
                'src',
                'assets/assets/imgs/sliderPause.png',
            );
        } else {
            mainSlider.autoplay.stop();
            $('.pauseAndPlayBtn').addClass('play');
            $('.pauseAndPlayBtn > img').attr(
                'src',
                'assets/assets/imgs/sliderPlay.png',
            );
        }

        return false;
    });

    $('.categories li.category input').change(function () {
        let $input = $(this),
            id = $input.attr('id');

        // $('.eventItemSliderWrap .swiper-wrapper li').hide();
        if (id == 'itemOne') {
            redrawGoods("11");
        } else if (id == 'itemTwo') {
            redrawGoods("21");
        } else if (id == 'itemNew') {
            redrawGoods("new");
        }
    });

    $('input#storeFind').on("keyup",function(key){
        if(key.keyCode==13) {
            location.href = 'daywell24-stores.html?search=' + $('input#storeFind').val();
        }
    });
    $('.icoSearch').click(function () {
        location.href = 'daywell24-stores.html?search=' + $('input#storeFind').val();
    });

    configBannerResize('.mainBannerView');
    // let snsTm = null;
    // $(window).resize(function (e) {
    //     if (snsTm) {
    //         clearTimeout(snsTm);
    //     }
    //     snsTm = setTimeout(function () {
    //         $('.snsItemSliderWrap').get(0).swiper.update();
    //         console.log('updated...')
    //     }, 1000);
    // });
})

function createProductSlider() {
    let loop = false;
    if ($(".eventItemSliderWrap li.eventItem").length > 4) {
        loop = true;
    }
    let pSlider =  new Swiper('.eventItemSliderWrap', {
        loop: loop,
        updateOnWindowResize: true,
        slidesPerView: 4,
        spaceBetween: 12,
        centeredSlides: false,
        preventClicks: true,
        preventClicksPropagation: false,
        slidesPerGroup: 4,
        observer: true,
        observeParents: true,
        speed: 300,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            // 페이징 설정
            el: '.eventItemPagination',
            clickable: true, // 페이징을 클릭하면 해당 영역으로 이동, 필요시 지정해 줘야 기능 작동
        },
        breakpoints: {
            360: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 12,
            },
            640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 12,
            },
            744: {
                slidesPerView: 3,
                slidesPerGroup: 2,
                spaceBetween: 12,
            },

            968: {
                slidesPerView: 2,
                slidesPerGroup: 2,
            },
            1040: {
                slidesPerView: 3,
                slidesPerGroup: 3,
            },
        },
    });



    return pSlider;
}

function redrawGoods(type) {
    const $ul = $('.contentWrap ul.eventItemList');
    $ul.children().remove();


    loadGoods(type, function (goodsList) {
        each(goodsList || [], function (i, goods) {
            let $slide = drawGoodsSlide(goods, type);
            $slide.appendTo($ul);
        });
        productSLider.destroy();
        productSLider = createProductSlider();
    }, function () {})
}

function drawGoodsSlide(goods, type) {
    let subUrl = goods.KIND.toLowerCase();
    let url = "/goods/" + subUrl + "?category_seq=" + goods.CATEGORY_SEQ + '&POST_TOP=1';

    let $goods = $(`
<li class="eventItem swiper-slide ">
    <a href="${url}" class="eventItemImg">
        <div class="badgeWrap">
            <ul class="badges">
                <li class="badge new" style="opacity: 0">
                    <h3>NEW</h3>
                </li>
                <li class="badge onePlus" style="display: none;">
                    <h3>${goods.CATEGORY}</h3>
                </li>
            </ul>
        </div>
        <div class="itemSpImg">
            <img onerror="this.src='images/daywell24-placeholder.svg'"  src="${goods.image}" alt="${goods.TITLE}"/>
        </div>
    </a>
    <a href="${url}" class="eventItemDescription">
        <h2 class="name">${goods.TITLE}</h2>
        <h3 class="price">${goods.PRICE_REAL}원</h3>
    </a>
    
</li>
    `);

/*    if (new Date(goods.postStart).daydiff(new Date()) <= 14) {
        // $goods.find('.badge.new').show();
        $goods.find('.badge.new').css({opacity:1})
    }
    if (type != "new") {
        $goods.find('.badge.onePlus').show();
    } 신상품 new 뱃지 구버전*/

    if (type == "new") {
        // $goods.find('.badge.new').show();
        $goods.find('.badge.new').css({opacity:1})
    }
    if (type != "new") {
        $goods.find('.badge.onePlus').show();
    }

    // let subUrl = goods.KIND.toLowerCase();
    // let url = "/goods/" + subUrl + "?category_seq=" + goods.CATEGORY_SEQ;
    // $goods.click(function () {
    //     location.href = url;
    // })

    return $goods;
}

function loadGoods(type, success, failure) {
    let params = {};
    if (type == "11") {
        params.CATEGORY_SEQ = 1;
        params.POST_HOME=1;
    } else if (type == '21') {
        params.CATEGORY_SEQ = 2;
        params.POST_HOME=1;
    } else if (type == 'new'){
        params.LATEST = 1;
        params.POST_HOME=1;
    }
    $.ajax({
        url: "/api1/goods",
        type: "get",
        data: params,
        success: function(response) {
            success(response.data);
        },
        error: function(xhr) {
            failure();
        }
    });
}

$('.mainBannerControler .pause').hover(function(){
    // assets/assets/imgs/sliderPause.png
    if ($('.pauseAndPlayBtn').hasClass('play')) {
        $('.mainBannerControler .pause').attr('src', 'assets/assets/imgs/sliderPlayHover.png')
    } else {
        $('.mainBannerControler .pause').attr('src', 'assets/assets/imgs/sliderPauseHover.png')
    }
},function(){
    if ($('.pauseAndPlayBtn').hasClass('play')) {
        $('.mainBannerControler .pause').attr('src', 'assets/assets/imgs/sliderPlay.png')
    } else {
        $('.mainBannerControler .pause').attr('src', 'assets/assets/imgs/sliderPause.png')
    }

})

$('.mainBannerControler .left').hover(function(){
    // assets/assets/imgs/sliderPause.png
    $('.mainBannerControler .left').attr('src', 'assets/assets/imgs/sliderPrevHover.png')
},function(){$('.mainBannerControler .left').attr('src', 'assets/assets/imgs/sliderPrev.png')})

$('.mainBannerControler .right').hover(function(){
    // assets/assets/imgs/sliderPause.png
    $('.mainBannerControler .right').attr('src', 'assets/assets/imgs/sliderNextHover.png')
},function(){$('.mainBannerControler .right').attr('src', 'assets/assets/imgs/sliderNext.png')})


// 진행중인 이벤트
let mainBannerSwiper = null;
function mainSlide2() {
    if (mainBannerSwiper) return;

    mainBannerSwiper = new Swiper('.mainBannerSwiper', {
        // observer: true,
        // observeParents: true,
        updateOnWindowResize: true,
        slidesPerView: 1,
        loopAdditionalSlides:6,
        centeredSlides: true,
        loop: true,
        spaceBetween: 16,
        speed: 600,

        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        breakpoints: {
            768: {
                slidesPerView: 1,
                // centeredSlides: false,
                spaceBetween: 20
            }
        },

        pagination: {
            el: ".pointerBar",
            type: "progressbar",
        },

        on: {
            init() {
                const totalSlides = document.querySelectorAll('.mainBannerSwiper .swiper-slide:not(.swiper-slide-duplicate)').length;

                document.querySelector('.mainBannerWrap .totalSlide').textContent =
                    String(totalSlides).padStart(2, '0');

                document.querySelector('.mainBannerWrap .realSlide').textContent =
                    String(this.realIndex + 1).padStart(2, '0');

                // 초기화 후 중앙 정렬 강제 적용
                setTimeout(() => {
                    this.update();
                    if (window.innerWidth > 768) {
                        this.slideToLoop(this.realIndex, 0);
                    }
                }, 100);
            },

            // realIndex
            realIndexChange() {
                document.querySelector('.mainBannerWrap .realSlide').textContent =
                    String(this.realIndex + 1).padStart(2, '0');
            },

            imagesReady() {
                this.update();
                if (window.innerWidth > 768) {
                    this.slideToLoop(this.realIndex, 0);
                }
            }
        },
    });
}

// 진행중인 이벤트 슬라이드 컨트롤러
$('.playBtn').on('click', function () {
    if (!mainBannerSwiper) return;

    if ($(this).hasClass('paused')) {
        mainBannerSwiper.autoplay.start();
        $(this).removeClass('paused');
        $(this).find('.iconImg').attr('src', 'assets/assets/imgs/sliderPause.png');
    } else {
        mainBannerSwiper.autoplay.stop();
        $(this).addClass('paused');
        $(this).find('.iconImg').attr('src', 'assets/assets/imgs/sliderPlay.png');
    }
});

$('.prevBtn').on('click', () => mainBannerSwiper?.slidePrev());
$('.nextBtn').on('click', () => mainBannerSwiper?.slideNext());

// 이미지 로딩 완료 확인 함수
function waitForImages(selector, callback) {
    const images = document.querySelectorAll(selector + ' img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
        callback();
        return;
    }

    images.forEach((img) => {
        if (img.complete) {
            loadedCount++;
            if (loadedCount === totalImages) {
                callback();
            }
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    callback();
                }
            });
            img.addEventListener('error', () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    callback();
                }
            });
        }
    });
}

window.addEventListener('load', function () {
    // 이미지 로딩 완료 후 슬라이드 초기화
    waitForImages('.mainBannerSwiper', function() {
        setTimeout(() => {
            mainSlide2();
        }, 50);
    });
    mainSlide2();
});

// 리사이징 시 중앙 배너 중앙 정렬 유지
let resizeTimer = null;
window.addEventListener('resize', function () {
    if (!mainBannerSwiper) return;

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        mainBannerSwiper.update();

        if (window.innerWidth > 768) {
            mainBannerSwiper.slideToLoop(
                mainBannerSwiper.realIndex,
                0,
                false
            );
        }
    }, 200);
});
