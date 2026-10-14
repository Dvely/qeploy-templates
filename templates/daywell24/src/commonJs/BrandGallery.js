$(document).ready(function () {
    const itemsPerPage = 5;
    let visibleItemCount = itemsPerPage;

    function showItems(startIndex, endIndex) {
        $(".cardWrap").slice(startIndex, endIndex).show();
    }

    function showMoreItems() {
        const totalItems = $(".cardWrap").length;
        showItems(visibleItemCount, totalItems);
        visibleItemCount = totalItems;

        // 더 이상 표시할 항목이 없을 때 버튼을 숨깁니다.
        $(".more_btn").hide();
    }

    function initializeList() {
        showItems(0, visibleItemCount);

        // 초기에 모든 항목이 표시되어 있다면 더 보기 버튼을 숨깁니다.
        if ($(".cardWrap").length <= visibleItemCount) {
            $(".more_btn").hide();
        }
    }

    initializeList();

    $(".more_btn").on("click", showMoreItems);

    $(".cardModal").on("click", function (event) {
        // Check if the clicked element is the background (not .cardInfo)
        if ($(event.target).is(".cardModal")) {
            $(".cardModal").fadeOut(200);
            $(".galleryWrap .cardWrap").removeClass("active");
        }
    });
});

$(".tabService .tabBtn li").on("click", function () {
    let $me = $(this),
        target = $me.attr("target");
    if (!$me.hasClass("active")) {
        $me.addClass("active");
        $me.siblings().removeClass("active");
        if (target == "brand") {
            $(".cardWrap").hide();
            $(".brand").fadeIn();
            $(".more_btn").hide();
        } else if (target == "service") {
            $(".cardWrap").hide();
            $(".service").fadeIn();
            $(".more_btn").hide();
        } else if (target == "store") {
            $(".cardWrap").hide();
            $(".store").fadeIn();
            $(".more_btn").hide();
        } else {
            $(".cardWrap").hide();
            $(".cardWrap").fadeIn();
        }
    }
});

$(".galleryWrap .cardWrap").on("click", function (e) {
    $(".cardModal").fadeIn(200);
    // $("body, html").css("overflow", "hidden");
    $(this).addClass("active");

    let imgSrc = $(this).find(".imgWrap img").attr("src");
    let imgAlt = $(this).find(".imgWrap img").attr("alt");
    let titSrc = $(this).find(".tit img").attr("src");
    let titAlt = $(this).find(".tit img").attr("alt");
    $(".cardInfo .imgWrap img").attr({
        src: imgSrc,
        alt: imgAlt,
    });
    $(".cardInfo .info .tit img").attr({
        src: titSrc,
        alt: titAlt,
    });

    $(".cardInfo .info p").html(imgAlt);
});

$(".close").click(function () {
    $(".cardModal").fadeOut(200);
    $(".galleryWrap .cardWrap").removeClass("active");
});
