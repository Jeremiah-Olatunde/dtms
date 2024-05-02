(function($) {
    "use strict";
     $(document).on('ready', function() {	
		
		/*====================================
			Header Sticky JS
		======================================*/ 
		var activeSticky = $("#active-sticky"),
			winDow = $(window);
			winDow.on("scroll", function () {
				var scroll = $(window).scrollTop(),
				isSticky = activeSticky;
				if (scroll < 50) {
				isSticky.removeClass("is-sticky");
				} else {
				isSticky.addClass("is-sticky");
			}
		});
		
		/*====================================
			Select2 JS
		======================================*/ 
		$('select').select2();
		
		/*====================================
			CounterUp JS
		======================================*/ 
		$('.counter').counterUp({
			time: 1500,
		});
		
		
		/*====================================
			Aos Animate JS
		======================================*/	
		window.AOS.init({
			duration:1500,
			disable:!1,
			offset:0,
			once:!0,
			easing:"ease"
		});


		/*====================================
			Scrool To Top JS
		======================================*/
		var lastScrollTop = '';
		var scrollToTopBtn = '.scrollToTop'

		function stickyMenu($targetMenu, $toggleClass) {
			var st = $(window).scrollTop();
			if ($(window).scrollTop() > 600) {
				if (st > lastScrollTop) {
				$targetMenu.removeClass($toggleClass);

				} else {
				$targetMenu.addClass($toggleClass);
				};
			} else {
				$targetMenu.removeClass($toggleClass);
			};
		 	lastScrollTop = st;
		};

		$(window).on("scroll", function () {
		  stickyMenu($('.sticky-header'), "active");
		  if ($(this).scrollTop() > 400) {
			$(scrollToTopBtn).addClass('show');
		  } else {
			$(scrollToTopBtn).removeClass('show');
		  }
		});
		
		$(scrollToTopBtn).on('click', function (e) {
		  e.preventDefault();
		  $('html, body').animate({
			scrollTop: 0
		  }, 500);
		  return false;
		});

	});


		/*====================================
			Mobile Menu
		======================================*/ 
		var $offcanvasNav = $("#offcanvas-menu a");
			$offcanvasNav.on("click", function () {
				var link = $(this);
				var closestUl = link.closest("ul");
				var activeLinks = closestUl.find(".active");
				var closestLi = link.closest("li");
				var linkStatus = closestLi.hasClass("active");
				var count = 0;

			closestUl.find("ul").slideUp(function () {
				if (++count == closestUl.find("ul").length)
				activeLinks.removeClass("active");
			});
			if (!linkStatus) {
				closestLi.children("ul").slideDown();
				closestLi.addClass("active");
			}
		});  

		/*====================================
			Payment Button
		======================================*/
		// Add event listener to the bank button
		// $('.payment-stripe-button').on( "click", function(){
		// 	$('.payment-popup__top--digital').toggleClass('active');
		// });	

		// Add event listener to the body
		// $('body').on("click", function(e){
		// 	// Check if the clicked element is not the payment button or any of its children
		// 	if (!$(e.target).is('.payment-stripe-button') && !$.contains($('.payment-stripe-button')[0], e.target)) {
		// 		// If not, remove the 'active' class from the payment popup
		// 		$('.payment-popup__top--digital').removeClass('active');
		// 	}
		// });

		// Add event listener to the bank button
		// $('.payment-bank-button').on("click", function(){
		// 	$('.payment-popup__top--bank').toggleClass('active');
		// });

		// Add event listener to the body
		// $('body').on("click", function(e){
		// 	// Check if the clicked element is not the bank button or any of its children
		// 	if (!$(e.target).is('.payment-bank-button') && !$.contains($('.payment-bank-button')[0], e.target)) {
		// 		// If not, remove the 'active' class from the bank popup
		// 		$('.payment-popup__top--bank').removeClass('active');
		// 	}
		// });

		/*====================================
			Preloader JS
		======================================*/
		$(window).on('load', function (event) {
			$('.preloader').delay(800).fadeOut(500);
		})


})(window.jQuery);

new window.ModalVideo('.js-video-btn');

const accordionItems = document.querySelectorAll('.accordion-item');
let activeItem = document.querySelector('.accordion-item.active');

accordionItems.forEach(item => {
  item.addEventListener('click', () => {
    if (item === activeItem) {
      item.classList.remove('active');
      activeItem = null;
    } else {
      if (activeItem) {
        activeItem.classList.remove('active');
      }
      item.classList.add('active');
      activeItem = item;
    }
  });
});


