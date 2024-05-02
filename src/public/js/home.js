var swiper = new window.Swiper(".homec-slider-property", {
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
        el: '.swiper-pagination__property',
        type: 'bullets',
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

var swiper = new window.Swiper(".homec-slider-agent", {
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
        el: '.swiper-pagination__agent',
        type: 'bullets',
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

var swiper = new window.Swiper(".homec-slider-testimonial--v2", {
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
        el: '.swiper-pagination__testimonial',
        type: 'bullets',
        clickable: true,
    },
    slidesPerView: "1",
});

var swiper = new window.Swiper(".homec-slider-client", {
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

const modal = document.getElementById('imageModal');
const outfitImages = document.querySelectorAll('.outfit-image');
const modalInner = document.querySelector('.homec-modal__inner');

// Loop through each image and attach click event listener
outfitImages.forEach(function(image) {
  image.onclick = function() {
    // Set the image source and display the modal
    modal.style.display = "block";
    modalInner.innerHTML = '<img src="' + this.src + '" alt="Outfit Image" style="padding-top: 5%; padding-bottom: 5%; padding-left: 5%; padding-right: 5% ">'; // Adjust image size here
  }
});

// Get the close button
const closeButton = document.querySelector('.homec-modal__close');

// When the user clicks on the close button, close the modal
if(closeButton){
  closeButton.onclick = function() {
    modal.style.display = "none";
  }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}