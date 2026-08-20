/* ==========================================================================
   96 (2018) — FLUID MAGNETIC CUSTOM CURSOR
   ========================================================================== */

class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.custom-cursor');
    if (!this.cursor) return;

    this.mouse = { x: -100, y: -100 };
    this.pos = { x: -100, y: -100 };
    this.speed = 0.18;
    this.isHovering = false;
    this.isImageHover = false;

    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Interactive element listeners
    this.bindHoverElements();

    this.render();
  }

  bindHoverElements() {
    const clickables = document.querySelectorAll('a, button, .filter-btn, .timeline-card');
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hovering-link');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hovering-link');
      });
    });

    const imageCards = document.querySelectorAll('.memory-photo-card, .archive-card, .river-item, .polaroid-frame');
    imageCards.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('viewing-image');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('viewing-image');
      });
    });
  }

  render() {
    this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

    this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(() => this.render());
  }
}

window.CustomCursor = CustomCursor;
