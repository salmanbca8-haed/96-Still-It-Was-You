/* ==========================================================================
   96 (2018) — FULLSCREEN CINEMATIC LIGHTBOX VIEWER
   ========================================================================== */

class CinematicLightbox {
  constructor() {
    this.lightbox = document.getElementById('cinematic-lightbox');
    if (!this.lightbox) return;

    this.imgEl = document.getElementById('lightbox-img');
    this.tagEl = document.getElementById('lightbox-tag');
    this.titleEl = document.getElementById('lightbox-title');
    this.descEl = document.getElementById('lightbox-desc');
    this.metaTimeEl = document.getElementById('lightbox-meta-time');
    this.metaLocEl = document.getElementById('lightbox-meta-loc');
    this.closeBtn = document.getElementById('lightbox-close-btn');
    this.prevBtn = document.getElementById('lightbox-prev-btn');
    this.nextBtn = document.getElementById('lightbox-next-btn');

    this.items = [];
    this.currentIndex = 0;

    this.init();
  }

  init() {
    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Prev / Next buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    // Click backdrop to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch Swipe support
    let touchStartX = 0;
    this.lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.lightbox.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) this.next();
      if (touchEndX > touchStartX + 50) this.prev();
    }, { passive: true });
  }

  setItems(items) {
    this.items = items;
  }

  openIndex(index) {
    if (!this.items || this.items.length === 0) return;
    this.currentIndex = (index + this.items.length) % this.items.length;
    this.renderCurrentItem();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openWithData(data) {
    // Check if item already exists in list
    const foundIdx = this.items.findIndex(item => item.src === data.src);
    if (foundIdx !== -1) {
      this.openIndex(foundIdx);
    } else {
      this.items.push(data);
      this.openIndex(this.items.length - 1);
    }
  }

  renderCurrentItem() {
    const item = this.items[this.currentIndex];
    if (!item) return;

    if (this.imgEl) {
      this.imgEl.style.opacity = '0';
      this.imgEl.src = item.src;
      this.imgEl.alt = item.title || '96 Movie Memory';
      this.imgEl.onload = () => {
        this.imgEl.style.transition = 'opacity 0.4s ease';
        this.imgEl.style.opacity = '1';
      };
    }

    if (this.tagEl) this.tagEl.textContent = item.category || 'SCENE ARCHIVE';
    if (this.titleEl) this.titleEl.textContent = item.title || 'Untitled Memory';
    if (this.descEl) this.descEl.textContent = item.desc || 'An unforgettable moment from 96, capturing the warmth and bittersweet nostalgia of Ram and Jaanu.';
    if (this.metaTimeEl) this.metaTimeEl.textContent = item.date || '2018';
    if (this.metaLocEl) this.metaLocEl.textContent = item.location || 'Chennai, Tamil Nadu';
  }

  prev() {
    this.openIndex(this.currentIndex - 1);
  }

  next() {
    this.openIndex(this.currentIndex + 1);
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.CinematicLightbox = CinematicLightbox;
