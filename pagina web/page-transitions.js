

class PageTransition {
  constructor(options = {}) {
    this.duration = options.duration || 500;
    this.style = options.style || 'fade-slide'; // 'fade', 'slide', 'fade-slide', 'zoom'
    this.color = options.color || '#0b0f0c';
    this.initialized = false;
    this.init();
  }

  /**
   * Inicializar sistema de transiciones
   */
  init() {
    if (this.initialized) return;
    
    // Crear overlay de transición
    this.createTransitionOverlay();
    
    // Interceptar enlaces internos
    this.interceptLinks();
    
    // Animación de entrada al cargar página
    this.animatePageEntry();
    
    this.initialized = true;
    console.log('✅ Page Transitions initialized');
  }

  /**
   * Crear overlay de transición
   */
  createTransitionOverlay() {
    // Evitar duplicar overlay
    if (document.getElementById('page-transition-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.className = `page-transition-overlay ${this.style}`;
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${this.color};
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
    `;
    document.body.appendChild(overlay);

    // Agregar estilos CSS dinámicamente si no existen
    this.injectStyles();
  }

  /**
   * Inyectar estilos CSS
   */
  injectStyles() {
    if (document.getElementById('page-transition-styles')) return;

    const style = document.createElement('style');
    style.id = 'page-transition-styles';
    style.textContent = `
      /* PAGE TRANSITION OVERLAY */
      .page-transition-overlay {
        animation: transitionOut 0.5s ease-out forwards;
      }

      .page-transition-overlay.active {
        animation: transitionIn 0.5s ease-in forwards;
      }

      /* FADE Effect */
      .page-transition-overlay.fade {
        animation: fadeOut 0.5s ease-out forwards;
      }

      .page-transition-overlay.fade.active {
        animation: fadeIn 0.5s ease-in forwards;
      }

      @keyframes fadeOut {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeIn {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      /* SLIDE Effect */
      .page-transition-overlay.slide {
        animation: slideOutUp 0.5s ease-out forwards;
      }

      .page-transition-overlay.slide.active {
        animation: slideInDown 0.5s ease-in forwards;
      }

      @keyframes slideOutUp {
        from { transform: translateY(0); opacity: 0; }
        to { transform: translateY(100%); opacity: 1; }
      }

      @keyframes slideInDown {
        from { transform: translateY(-100%); opacity: 1; }
        to { transform: translateY(0); opacity: 0; }
      }

      /* FADE + SLIDE Effect (Default) */
      .page-transition-overlay.fade-slide {
        animation: fadeSlideOut 0.5s ease-out forwards;
      }

      .page-transition-overlay.fade-slide.active {
        animation: fadeSlideIn 0.5s ease-in forwards;
      }

      @keyframes fadeSlideOut {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeSlideIn {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
      }

      /* ZOOM Effect */
      .page-transition-overlay.zoom {
        animation: zoomOut 0.5s ease-out forwards;
      }

      .page-transition-overlay.zoom.active {
        animation: zoomIn 0.5s ease-in forwards;
      }

      @keyframes zoomOut {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes zoomIn {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(1.05); }
      }

      /* PAGE ENTRY Animation */
      @keyframes pageEntry {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      body.page-entry {
        animation: pageEntry 0.6s ease-out;
      }

      /* Smooth scroll behavior */
      html {
        scroll-behavior: smooth;
      }

      /* Disable transitions on page load */
      .no-transition,
      .no-transition * {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Interceptar enlaces internos
   */
  interceptLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      
      if (!link) return;

      // Ignorar enlaces externos, mailto, tel, etc.
      const href = link.getAttribute('href');
      if (!href || 
          href.startsWith('#') || 
          href.startsWith('http') ||
          href.startsWith('mailto') ||
          href.startsWith('tel') ||
          href.startsWith('javascript') ||
          link.getAttribute('target') === '_blank') {
        return;
      }

      // Solo procesar enlaces HTML internos
      if (!/\.(html|php)$/.test(href)) {
        return;
      }

      e.preventDefault();
      this.transitionToPage(href);
    });
  }

  /**
   * Transición a página
   */
  transitionToPage(url) {
    const overlay = document.getElementById('page-transition-overlay');
    
    // Salir de página actual
    overlay.classList.add('active');

    setTimeout(() => {
      window.location.href = url;
    }, this.duration / 2);
  }

  /**
   * Animar entrada de página
   */
  animatePageEntry() {
    // Esperar a que el DOM esté listo
    const runAnimation = () => {
      document.body.classList.add('page-entry');
      
      // Remover clase después de animación
      setTimeout(() => {
        document.body.classList.remove('page-entry');
      }, 600);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runAnimation);
    } else {
      runAnimation();
    }
  }

  /**
   * Cambiar estilo de transición
   */
  setStyle(style) {
    this.style = style;
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      overlay.className = `page-transition-overlay ${style}`;
    }
  }

  /**
   * Cambiar duración de transición
   */
  setDuration(ms) {
    this.duration = ms;
  }
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PageTransition({
      style: 'fade-slide',  // fade, slide, fade-slide, zoom
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
