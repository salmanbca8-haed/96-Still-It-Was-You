/* ==========================================================================
   96 (2018) — SCENE EXPLORER (Vertical Cinematic Timeline)
   Dynamic progress track, expanding active cards, and emotional storytelling
   ========================================================================== */

class SceneExplorer {
  constructor() {
    this.timeline = document.getElementById('scene-timeline');
    if (!this.timeline) return;

    this.progressLine = document.getElementById('timeline-progress-line');
    this.items = Array.from(document.querySelectorAll('.timeline-item'));
    
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateTimeline(), { passive: true });
    this.updateTimeline();

    // Click handler for timeline cards to open lightbox
    this.items.forEach((item, index) => {
      const card = item.querySelector('.timeline-card');
      if (card) {
        card.addEventListener('click', () => {
          const img = item.querySelector('img');
          const title = item.querySelector('.timeline-title');
          const desc = item.querySelector('.timeline-text');
          const period = item.querySelector('.timeline-period');

          if (window.lightboxInstance && img) {
            window.lightboxInstance.openWithData({
              src: img.src,
              title: title ? title.textContent : 'Scene Memory',
              desc: desc ? desc.textContent : '',
              date: period ? period.textContent : '2018',
              category: 'SCENE EXPLORER',
              location: 'Tamil Nadu'
            });
          }
        });
      }
    });
  }

  updateTimeline() {
    if (!this.timeline || this.items.length === 0) return;

    const timelineRect = this.timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate progress line fill
    const startOffset = windowHeight * 0.5;
    const totalHeight = timelineRect.height;
    const currentProgress = (startOffset - timelineRect.top) / totalHeight;
    const clampedProgress = Math.max(0, Math.min(1, currentProgress));

    if (this.progressLine) {
      this.progressLine.style.height = `${clampedProgress * 100}%`;
    }

    // Determine active item
    const centerY = windowHeight * 0.5;
    let closestItem = null;
    let minDistance = Infinity;

    this.items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterY = rect.top + rect.height * 0.5;
      const distance = Math.abs(centerY - itemCenterY);

      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
    });

    this.items.forEach((item) => {
      if (item === closestItem && minDistance < windowHeight * 0.45) {
        item.classList.add('active');
        item.style.opacity = '1';
        item.style.filter = 'blur(0px)';
      } else {
        item.classList.remove('active');
        // Gentle dimming for cinematic focus
        const rect = item.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          item.style.opacity = '0.45';
          item.style.filter = 'blur(1.5px)';
        }
      }
    });
  }
}

window.SceneExplorer = SceneExplorer;
