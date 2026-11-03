/*
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // 기본 스크롤 위치 기억 끄기
}
*/

// Lenis
let lenis;
let lenisRafId; // requestAnimationFrame ID를 저장할 변수

function initLenis(scroll) {
    // Lenis 인스턴스를 이미 생성했는지 확인
    if (!lenis && window.innerWidth > 1240) {
        lenis = new Lenis({
            duration: 1.2,
            infinite: false,
            gestureOrientation: "vertical",
            normalizeWheel: false,
            smoothTouch: true
        });

        if(scroll != undefined) {
            console.log("init scroll");
            lenis.scrollTo(scroll, { immediate: true }); //
        }

        // Lenis의 스크롤 애니메이션 프레임을 관리
        function raf(time) {
            lenis.raf(time);
            lenisRafId = requestAnimationFrame(raf);
        }
        lenisRafId = requestAnimationFrame(raf); // 초기 requestAnimationFrame 설정
    }
}

function destroyLenis() {
    // Lenis 인스턴스가 있을 때만 제거
    if (lenis) {
        cancelAnimationFrame(lenisRafId); // requestAnimationFrame 중지
        lenis.destroy();
        lenis = null;
        lenisRafId = null; // ID 초기화
    }
}

// Lenis 활성화
function enableLenis(scroll) {
    if (!lenis) {
        console.log("en");
        initLenis(scroll);
    }
}

// Lenis 비활성화
function disableLenis() {
    if (lenis) {
        destroyLenis();
    }
}

// 초기 설정
initLenis();

// 리사이즈 시 Lenis 활성화/비활성화
window.addEventListener("resize", () => {
    if (window.innerWidth > 1240) {
        initLenis(); // PC 화면에서는 Lenis 초기화
    } else {
        destroyLenis(); // 모바일 화면에서는 Lenis 비활성화
    }
});


/*
// 새로고침 시 스크롤을 상단으로 강제 이동
window.addEventListener('load', () => {
    smoothScroll();
    header();

    if(lenis){
        setTimeout(() => {
            lenis.scrollTo(0, { immediate: true });
        }, 100);
    }
});
*/



function smoothScroll() {
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}


