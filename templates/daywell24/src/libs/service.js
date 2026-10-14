const swiperConf = {
    spaceBetween: 0,
    loop: true,
    centeredSlides: false,touchRatio: 0,
    updateOnWindowResize: true,
}

$(function () {
    window.bannerCnt = window.bannerCnt || 0;
    if (bannerCnt > 0) {
        if (bannerCnt > 1) {
            swiperConf.autoplay = {
                delay: 2500,
                loop: true,
                disableOnInteraction: false,
            }
        }
        new Swiper('.swiper-container', swiperConf);
    }
    configBannerResize('.swiper-container');
})