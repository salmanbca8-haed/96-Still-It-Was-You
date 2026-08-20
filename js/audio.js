/* ==========================================================================
   96 (2018) — AUDIO SYSTEM (Original Movie Soundtrack)
   Plays the iconic "Kaathalae Kaathalae" soundtrack with smooth cinematic fade
   ========================================================================== */

class AmbientSoundscape {
  constructor() {
    this.audio = null;
    this.isPlaying = true;
    this.hasStarted = false;
    this.audioSources = [
      'assets/audio/kaathalae-kaathalae.mp3',
      'js/kaathalae-kaathalae-from-96-1_ingB72Pk.mp3'
    ];
    this.currentSrcIndex = 0;
    this.targetVolume = 0.85;
    this.fadeInterval = null;

    this.initUI();
    this.initAudio();
    this.startAudio();
  }

  initUI() {
    this.btn = document.getElementById('sound-toggle-btn');
    this.btnText = document.getElementById('sound-btn-text');
    
    if (this.btn) {
      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSound();
      });
    }

    this.updateUI(true);
  }

  initAudio() {
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 0;
    this.audio.src = this.audioSources[this.currentSrcIndex];

    this.audio.addEventListener('error', () => {
      console.warn(`Could not load audio from ${this.audioSources[this.currentSrcIndex]}, trying fallback...`);
      this.currentSrcIndex = (this.currentSrcIndex + 1) % this.audioSources.length;
      this.audio.src = this.audioSources[this.currentSrcIndex];
      if (this.isPlaying) {
        this.audio.play().then(() => {
          this.hasStarted = true;
          this.fadeIn(1500);
          this.updateUI(true);
        }).catch(() => {
          this.updateUI(false);
        });
      }
    });
  }

  startAudio() {
    if (!this.audio) return;

    const attemptPlay = () => {
      if (!this.isPlaying || !this.audio.paused) return;
      
      this.audio.play().then(() => {
        this.hasStarted = true;
        this.fadeIn(1500);
        this.updateUI(true);
        removeInteractionListeners();
      }).catch(() => {
        this.updateUI(true);
      });
    };

    const onUserInteraction = () => {
      if (this.isPlaying && (!this.hasStarted || this.audio.paused)) {
        attemptPlay();
      }
    };

    const interactionEvents = ['click', 'touchstart', 'scroll', 'keydown', 'pointerdown'];
    const removeInteractionListeners = () => {
      interactionEvents.forEach(evt => {
        window.removeEventListener(evt, onUserInteraction, { capture: true });
        document.removeEventListener(evt, onUserInteraction, { capture: true });
      });
    };

    interactionEvents.forEach(evt => {
      window.addEventListener(evt, onUserInteraction, { passive: true, capture: true });
      document.addEventListener(evt, onUserInteraction, { passive: true, capture: true });
    });

    attemptPlay();
  }

  updateUI(isPlaying) {
    if (this.btn) this.btn.classList.toggle('playing', isPlaying);
    if (this.btnText) this.btnText.textContent = isPlaying ? '♪ SOUND ON' : 'SOUND OFF';
  }

  fadeIn(duration = 1500) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    
    const steps = 30;
    const stepTime = duration / steps;
    const volumeStep = this.targetVolume / steps;

    this.fadeInterval = setInterval(() => {
      if (this.audio.volume + volumeStep < this.targetVolume) {
        this.audio.volume += volumeStep;
      } else {
        this.audio.volume = this.targetVolume;
        clearInterval(this.fadeInterval);
      }
    }, stepTime);
  }

  fadeOut(duration = 800) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = this.audio.volume / steps;

    this.fadeInterval = setInterval(() => {
      if (this.audio.volume - volumeStep > 0.01) {
        this.audio.volume -= volumeStep;
      } else {
        this.audio.volume = 0;
        this.audio.pause();
        clearInterval(this.fadeInterval);
      }
    }, stepTime);
  }

  toggleSound() {
    if (!this.audio) return;

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.audio.play().then(() => {
        this.hasStarted = true;
        this.fadeIn(1500);
        this.updateUI(true);
      }).catch(() => {
          this.updateUI(true);
      });
    } else if (!this.hasStarted || this.audio.paused) {
      this.audio.play().then(() => {
        this.hasStarted = true;
        this.fadeIn(1500);
        this.updateUI(true);
      }).catch(() => {
        this.updateUI(false);
      });
    } else {
      this.isPlaying = false;
      this.fadeOut(800);
      this.updateUI(false);
    }
  }
}

window.AmbientSoundscape = AmbientSoundscape;