$(document).ready(function () {

    function setVhUnit() {
        // 현재 뷰포트 높이를 가져와 1% 단위로 변환
        const vh = window.innerHeight * 0.01;
        // CSS 변수 '--vh'를 업데이트
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // 초기 설정
    setVhUnit();

    // 뷰포트 크기 변경 시 업데이트 (예: 화면 회전, 창 크기 조정)
    window.addEventListener('resize', setVhUnit);


    $('.share-btn').click(function(event) {
        event.stopPropagation(); // 클릭 이벤트 전파 중지
        $('.share_area').toggleClass('on');
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.share_area').length && !$(event.target).closest('.share_btn').length) {
            $('.share_area').removeClass('on');
        }
    });


        const langWrap = $('.lang_wrap');

        // 동적으로 로드된 .lang_wrap 클릭 이벤트 위임
        $(document).on('click', '.lang_wrap', function(e) {
            e.stopPropagation(); // 이벤트 전파 중단

            $('.share_wrap.open').removeClass('open')
        });

        // 문서 내 다른 곳을 클릭하면 ul 닫기
        $(document).on('click', function() {
            if (langWrap.hasClass('open')) {
                langWrap.removeClass('open');
            }
        });

        const shareWrap = $('.share_wrap');

        // 동적으로 로드된 .lang_wrap 클릭 이벤트 위임
        $(document).on('click', '.share_wrap', function(e) {
            e.stopPropagation(); // 이벤트 전파 중단

            $('.lang_wrap.open').removeClass('open')
        });

        // 문서 내 다른 곳을 클릭하면 ul 닫기
        $(document).on('click', function() {
            if (shareWrap.hasClass('open')) {
                shareWrap.removeClass('open');
            }
        });

    // family_site 이벤트 처리
    const familySite = $('.family_site');

    // family_site 클릭 이벤트
    $(document).on('click', '.family_site', function(e) {
        e.stopPropagation(); // 이벤트 전파 중단
        $(this).toggleClass('open'); // 클릭된 .family_site의 open 클래스 토글
    });

    // 문서 내 다른 곳을 클릭하면 ul 닫기
    $(document).on('click', function() {
        if (familySite.hasClass('open')) {
            familySite.removeClass('open');
        }
    });

    $(".top_btn").click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 400);
        return false;
    });

    function handleScroll(event) {
        if (event.deltaY < 0) {
            // scrollTop 값이 0일 때 추가 작업 실행
            if (window.pageYOffset <= 200) {
                $('.fix_btn_box').removeClass('show');
            } else {
            }
        } else if (event.deltaY > 0) {
            $('.fix_btn_box').addClass('show');
            // 아래로 스크롤할 때 실행할 작업 추가
        }
    }
    window.addEventListener("wheel", handleScroll);

    //브라우저 스크롤 크기 감지
    var scrollingElement = document.scrollingElement;
    var scrollWidth = window.innerWidth - scrollingElement.clientWidth
    var root = document.querySelector(':root');
    let styles = getComputedStyle(root);
    styles.getPropertyValue('--scroll-width');
    root.style.setProperty('--scroll-width', scrollWidth+'px');


    function ScrollXArr() {
        // Check if top_tab exists
        if ($('.top_tab').length === 0) {
            return; // Exit the function if top_tab doesn't exist
        }


        // Add 'first' class to top_tab
        $('.top_tab').addClass('first');

        $('.top_tab .wrap').on('scroll', function () {
            var tabScroll = $(this).scrollLeft();
            var maxScroll = $(this)[0].scrollWidth - $(this).width();

            if (tabScroll >= maxScroll -1 ) {
                // Scrolled to the end
                $('.top_tab').addClass('last').removeClass('first');
            } else if (tabScroll === 0) {
                // Scrolled to the beginning
                $('.top_tab').addClass('first').removeClass('last');
            }
        });
    }
    ScrollXArr()



    function moveToSlide(slideIndex) {
        mySwiper.slideTo(slideIndex);
    }




    function beforeSlide(){
        //비교 슬라이더1
        const slider = document.getElementById('compare-slider');
        const before = document.getElementById('before-image');



        if (before){

            const beforeImage = before.getElementsByTagName('img')[0];
            const resizer = document.getElementById('resizer');

            let active = false;

            //Sort overflow out for Overlay Image
            document.addEventListener("DOMContentLoaded", function() {
                let width = slider.offsetWidth;
                // console.log(width);
                beforeImage.style.width = width + 'px';
            });

            //Adjust width of image on resize
            window.addEventListener('resize', function() {

                let width = slider.offsetWidth;
                // console.log(width);
                beforeImage.style.width = width + 'px';
            })

            resizer.addEventListener('mousedown',function(){
                active = true;
                resizer.classList.add('resize');

            });

            document.body.addEventListener('mouseup',function(){
                active = false;
                resizer.classList.remove('resize');
            });

            document.body.addEventListener('mouseleave', function() {
                active = false;
                resizer.classList.remove('resize');
            });

            document.body.addEventListener('mousemove',function(e){
                if (!active) return;
                let x = e.pageX;
                x -= slider.getBoundingClientRect().left;
                slideIt(x);
                pauseEvent(e);
            });

            resizer.addEventListener('touchstart',function(){
                active = true;
                resizer.classList.add('resize');
            });

            document.body.addEventListener('touchend',function(){
                active = false;
                resizer.classList.remove('resize');
            });

            document.body.addEventListener('touchcancel',function(){
                active = false;
                resizer.classList.remove('resize');
            });

            //calculation for dragging on touch devices
            document.body.addEventListener('touchmove',function(e){
                if (!active) return;
                let x;

                let i;
                for (i=0; i < e.changedTouches.length; i++) {
                    x = e.changedTouches[i].pageX;
                }

                x -= slider.getBoundingClientRect().left;
                slideIt(x);
                pauseEvent(e);
            });

            function slideIt(x){
                let transform = Math.max(0,(Math.min(x,slider.offsetWidth)));
                before.style.width = transform+"px";
                resizer.style.left = transform-0+"px";
            }

            //stop divs being selected.
            function pauseEvent(e){
                if(e.stopPropagation) e.stopPropagation();
                if(e.preventDefault) e.preventDefault();
                e.cancelBubble=true;
                e.returnValue=false;
                return false;
            }

        }

    }

    beforeSlide();



    var previousScroll;
    var windowScroll = window.pageYOffset || document.documentElement.scrollTop;
    var scrollPosition;


    $(".header").removeClass("down")

    scrollPosition = window.scrollY || window.pageYOffset;
    if (scrollPosition > 100) {
        $(".header").addClass("header_down")
    }else {
        $(".header").removeClass("header_down")
    }


    $(window).scroll(function () {

        scrollPosition = window.scrollY || window.pageYOffset;

        if (scrollPosition > 100) {
            $(".header").addClass("header_down")
        }else {
            $(".header").removeClass("header_down")
        }


        if ($(".nav").hasClass('on')){
            return
        }

        var currentScroll = $(this).scrollTop();
        if (currentScroll > previousScroll) {
            if (scrollPosition > 10) {
                $(".header").addClass("down")
                $("body").addClass("down")
            }
        } else {
            $(".header").removeClass("down")
            $("body").removeClass("down")
        }
        previousScroll = currentScroll;
    });

    $(window).scroll(function () {
    });

    $("select").niceSelect()

    $('.sub_nav button').on('click', function(){
        $('.sub_nav button').not($(this)).removeClass('open')
        $(this).toggleClass('open')
    })


    $(".modal").click(function (e){
        var target = e.target;
        if ($(target).hasClass("scroll_box") || $(target).hasClass("modal") ) {
            if ($('.modal').find('.confirmModal').length > 0) {
                modalClose('join');
            }else{
                modalClose();
            }
        }
    });
    $(".over_modal").click(function (e){
        var target = e.target;
        if ($(target).hasClass("scroll_box") || $(target).hasClass("over_modal") ) {
            overModalClose();
        }
    });
