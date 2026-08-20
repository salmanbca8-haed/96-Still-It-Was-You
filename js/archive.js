/* ==========================================================================
   96 (2018) — DYNAMIC SCATTERED EDITORIAL IMAGE ARCHIVE
   Organic masonry, filter animations, and photographic metadata
   ========================================================================== */

class MovieArchive {
  constructor() {
    this.container = document.getElementById('archive-grid');
    this.filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
    this.cards = Array.from(document.querySelectorAll('.archive-card'));
    this.currentFilter = 'ALL';

    this.init();
  }

  init() {
    // Filter click listeners
    this.filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.getAttribute('data-filter');
        this.applyFilter(filter, e.currentTarget);
      });
    });

    // Populate lightbox items from archive cards
    const archiveItems = this.cards.map((card) => {
      const img = card.querySelector('img');
      const title = card.querySelector('.archive-title');
      const tag = card.querySelector('.archive-tag');
      const desc = card.getAttribute('data-desc');
      const date = card.getAttribute('data-date');
      const location = card.getAttribute('data-location');

      return {
        src: img ? img.src : '',
        title: title ? title.textContent : 'Archive Image',
        category: tag ? tag.textContent : 'ARCHIVE',
        desc: desc || 'A candid memory from 96 (2018).',
        date: date || '2018',
        location: location || 'Chennai, Tamil Nadu'
      };
    });

    if (window.lightboxInstance) {
      window.lightboxInstance.setItems(archiveItems);
    }

    // Card click opens Lightbox
    this.cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (window.lightboxInstance) {
          window.lightboxInstance.openIndex(index);
        }
      });
    });
  }

  applyFilter(filter, activeBtn) {
    this.currentFilter = filter;

    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');

    this.cards.forEach((card) => {
      const categories = (card.getAttribute('data-category') || '').split(' ');
      const match = filter === 'ALL' || categories.includes(filter);

      if (match) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 30);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 400);
      }
    });
  }
}

window.MovieArchive = MovieArchive;
