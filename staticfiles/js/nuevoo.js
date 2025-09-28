const track = document.getElementById("carousel-track");
const slides = Array.from(track.children);
const slideCount = slides.length;
const slideWidth = slides[0].getBoundingClientRect().width;
 
let index = 0;
let isTransitioning = false;
 
function cloneSlides() {
  for (let i = 0; i < slideCount; i++) {
    const clone = slides[i].cloneNode(true);
    clone.classList.add("clone");
    track.appendChild(clone);
  }
}
 
function setSlidePositions() {
  const allSlides = Array.from(track.children);
  allSlides.forEach((slide, i) => {
    slide.style.left = slideWidth * i + "px";
  });
}
 
function moveToSlide(idx) {
  if (isTransitioning) return;
  isTransitioning = true;
  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${slideWidth * idx}px)`;
  index = idx;
}
 
track.addEventListener("transitionend", () => {
  if (index >= slideCount) {
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    index = 0;
  }
  isTransitioning = false;
});
 
document.querySelector(".arrow.right").addEventListener("click", () => {
  if (isTransitioning) return;
  moveToSlide(index + 1);
});
 
document.querySelector(".arrow.left").addEventListener("click", () => {
  if (isTransitioning) return;
  if (index === 0) {
    track.style.transition = "none";
    track.style.transform = `translateX(-${slideWidth * slideCount}px)`;
    index = slideCount;
    setTimeout(() => {
      moveToSlide(index - 1);
    }, 20);
  } else {
    moveToSlide(index - 1);
  }
});
 
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    if (!isTransitioning) moveToSlide(index + 1);
  } else if (e.key === "ArrowLeft") {
    if (!isTransitioning) {
      if (index === 0) {
        track.style.transition = "none";
        track.style.transform = `translateX(-${slideWidth * slideCount}px)`;
        index = slideCount;
        setTimeout(() => {
          moveToSlide(index - 1);
        }, 20);
      } else {
        moveToSlide(index - 1);
      }
    }
  }
});
 
cloneSlides();
setSlidePositions();
 
setInterval(() => {
  if (!isTransitioning) moveToSlide(index + 1);
}, 4000);
 
 
// --- Animaciones activadas por scroll ---
const observerOptions = {
  threshold: 0.1
};
 
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.tagName === "H2") {
        el.classList.add("animate-left");
      } else if (el.tagName === "H3") {
        el.classList.add("animate-right");
      } else if (el.tagName === "P") {
        el.classList.add("animate-up");
      }
      obs.unobserve(el); // solo animar una vez
    }
  });
}, observerOptions);
 
document.addEventListener("DOMContentLoaded", () => {
  const h2 = document.querySelector(".search-section h2");
  const h3 = document.querySelector(".recommendations h3");
  const paragraphs = document.querySelectorAll(".search-section p, .recommendations p");
 
  observer.observe(h2);
  observer.observe(h3);
  paragraphs.forEach(p => observer.observe(p));
});
 
document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.getElementById("carousel-wrapper-secondary");
    const slides = wrapper.querySelectorAll(".carousel-slide-secondary");
    const leftArrow = document.querySelector(".left-secondary");
    const rightArrow = document.querySelector(".right-secondary");
 
    let currentIndex = 0;
    const totalSlides = slides.length;
 
    function updateCarousel() {
      const slideWidth = slides[0].offsetWidth;
      wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
 
    rightArrow.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalSlides; // Loop hacia adelante
      updateCarousel();
    });
 
    leftArrow.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Loop hacia atrás
      updateCarousel();
    });
 
    // Asegúrate de que el wrapper tenga transición suave:
    wrapper.style.transition = "transform 0.4s ease";
  });
 
  document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".carousel-slide-secondary img");
    const popup = document.getElementById("popup-modal");
    const popupImg = document.getElementById("popup-image");
    const closeBtn = document.querySelector(".close-popup");
    const codeSpan = document.getElementById("generated-code");
    const copyButton = document.getElementById("copy-button");
 
    function generateCode(length = 8) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
 
    images.forEach(img => {
      img.addEventListener("click", () => {
        popupImg.src = img.src;
        popup.classList.add("show");
 
        const newCode = generateCode();
        codeSpan.textContent = newCode;
        copyButton.textContent = "Copiar código";
      });
    });
 
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("show");
    });
 
    window.addEventListener("click", (e) => {
      if (e.target === popup) {
        popup.classList.remove("show");
      }
    });
 
    copyButton.addEventListener("click", () => {
      const code = codeSpan.textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.textContent = "¡Copiado!";
      });
    });
  });
 
class FooterAnimator {
    constructor() {
        this.footer = document.querySelector('.main-footer');
        if (this.footer) {
            this.init();
        }
    }
 
    init() {
        this.prepareFooter();
        this.animateFooter();
    }
 
    prepareFooter() {
        this.footer.style.opacity = '0';
        this.footer.style.transform = 'translateY(40px)';
        this.footer.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
    }
 
    animateFooter() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        });
 
        observer.observe(this.footer);
    }
 
    animateElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        });
       
        // Animar los elementos de lista
        this.animateListItems(element);
    }
 
    animateListItems(element) {
        const ulItems = element.querySelectorAll('ul li');
        if (ulItems.length > 0) {
            this.staggerAnimate(ulItems, 150, 'translateY(20px)');
        }
    }
 
    staggerAnimate(items, delay, initialTransform) {
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = initialTransform;
            item.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translate(0, 0)';
                });
            }, index * delay + 300);
        });
    }
}
 
// Inicializar el animador del footer
document.addEventListener('DOMContentLoaded', () => {
    new FooterAnimator();
});
 
 