/*

//모달제어

$('.modal .close_btn').click(function(){
        modalClose();
    });
    function modalClose(){
        $('.modal').find('input[type=text]').val('');
        $('.modal').find('input[type=tel]').val('');

        $(".modal").removeClass("open");
        $('body').removeClass('scroll_none')
    }
*/
    //원 영역 그려지는 svg
    const ioSolution = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const $target = entry.target;
            if (entry.isIntersecting) {
                $target.classList.add("on");
            }
        });
    },{threshold: .2});

    const $itemsSolution = document.querySelectorAll(".sub_cont .cir_step_sect")
    $itemsSolution.forEach((item) => {
        ioSolution.observe(item);
    });

    //배너 애니메이션
    const ioBanner = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const $target = entry.target;
            if (entry.isIntersecting) {
                $target.classList.add("on");
            }
        });
    },{threshold: .2});

    const $itemsBanner = document.querySelectorAll(".sub_cont .online_banner")
    $itemsBanner.forEach((item) => {
        ioBanner.observe(item);
    });

    //good mind 원 애니메이션
    const ioMindCircle = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const $target = entry.target;
            if (entry.isIntersecting) {
                $target.classList.add("on");
            }
        });
    },{threshold: .2});

    const $itemsMindCircle = document.querySelectorAll(".sub_cont .mind_cir_sect")
    $itemsMindCircle.forEach((item) => {
        ioMindCircle.observe(item);
    });

    //그라데이션 배경 영역 텍스트 효과
    const ioGradient = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const $target = entry.target;
            if (entry.isIntersecting) {
                $target.classList.add("on");
            }
        });
    },{threshold: .2});

    const $itemsGradient = document.querySelectorAll(".sub_cont .gradient_sect")
    $itemsGradient.forEach((item) => {
        ioGradient.observe(item);
    });

    //mind 메인비주얼 이미지 효과
    const ioMindVisual = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const $target = entry.target;
            if (entry.isIntersecting) {
                $target.classList.add("on");
            }
        });
    },{threshold: .2});

    const $itemsMindVisual = document.querySelectorAll(".imgVisual .visual_sect")
    $itemsMindVisual.forEach((item) => {
        ioMindVisual.observe(item);
    });


    //진행과정 영역 효과
    if (window.innerWidth >= 768) {
        const ioProgress = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const $target = entry.target;
                if (entry.isIntersecting) {
                    $target.classList.add("on");
                }
            });
        }, { threshold: 0.2 });

        const $itemsProgress = document.querySelectorAll(".progress_sect")
        $itemsProgress.forEach((item) => {
            ioProgress.observe(item);
        });
    }


    //슬라이드 업 영역
    if (window.innerWidth >= 768) {
        const ioSlideUp = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const $target = entry.target;
                if (entry.isIntersecting) {
                    $target.classList.add("active");
                }
            });
        },{threshold: .2});

        const $itemsSlideUp = document.querySelectorAll(".slideUp_sect .cont_wrap .cont")
        $itemsSlideUp.forEach((item) => {
            ioSlideUp.observe(item);
        });
    }

});
