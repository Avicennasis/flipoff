export class KeyboardController {
  constructor(rotator, soundEngine) {
    this.rotator = rotator;
    this.soundEngine = soundEngine;

    document.addEventListener('keydown', (e) => this._handleKey(e));
  }

  _handleKey(e) {
    // Don't capture when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.rotator.next();
        break;

      case 'ArrowRight':
        e.preventDefault();
        this.rotator.next();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.rotator.prev();
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        this._toggleFullscreen();
        break;

      case 'm':
      case 'M':
        e.preventDefault();
        if (this.soundEngine) {
          const muted = this.soundEngine.toggleMute();
          this._showToast(muted ? 'Sound off' : 'Sound on');
        }
        break;

      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        // Also hide shortcuts overlay
        const overlay = document.querySelector('.shortcuts-overlay');
        if (overlay) overlay.classList.remove('visible');
        break;
    }
  }

  _toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  _showToast(msg) {
    if (!this._toast) {
      this._toast = document.createElement('div');
      this._toast.className = 'toast';
      this._toast.setAttribute('role', 'status');
      this._toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(this._toast);
    }
    this._toast.textContent = msg;
    this._toast.style.opacity = '1';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this._toast.style.opacity = '0';
    }, 1200);
  }
}
