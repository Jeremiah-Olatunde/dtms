(function ($) {
  "use strict";
  $(document).on("ready", function () {
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
			Aos Animate JS
		======================================*/
    window.AOS.init({
      duration: 1500,
      disable: !1,
      offset: 0,
      once: !0,
      easing: "ease",
    });

    /*====================================
			Scrool To Top JS
		======================================*/
    let last = "";

    function stickyMenu($targetMenu, $toggleClass) {
      var top = $(window).scrollTop();

      if ($(window).scrollTop() < 600) {
        $targetMenu.removeClass($toggleClass);
        return;
      }

      $targetMenu[last < top ? "addClass" : "removeClass"]($toggleClass);

      last = top;
    }

    $(window).on("scroll", function () {
      stickyMenu($(".sticky-header"), "active");
      if ($(this).scrollTop() > 400) {
        $(".scrollToTop").addClass("show");
      } else {
        $(".scrollToTop").removeClass("show");
      }
    });

    $(".scrollToTop").on("click", function (e) {
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        500,
      );
      return false;
    });
  });

  /*====================================
			Mobile Menu
		======================================*/
  var $offcanvasNav = $("#offcanvas-menu a");
  $offcanvasNav.on("click", function () {
    const link = $(this);
    const closestUl = link.closest("ul");
    const activeLinks = closestUl.find(".active");
    const closestLi = link.closest("li");
    const linkStatus = closestLi.hasClass("active");
    let count = 0;

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
  $(window).on("load", function (event) {
    $(".preloader").delay(100).fadeOut(500);
  });
})(window.jQuery);

htmx.onLoad(() => {
  new window.Swiper(".homec-slider-property", {
    autoplay: {
      delay: 4000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    mousewheel: true,
    keyboard: true,
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    centeredSlides: false,
    pagination: {
      el: ".swiper-pagination__property",
      type: "bullets",
      clickable: true,
    },
    slidesPerView: "4",
    breakpoints: {
      320: {
        slidesPerView: "1",
      },
      428: {
        slidesPerView: "1",
      },
      640: {
        slidesPerView: "2",
      },
      768: {
        slidesPerView: "2",
      },
      1024: {
        slidesPerView: "3",
      },
    },
  });

  new window.Swiper(".homec-slider-agent", {
    autoplay: {
      delay: 4000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    mousewheel: true,
    keyboard: true,
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    centeredSlides: false,
    pagination: {
      el: ".swiper-pagination__agent",
      type: "bullets",
      clickable: true,
    },
    slidesPerView: "4",
    breakpoints: {
      320: {
        slidesPerView: "1",
      },
      428: {
        slidesPerView: "1",
      },
      640: {
        slidesPerView: "2",
      },
      768: {
        slidesPerView: "2",
      },
      1024: {
        slidesPerView: "3",
      },
      1100: {
        slidesPerView: "4",
      },
    },
  });

  new window.Swiper(".homec-slider-testimonial--v2", {
    autoplay: {
      delay: 3500,
    },
    mousewheel: true,
    keyboard: true,
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    centeredSlides: false,
    pagination: {
      el: ".swiper-pagination__testimonial",
      type: "bullets",
      clickable: true,
    },
    slidesPerView: "1",
  });

  new window.Swiper(".homec-slider-client", {
    autoplay: {
      delay: 3500,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    mousewheel: true,
    keyboard: true,
    loop: true,
    grabCursor: true,
    spaceBetween: 30,
    centeredSlides: false,
    slidesPerView: "4",
    breakpoints: {
      320: {
        slidesPerView: "2",
      },
      428: {
        slidesPerView: "2",
      },
      640: {
        slidesPerView: "3",
      },
      768: {
        slidesPerView: "4",
      },
      1024: {
        slidesPerView: "5",
      },
    },
  });

  window.modal = document.getElementById("imageModal");
  window.outfitImages = document.querySelectorAll(".outfit-image");
  window.modalInner = document.querySelector(".homec-modal__inner");

  // Loop through each image and attach click event listener
  outfitImages.forEach(function (image) {
    image.onclick = function () {
      // Set the image source and display the modal
      modal.style.display = "block";
      modalInner.innerHTML =
        '<img src="' +
        this.src +
        '" alt="Outfit Image" style="padding-top: 5%; padding-bottom: 5%; padding-left: 5%; padding-right: 5% ">'; // Adjust image size here
    };
  });

  // Get the close button
  window.closeButton = document.querySelector(".homec-modal__close");

  // When the user clicks on the close button, close the modal
  if (closeButton) {
    closeButton.onclick = function () {
      modal.style.display = "none";
    };
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

const accordionItems = document.querySelectorAll(".accordion-item");
let activeItem = document.querySelector(".accordion-item.active");

accordionItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (item === activeItem) {
      item.classList.remove("active");
      activeItem = null;
      return;
    }

    if (activeItem) {
      activeItem.classList.remove("active");
    }

    item.classList.add("active");
    activeItem = item;
  });
});
