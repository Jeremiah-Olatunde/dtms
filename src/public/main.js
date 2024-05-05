(function ($) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    //=== Header Sticky JS ====================================================
    $(window).on("scroll", function () {
      const scroll = $(window).scrollTop();
      const action = scroll < 50 ? "remove" : "add";
      $("#active-sticky")[`${action}Class`]("is-sticky");
    });
    //=========================================================================

    //=== Aos Animate JS ======================================================
    window.AOS.init({
      duration: 1500,
      disable: !1,
      offset: 0,
      once: !0,
      easing: "ease",
    });
    //=========================================================================

    //=== Scrool To Top JS ====================================================
    let last = "";

    function stickyMenu(targetMenu, toggleClass) {
      const top = $(window).scrollTop();

      if (600 < $(window).scrollTop()) {
        const action = last < top ? "add" : "remove";
        targetMenu[`${action}Class`](toggleClass);
        last = top;
        return;
      }

      targetMenu.removeClass(toggleClass);
    }

    $(window).on("scroll", function () {
      stickyMenu($(".sticky-header"), "active");
      const action = 400 < $(this).scrollTop() ? "add" : "remove";
      $(".scrollToTop")[`${action}Class`]("show");
    });

    $(".scrollToTop").on("click", function (event) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 500);
      return false;
    });
    //=========================================================================
  });

  //=== Mobile Menu ===========================================================
  const offcanvasNav = $("#offcanvas-menu a");

  offcanvasNav.on("click", function () {
    const link = $(this);
    const closestUl = link.closest("ul");
    const closestLi = link.closest("li");
    const activeLinks = closestUl.find(".active");
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
  //=========================================================================

  //=== Preloader ===========================================================
  $(window).on("load", () => $(".preloader").delay(100).fadeOut(500));
  //=========================================================================
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

  const modal = document.getElementById("imageModal");
  const outfitImages = document.querySelectorAll(".outfit-image");
  const modalInner = document.querySelector(".homec-modal__inner");

  outfitImages.forEach(function (image) {
    image.onclick = (event) => {
      modal.style.display = "block";
      modalInner.innerHTML = `
        <img src="${event.target.src}" 
          alt="outfit image" 
          style="
            padding-top: 5%; 
            padding-bottom: 5%; 
            padding-left: 5%; 
            padding-right: 5%"
        >
      `;
    };
  });

  // Get the close button
  const closeButton = document.querySelector(".homec-modal__close");
  closeButton?.addEventListener("click", () => (modal.style.display = "none"));

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (event) => {
    if (event.target !== modal) return;
    modal.style.display = "none";
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
