
		$(function(){
			//배율에 따른 스케일 조절
			function scale(){
				var value = window.devicePixelRatio;
				var $body = $('body');

				if (window.matchMedia("(resolution: 1.25dppx)").matches || window.matchMedia("(resolution: 1.5dppx)").matches) {
					$body.addClass('scale');
				} else{
					$body.removeClass('scale');
				}
			}
			scale();

			$(window).on('resize',function(){
				scale();
			});

			//aos
			AOS.init({
				duration: $aos_duration,
				once: true,
			});

			//메인비쥬얼 영역 모션
			setTimeout(function(){
				$('.main_visual .video').addClass('on');
				$('.main_visual .tit_slide').addClass('on');
				$('.main_visual .msg_hidden').addClass('on');
			},800);

			//메인비쥬얼 슬라이드 [s]
			var mainSwiper;
			var mainSwiper2;

			const bannerLIst = [{"bannerTitle": "좋은 재료가 만드는 오늘의 따뜻한 한 끼"}, {"bannerTitle": "매일 먹고 싶은 맛, 온담의 정성으로"}, {"bannerTitle": "바쁜 하루에도 든든함은 그대로"}, {"bannerTitle": "함께 먹는 즐거움, 온담에 담았습니다"}, {"bannerTitle": "신선함을 고르고 맛있는 일상을 만듭니다"}, {"bannerTitle": "작은 재료 하나까지 바르게 생각합니다"}, {"bannerTitle": "당신의 식탁 가까이, 언제나 온담식품"}];
var bullet = [];
			for (let index = 0; index < bannerLIst.length; index++) {
				bullet[index] = bannerLIst[index].bannerTitle;
			}
			function initMainSwiper() {
				if (mainSwiper) {mainSwiper.destroy();}
				if (mainSwiper2) {mainSwiper2.destroy();}

				var swiperOptions = {
					navigation: {
						nextEl: '.main_visual .swiper-button-next',
						prevEl: '.main_visual .swiper-button-prev',
					},
					a11y: {
						prevSlideMessage: '이전 슬라이드',
						nextSlideMessage: '다음 슬라이드',
						slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
					},
					autoplay: {
						delay: 3000,
						disableOnInteraction: false
					},
					speed: 1000,
					loop: true,
					pagination: {
						el: '.main_visual .swiper-pagination',
						type: 'fraction',
						clickable: true,
						renderFraction: function (currentClass, totalClass) {
							return '<span class="' + currentClass + '"></span><span> / </span><span class="' + totalClass + '"></span>';
						},
					},
					breakpoints: {
						//1023 이상
						1023: {
							pagination : {
								formatFractionCurrent: function (number) {
									return ('0' + number).slice(-2);
								},
								formatFractionTotal: function (number) {
									return ('0' + number).slice(-2);
								},
								renderFraction: function (currentClass, totalClass) {
									return '<span class="' + currentClass + '"></span>' +
										'<span class="' + totalClass + '"></span>';
								}
							}
						}
					},
					on: {
						init: function () {
							$('.main_visual .swiper-slide').attr('aria-hidden','true');
							$('.main_visual .swiper-slide.swiper-slide-active').attr('aria-hidden','false');
							$('.main_visual .swiper-slide.swiper-slide-active').find("a").attr("tabIndex","0");
						},
						slideChange: function() {
							var index = this.activeIndex;
							$('.main_visual .swiper-slide').attr('aria-hidden','true');
							$('.main_visual .swiper-slide:eq('+index+')').attr('aria-hidden','false');
							$('.main_visual .swiper-slide').find("a").attr("tabIndex","-1");
							$('.main_visual .swiper-slide:eq('+index+')').find("a").attr("tabIndex","0");

							if ($(".main_visual .swiper-slide:eq(" + index + ")").find("video").hasClass("video")){
								vid = $(".main_visual .swiper-slide:eq(" + index + ")").find("video").attr("id", "myVideo" + index);
								let vidValue = vid.attr("id");
								let vidValue2 = document.getElementById(vidValue);
								let cntSlide = $(".main_visual .swiper-slide");
								let indexPlus = index + 1;
								let pauseBtn = $(".btn_wrap").find("button")[0];

								if (pauseBtn.style.display === "none") {
									vidValue2.pause();
								} else {
									vidValue2.play();
								}

								vidValue2.onloadedmetadata = function () {
									$(cntSlide)[index].dataset.swiperAutoplay =
										Math.floor(vidValue2.duration) + "000";
								};
								if (index > 1) {
									$(cntSlide)[index].dataset.swiperAutoplay =
										Math.floor(vidValue2.duration) + "000";
								}
							}
						}
					},
				};

				mainSwiper = new Swiper('.main_visual .swiper-container', swiperOptions);
				mainSwiper2 = new Swiper('.main_visual .swiper-container', {
					a11y: {
						prevSlideMessage: '이전 슬라이드',
						nextSlideMessage: '다음 슬라이드',
						slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
					},
					loop: true,
					pagination: {
						el: '.main_visual .swiper-pagination2',
						type : "bullets",
						clickable: true,
						renderBullet: function (index, className) {
							// return '<span class="' + className + '">' + '<em>'+ bullet[index]+'</em>' + '<i></i>' + '<b></b>'  + '</span>';
							return '<span class="' + className + '">' + '<i></i>' + '<b></b>'  + '</span>';
						},
					},
					breakpoints: {
						//1023 이상
						1023: {
							pagination : {
								type : "progressbar",
							}
						}
					},
				});

				mainSwiper.controller.control = mainSwiper2;
				mainSwiper2.controller.control = mainSwiper;
			}

			initMainSwiper();

			//리사이즈 이벤트 처리
			$(window).on('resize', function() {
				initMainSwiper();
				//정지버튼 클릭후 resize되었을때 정지버튼 노출
				playButton2.hide();
				pauseButton2.show();
			});

			//슬라이드 포커스되었을때 자동재생 정지
			function pauseAutoplay2() {mainSwiper.autoplay.stop();}
			function resumeAutoplay2() {mainSwiper.autoplay.start();}
			var slides2 = document.querySelectorAll('.main_visual .swiper-slide a');
			var pauseButton2 = $('.main_visual .swiper-button-pause');
			var playButton2 = $('.main_visual .swiper-button-play');
			var isPausedByButton2 = false;

			slides2.forEach(function (slide) {
				//탭 키로 슬라이드에 포커스되었을 때 이벤트 처리
				slide.addEventListener('focus', function () {
					if (!isPausedByButton2) {
						pauseAutoplay2();
					}
				});

				//포커스가 해제되면 다시 자동 재생 시작
				slide.addEventListener('blur', function () {
					if (!isPausedByButton2) {
						resumeAutoplay2();
					}
				});
			});

			pauseButton2.on('click', function () {
				pauseAutoplay2();
				isPausedByButton2 = true;
				pauseButton2.hide();
				playButton2.show().focus();
			});

			playButton2.on('click', function () {
				resumeAutoplay2();
				isPausedByButton2 = false;
				playButton2.hide();
				pauseButton2.show().focus();
			});
			//메인비쥬얼 슬라이드 [e]

			//플로팅 팝업 [s]
			//button 클릭시
			$('.fixed_floating .btn_open').on('click',function(){
				if($('.fixed_floating').hasClass('open')){
					$('.fixed_floating').removeClass('open')
				}else{
					$('.fixed_floating').addClass('open');
					$('.fixed_floating .btn_open').attr('tabindex','-1');
					$('.fixed_floating .btn_close').focus();
					$('.fixed_floating .img_wrap a, .fixed_floating .img_wrap button').attr('tabindex','0');
				}
			});
			$('.fixed_floating .btn_close').on('click',function(){
				$('.fixed_floating').removeClass('open');
				$('.fixed_floating .btn_open').attr('tabindex','0').focus();
				$('.fixed_floating .img_wrap a, .fixed_floating .img_wrap button').attr('tabindex','-1');
			});
			// 키보드 Enter 또는 Spacebar 클릭 시
			$('.fixed_floating .btn_close').on("keydown", function(e) {
				if (e.key === "Enter") {
					$('.fixed_floating .btn_open').attr('tabindex','0').focus();
					$('.fixed_floating .img_wrap a, .fixed_floating .img_wrap button').attr('tabindex','-1');
				}
			});

			$('.fixed_floating .btn_open').on("keydown", function(e) {
				if (e.key === "Enter") {
					e.preventDefault();
					$('.fixed_floating .btn_open').attr('tabindex','-1');
					$('.fixed_floating').addClass('open');
					$('.fixed_floating .btn_close').focus();
					$('.fixed_floating .img_wrap a, .fixed_floating .img_wrap button').attr('tabindex','0');
				}

			});

			//푸터에 닿는시점에 팝업과 푸터 겹치지않도록
			$(window).on('scroll', function() {
				var windowHeight = $(window).height();
				var footerTop = $('.footer').offset().top;
				var fixedFloating = $('.fixed_floating');

				if(windowHeight + $(window).scrollTop() >= footerTop) {
					fixedFloating.addClass('reach_end');
				}else{
					fixedFloating.removeClass('reach_end');
				}
			});
			//플로팅 팝업 [e]

			//글로벌 오뚜기 랜덤모션 [s]
			var ui = {
				init: function(){
					ui.main.mainGlobalBanner.init();
				},
				main:{
					mainGlobalBanner : {
						init:function(){
							this.tg = $('ul.show_wrap li');
							ui.main.mainGlobalBanner.scrollAnimation();
							setTimeout(() => {
								ui.main.mainGlobalBanner.AnimationActive(this.tg);
							}, 100);
						},
						scrollAnimation: function(){
							var contentVisible = false;

							$(window).on('scroll',function(){
								var contentTop = $('.global_ottogi .inner').offset().top;
								var windowTop = $(window).scrollTop() + 500;

								if(windowTop >= contentTop && !contentVisible){
									contentVisible = true;
									$('.global_ottogi .content').addClass('on');
									ui.main.mainGlobalBanner.showSequentially($('.global_ottogi .content.on li'), 1000);
								}
							});
						},
						RandomDelay:function(maxDelay){
							return Math.random() * maxDelay;
						},
						showSequentially: function(listItems, maxDelay) {
							var totalItems = listItems.length;
							listItems.each(function(index) {
								var $this = $(this);
								setTimeout(function() {
									if ($('.global_ottogi .content').hasClass('on')) {
										$this.addClass('active');
									}
								}, ui.main.mainGlobalBanner.RandomDelay(maxDelay) + 200);

							});

							setInterval(function() {
								if (listItems.find('.fade').hasClass('active')) {
									listItems.closest('ul').find('.group1 .fade').removeClass('active');
									setTimeout(function() {
										listItems.closest('ul').find('.group2 .fade').removeClass('active');
									}, 2000);

								} else {
									listItems.closest('ul').find('.group1 .fade').addClass('active');
									setTimeout(function() {
										listItems.closest('ul').find('.group2 .fade').addClass('active');
									}, 2000);
								}
							}, 4000);

						},
						AnimationActive: function(obj) {
							if ($('.global_ottogi .content').hasClass('on')) {
								const listItems = obj;
								ui.main.mainGlobalBanner.showSequentially(listItems, 1000);
							}
						}
					},
				}
			}

			ui.init();
			//글로벌 오뚜기 랜덤모션 [e]

			//오뚜기 브랜드스토리 무한루프 텍스트
			$('.txt_marquee').marquee({
				speed: 18000,
				gap: 0,
				delayBeforeStart: 0,
				direction: 'left',
				duplicated: true,
				// pauseOnHover: true
			});

			//오뚜기 제품 배경화면 모션
			$(window).on('scroll',function(){
				$wt = $(window).scrollTop();
				$pot = $('.ottogi_prd').offset().top - 500;
				if($wt >= $pot){
					$('.bg_con').addClass('on');
				}
			})

			//오뚜기 제품 슬라이드 [s]
			var prdSwiper = new Swiper(".ottogi_prd .swiper-container", {
				pagination: {
					el: ".ottogi_prd .swiper-pagination",
					type: "fraction"
				},
				navigation: {
					nextEl: '.ottogi_prd .swiper-button-next',
					prevEl: '.ottogi_prd .swiper-button-prev',
				},
				a11y: {
					prevSlideMessage: '이전 슬라이드',
					nextSlideMessage: '다음 슬라이드',
					slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',

				},
				autoplay:{
					delay: 2000,
					disableOnInteraction: false
				},
				effect : 'fade',
				fadeEffect: {
					crossFade: true
				},
				speed: 800,
				loop :true,
				spaceBetween: 0,
				observer: true,
				observeParents: true,
				on: {
					init: function () {
						$('.ottogi_prd .swiper-slide').attr('aria-hidden','true');
						$('.ottogi_prd .swiper-slide.swiper-slide-active').attr('aria-hidden','false');
						$('.ottogi_prd .swiper-slide.swiper-slide-active').find("a").attr("tabIndex","0");
					},
					slideChange: function() {
						var index = this.activeIndex;
						$('.ottogi_prd .swiper-slide').attr('aria-hidden','true');
						$('.ottogi_prd .swiper-slide:eq('+index+')').attr('aria-hidden','false');
						$('.ottogi_prd .swiper-slide').find("a").attr("tabIndex","-1");
						$('.ottogi_prd .swiper-slide:eq('+index+')').find("a").attr("tabIndex","0");
					}
				},
			});

			//슬라이드 포커스되었을때 자동재생 정지
			function pauseAutoplay() {prdSwiper.autoplay.stop();}
			function resumeAutoplay() {prdSwiper.autoplay.start();}
			var slides = document.querySelectorAll('.ottogi_prd .swiper-slide, .ottogi_prd .swiper-slide a');
			var pauseButton = $('.ottogi_prd .swiper-button-pause');
			var playButton = $('.ottogi_prd .swiper-button-play');
			var isPausedByButton = false;

			slides.forEach(function (slide) {
				//탭 키로 슬라이드에 포커스되었을 때 이벤트 처리
				slide.addEventListener('focus', function () {
					if (!isPausedByButton) {
						pauseAutoplay();
					}
				});

				//포커스가 해제되면 다시 자동 재생 시작
				slide.addEventListener('blur', function () {
					if (!isPausedByButton) {
						resumeAutoplay();
					}
				});
			});

			pauseButton.on('click', function () {
				pauseAutoplay();
				isPausedByButton = true;
				pauseButton.hide();
				playButton.show().focus();
			});

			playButton.on('click', function () {
				resumeAutoplay();
				isPausedByButton = false;
				playButton.hide();
				pauseButton.show().focus();
			});
			//오뚜기 제품 슬라이드 [e]

			//오뚜기 뉴스룸 슬라이드 [s]
			var $ww = $(window).outerWidth();
			var newsSwiper = undefined;
			function initSwiper() {
				if($ww <= 1023 && newsSwiper == undefined){
					newsSwiper = new Swiper(".ottogi_news .swiper-container", {
						speed: 600,
						slidesPerView: 1.15,
						spaceBetween: 15,
						observer: true,
						observeParents: true,
					});
				}else if($ww > 1023 && newsSwiper != undefined){
					newsSwiper.destroy();
					newsSwiper = undefined;
				}
			}
			initSwiper();
			$(window).on('resize', function () {
				$ww = $(window).outerWidth();
				initSwiper();
			});
			//오뚜기 뉴스룸 슬라이드 [e]

			//오키친 레시피 슬라이드 [s]
			var $ww = $(window).outerWidth();
			var okitchenSwiper = undefined;
			function initSwiper2() {
				if($ww <= 1023 && okitchenSwiper == undefined){
					okitchenSwiper = new Swiper(".okitchen_recipe .swiper-container", {
						speed: 600,
						slidesPerView: 1.15,
						spaceBetween: 15,
						observer: true,
						observeParents: true,
					});
				}else if($ww > 1023 && okitchenSwiper != undefined){
					okitchenSwiper.destroy();
					okitchenSwiper = undefined;
				}
			}
			initSwiper2();
			$(window).on('resize', function () {
				$ww = $(window).outerWidth();
				initSwiper2();
			});
			//오키친 레시피 슬라이드 [e]

			//오뚜기 SNS 슬라이드 [s]
			function initSwiper4(slideClass) {
				if ($ww <= 1023) {
					if (window[slideClass] === undefined) {
						window[slideClass] = new Swiper(`.ottogi_sns ${slideClass}`, {
							speed: 600,
							slidesPerView: 1.15,
							spaceBetween: 15,
							observer: true,
							observeParents: true,
						});
					}
				}else {
					if (window[slideClass] !== undefined) {
						window[slideClass].destroy();
						window[slideClass] = undefined;
					}
				}
			}
			function snsInitSwiper(slideClass) {
				initSwiper4(slideClass);
			}

			//초기화
			var $ww = $(window).outerWidth();
			snsInitSwiper(".slide1");
			snsInitSwiper(".slide2");
			snsInitSwiper(".slide3");

			//윈도우 크기 변경 이벤트 처리
			$(window).on('resize', function () {
				$ww = $(window).outerWidth();
				snsInitSwiper(".slide1");
				snsInitSwiper(".slide2");
				snsInitSwiper(".slide3");
			});
			//오뚜기 SNS 슬라이드 [e]

			//mobile일때 esg 경영 슬라이드 [s]
			var ww = $(window).outerWidth();
			var esgSwiper = undefined;
			function initSwiper3() {
				if(ww <= 1023 && esgSwiper == undefined){
					esgSwiper = new Swiper(".esg_manage .swiper-container", {
						speed: 800,
						slidesPerView: 1.12,
						spaceBetween: 30,
						observer: true,
						observeParents: true,
					});
				}else if(ww > 1023 && esgSwiper != undefined){
					esgSwiper.destroy();
					esgSwiper = undefined;
				}
			}
			initSwiper3();
			$(window).on('resize', function () {
				ww = $(window).outerWidth();
				initSwiper3();
			});
			//mobile일때 esg 경영 슬라이드 [e]

			//pc일때 esg 경영 마우스이벤트 [s]
			var currentVisual = 0;
			var siVisual = null;
			function openVisual(vid, spd, easeFunc) {
				$('.esg_manage .swiper-slide').each(function(idx) {
					if (idx === vid) {
						gsap.to( $(this), {duration: spd, width: '47.34%', ease: easeFunc} );
						$('.esg_manage .swiper-slide').eq(currentVisual).siblings('.swiper-slide').removeClass('active');
						$('.esg_manage .swiper-slide').eq(currentVisual).addClass('active');
					}else {
						gsap.to( $(this), {duration: spd, width: '24.52%', ease: easeFunc} );
					}
				});
			}

			$('.esg_manage .swiper-slide').on('mouseenter',function(){
				clearInterval(siVisual);
				if (currentVisual != $(this).index() && $ww > 1023) {
					currentVisual = $(this).index();
					openVisual(currentVisual, 1, 'expo');
				}
			});

			$('.esg_manage .swiper-slide').on('focusin',function(){
				clearInterval(siVisual);
				if (currentVisual != $(this).index() && $ww > 1023) {
					currentVisual = $(this).index();
					openVisual(currentVisual, 1, 'expo');
				}
			});
			//pc일때 esg 경영 마우스이벤트 [e]
			boardList();
		})

		function boardList(category) {
			category = category || 3;
			getList(category)
			ui.common.popupFn.searchClose('search_area_mb');
		};


// Static social data keeps the tabs and Swiper interaction independent of a server.
function getList(category){
 const target=category===4?'board_list2':category===5?'board_list3':'board_list';
 const root=document.getElementById(target); if(!root)return;
 root.innerHTML=ONDAM_CONTENT.slice(category===4?6:0,category===4?12:6).map(item=>`<li class="swiper-slide"><a href="ondam-${item.id}.html"><p class="sns_id">ondam_daily</p><div class="img_box"><img src="${item.image}" alt="${item.title}"></div><div class="txt_box"><p class="tit">${item.title}</p></div></a></li>`).join('');
}
