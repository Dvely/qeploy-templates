$(document).ready(function () {
    $(".resourceWrap").hide();
    $(".logo").show();
});

$(".tabService .tabBtn li").on("click", function () {
    let $me = $(this),
        target = $me.attr("target");
    if (!$me.hasClass("on")) {
        $me.addClass("on");
        $me.siblings().removeClass("on");
        if (target == "logo") {
            $(".resourceWrap").hide();
            $(".logo").show();
        } else if (target == "color") {
            $(".resourceWrap").hide();
            $(".color").show();
        } else if (target == "notation") {
            $(".resourceWrap").hide();
            $(".notation").show();
        } else if (target == "telling") {
            $(".resourceWrap").hide();
            $(".telling").show();
        } else if (target == "graphicMotif") {
            $(".resourceWrap").hide();
            $(".graphicMotif").show();
        } else if (target == "persona") {
            $(".resourceWrap").hide();
            $(".persona").show();
        }else {
            $(".resourceWrap").hide();
        }
    }
});

var swiper = new Swiper(".usageSwiper", {
    effect: "fade",
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".usageSwiper.swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    allowTouchMove: false,
});

//로고 이미지 다운로드
$(".btnWrap button").on("click", () => {
    //일러스트레이터 파일
    location.href="downloads/daywell24-brand-guide.txt";
})