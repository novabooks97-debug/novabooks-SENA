/**
 * Page Transitions System
 * Global page transition animations for smooth navigation
 * 
 * Features:
 * - Automatic link interception
 * - Multiple animation styles
 * - Cross-browser compatible
 * - Mobile-friendly
 * - No dependencies
 * 
 * Usage:
 * <script src="./page-transitions.js"></script>
 * 
 * Customization:
 * new PageTransition({
 *   style: 'fade-slide',  // fade, slide, fade-slide, zoom
 *   duration: 500,        // milliseconds
 *   color: '#0b0f0c'      // overlay color
 * });
 */

class PageTransition {
  constructor(options = {}) {
    this.style = options.style || 'fade-slide';
    this.duration = options.duration || 500;
    this.color = options.color || '#0b0f0c';
    this.overlay = null;
    this.isTransitioning = false;
    
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createTransitionOverlay();
    this.injectStyles();
    this.interceptLinks();
    this.animatePageEntry();
    console.log('✅ Page Transitions initialized');
  }

  createTransitionOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'page-transition-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${this.color};
      opacity: 0;
      z-index: 99999;
      pointer-events: none;
      will-change: opacity, transform;
    `;
    document.body.appendChild(this.overlay);
  }

  injectStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      /* Fade Animation */
      @keyframes pageTransitionFadeOut {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes pageTransitionFadeIn {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      /* Slide Animation */
      @keyframes pageTransitionSlideOutUp {
        from {
          opacity: 0;
          transform: translateY(0);
        }
        to {
          opacity: 1;
          transform: translateY(-20px);
        }
      }

      @keyframes pageTransitionSlideInDown {
        from {
          opacity: 1;
          transform: translateY(-20px);
        }
        to {
          opacity: 0;
          transform: translateY(0);
        }
      }

      /* Fade + Slide Animation */
      @keyframes pageTransitionFadeSlideOut {
        from {
          opacity: 0;
          transform: translateY(0);
        }
        to {
          opacity: 1;
          transform: translateY(-20px);
        }
      }

      @keyframes pageTransitionFadeSlideIn {
        from {
          opacity: 1;
          transform: translateY(-20px);
        }
        to {
          opacity: 0;
          transform: translateY(0);
        }
      }

      /* Zoom Animation */
      @keyframes pageTransitionZoomOut {
        from {
          opacity: 0;
          transform: scale(1);
        }
        to {
          opacity: 1;
          transform: scale(1.05);
        }
      }

      @keyframes pageTransitionZoomIn {
        from {
          opacity: 1;
          transform: scale(1.05);
        }
        to {
          opacity: 0;
          transform: scale(1);
        }
      }

      /* Page Entry Animation */
      @keyframes pageEntryFade {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      @keyframes pageEntrySlide {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* Reduced Motion Preference */
      @media (prefers-reduced-motion: reduce) {
        .page-transition-enter {
          animation: none !important;
        }
        #page-transition-overlay {
          transition: opacity 0.1s ease-out !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  interceptLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Ignore external links
      if (!href || 
          href.startsWith('http://') || 
          href.startsWith('https://') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') || 
          href.startsWith('#') ||
          link.target === '_blank') {
        return;
      }

      // Prevent default navigation
      e.preventDefault();
      
      // Trigger transition
      this.transitionToPage(href);
    });
  }

  transitionToPage(url) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Get animation names
    const animationOut = this.getAnimationOut();
    const animationIn = this.getAnimationIn();
    
    // Apply exit animation
    this.overlay.style.animation = `${animationOut} ${this.duration}ms ease-out forwards`;
    
    // Navigate after half the duration
    setTimeout(() => {
      window.location.href = url;
    }, this.duration / 2);
  }

  animatePageEntry() {
    // Small delay to ensure page is fully loaded
    setTimeout(() => {
      const animationIn = this.getAnimationIn();
      this.overlay.style.animation = `${animationIn} ${this.duration}ms ease-out forwards`;
      
      // Reset after animation
      setTimeout(() => {
        this.overlay.style.animation = 'none';
        this.overlay.style.opacity = '0';
        this.isTransitioning = false;
      }, this.duration);
    }, 100);
  }

  getAnimationOut() {
    const animations = {
      fade: 'pageTransitionFadeOut',
      slide: 'pageTransitionSlideOutUp',
      'fade-slide': 'pageTransitionFadeSlideOut',
      zoom: 'pageTransitionZoomOut'
    };
    return animations[this.style] || animations['fade-slide'];
  }

  getAnimationIn() {
    const animations = {
      fade: 'pageTransitionFadeIn',
      slide: 'pageTransitionSlideInDown',
      'fade-slide': 'pageTransitionFadeSlideIn',
      zoom: 'pageTransitionZoomIn'
    };
    return animations[this.style] || animations['fade-slide'];
  }

  // Public methods for dynamic changes
  setStyle(newStyle) {
    if (['fade', 'slide', 'fade-slide', 'zoom'].includes(newStyle)) {
      this.style = newStyle;
    }
  }

  setDuration(newDuration) {
    if (newDuration > 0) {
      this.duration = newDuration;
    }
  }

  setColor(newColor) {
    this.color = newColor;
    this.overlay.style.backgroundColor = newColor;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PageTransition({
      style: 'fade-slide',
      duration: 500,
      color: '#0b0f0c'
    });
  });
} else {
  new PageTransition({
    style: 'fade-slide',
    duration: 500,
    color: '#0b0f0c'
  });
}

