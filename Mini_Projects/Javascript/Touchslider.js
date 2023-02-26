const slider = document.querySelector('.slider_container');
const slides = Array.from(document.querySelectorAll('.slide'));

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let previousTranslate = 0;
let animationId = 0;
let currentIndex = 0;

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img');
  slideImage.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // Touch Events
  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchend', touchEnd);
  slide.addEventListener('touchmove', touchMove);

  // Mouse Events
  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', touchEnd);
  slide.addEventListener('mousemove', touchMove);

  function touchStart(index) {
    return function (event) {
      currentIndex = index;
      startPos = getPositionX(event);
      isDragging = true;
      animationId = requestAnimationFrame(animation);
      slider.classList.add('grabbing');
    };
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationId);
    const movedBy = currentTranslate - previousTranslate;
    if (movedBy < -100 && currentIndex < slides.length - 1) {
      currentIndex += 1;
    }
    if (movedBy > 100 && currentIndex > 0) {
      currentIndex -= 1;
    }
    setPositionByIndex();
    slider.classList.remove('grabbing');
  }

  function touchMove() {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = previousTranslate + currentPosition - startPos;
    }
  }
});

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
  setSliderPosition();
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}
function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  previousTranslate = currentTranslate;
  setSliderPosition();
}

//Disable Popup Menu
window.oncontextmenu = function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};
