document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.carousel-container');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  if (!container || !slides.length || !prevBtn || !nextBtn) return;

  // Measure one “page” as the first slide width + gap
  function getStep() {
    const first = slides[0].getBoundingClientRect().width;
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.columnGap || style.gap || 0);
    return first + gap;
  }

  function scrollNext() {
    container.scrollBy({ left: getStep(), behavior: 'smooth' });
  }

  function scrollPrev() {
    container.scrollBy({ left: -getStep(), behavior: 'smooth' });
  }

  nextBtn.addEventListener('click', scrollNext);
  prevBtn.addEventListener('click', scrollPrev);

  // Touch swipe
  let startX = 0;
  let isDown = false;

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDown = true;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].clientX;
    const walk = startX - x;
    container.scrollLeft += walk;
    startX = x;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    isDown = false;
    // Snap to nearest slide after gesture
    const step = getStep();
    const index = Math.round(container.scrollLeft / step);
    container.scrollTo({ left: index * step, behavior: 'smooth' });
  });

  // Mouse drag (desktop)
  let isDragging = false;
  let startDragX = 0;
  let scrollStart = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startDragX = e.pageX;
    scrollStart = container.scrollLeft;
    container.style.cursor = 'grabbing';
    e.preventDefault();
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const walk = (e.pageX - startDragX) * -1;
    container.scrollLeft = scrollStart + walk;
  });

  container.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'auto';
    const step = getStep();
    const index = Math.round(container.scrollLeft / step);
    container.scrollTo({ left: index * step, behavior: 'smooth' });
  });

  container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.style.cursor = 'auto';
  });
});
