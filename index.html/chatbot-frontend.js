/**
 * CHATBOT FRONTEND AVANZADO
 * Integración con servidor Node.js + OpenAI GPT-4o
 */

class ChatbotNovabook {
  constructor(options = {}) {
    this.messages = [];
    this.isOpen = false;
    this.apiUrl = options.apiUrl || 'http://localhost:5000/api';
    this.userId = this.getOrCreateUserId();
    this.sessionId = this.generateSessionId();
    this.isLoading = false;
    this.init();
  }

  /**
   * Obtener o crear ID de usuario
   */
  getOrCreateUserId() {
    let userId = localStorage.getItem('novabook_userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      localStorage.setItem('novabook_userId', userId);
    }
    return userId;
  }

  /**
   * Generar ID de sesión
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(7);
  }

  /**
   * Inicializar chatbot
   */
  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
    this.mostrarMensajeBienvenida();
    this.verificarConexion();
  }

  /**
   * Verificar conexión con servidor
   */
  verificarConexion() {
    fetch(`${this.apiUrl}/health`)
      .then(r => r.json())
      .then(data => {
        console.log('✅ Chatbot conectado al servidor AI');
      })
      .catch(err => {
        console.warn('⚠️ Servidor AI no disponible. Usando modo local.');
        this.apiUrl = null;
      });
  }

  /**
   * Crear HTML del chatbot
   */
  createChatbotHTML() {
    const chatbotHTML = `
      <div id="chatbot-widget" class="chatbot-widget">
        <!-- BOTÓN FLOTANTE -->
        <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Abrir chatbot">
          <span class="chatbot-icon">💬</span>
          <span class="chatbot-badge">AI</span>
        </button>

        <!-- VENTANA DE CHAT -->
        <div id="chatbot-container" class="chatbot-container hidden">
          <!-- HEADER -->
          <div class="chatbot-header">
            <h3>🤖 Asistente IA Novabook</h3>
            <div class="header-actions">
              <button id="chatbot-clear" class="chatbot-action" title="Limpiar historial">🗑️</button>
              <button id="chatbot-close" class="chatbot-close" aria-label="Cerrar chat">×</button>
            </div>
          </div>

          <!-- MENSAJES -->
          <div id="chatbot-messages" class="chatbot-messages"></div>

          <!-- INDICADOR DE ESCRITURA -->
          <div id="typing-indicator" class="typing-indicator hidden">
            <span></span><span></span><span></span>
          </div>

          <!-- INPUT -->
          <div class="chatbot-input-container">
            <input 
              type="text" 
              id="chatbot-input" 
              class="chatbot-input" 
              placeholder="Escribe tu pregunta..."
              autocomplete="off"
            >
            <button id="chatbot-send" class="chatbot-send" aria-label="Enviar">➤</button>
          </div>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);
  }

  /**
   * Adjuntar event listeners
   */
  attachEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const clear = document.getElementById('chatbot-clear');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.closeChat());
    clear.addEventListener('click', () => this.clearHistory());
    send.addEventListener('click', () => this.enviarMensaje());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isLoading) this.enviarMensaje();
    });
  }

  /**
   * Toggle abrir/cerrar chat
   */
  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  /**
   * Abrir chat
   */
  openChat() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');

    this.isOpen = true;
    container.classList.remove('hidden');
    toggle.classList.add('active');
    document.getElementById('chatbot-input').focus();

    const badge = toggle.querySelector('.chatbot-badge');
    if (badge) badge.style.display = 'none';
  }

  /**
   * Cerrar chat
   */
  closeChat() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');

    this.isOpen = false;
    container.classList.add('hidden');
    toggle.classList.remove('active');
  }

  /**
   * Limpiar historial
   */
  clearHistory() {
    if (confirm('¿Limpiar el historial de chat?')) {
      this.messages = [];
      document.getElementById('chatbot-messages').innerHTML = '';
      this.mostrarMensajeBienvenida();
    }
  }

  /**
   * Mensaje de bienvenida
   */
  mostrarMensajeBienvenida() {
    setTimeout(() => {
      this.addMensajeBot(
        "👋 ¡Hola! Soy tu asistente AI de Novabook, impulsado por GPT-4o.\n\n" +
        "Puedo ayudarte con:\n" +
        "📚 Buscar y recomendar libros\n" +
        "⭐ Gestionar tus favoritos\n" +
        "💬 Responder preguntas sobre la plataforma\n" +
        "📞 Conectarte con nuestro equipo\n\n" +
        "¿Qué necesitas hoy?",
        false
      );
    }, 500);
  }

  /**
   * Enviar mensaje
   */
  async enviarMensaje() {
    const input = document.getElementById('chatbot-input');
    const texto = input.value.trim();

    if (!texto || this.isLoading) return;

    // Agregar mensaje del usuario
    this.addMensajeUsuario(texto);
    input.value = '';
    this.isLoading = true;

    // Mostrar indicador de escritura
    this.mostrarIndicadorEscritura(true);

    try {
      if (this.apiUrl) {
        // Usar servidor AI
        await this.enviarAlServidor(texto);
      } else {
        // Usar respuesta local (fallback)
        this.procesarConsultaLocal(texto);
      }
    } catch (error) {
      console.error('Error:', error);
      this.addMensajeBot(
        "❌ Error procesando tu mensaje. Por favor, intenta de nuevo.",
        false
      );
    }

    this.isLoading = false;
    this.mostrarIndicadorEscritura(false);
  }

  /**
   * Enviar mensaje al servidor
   */
  async enviarAlServidor(mensaje) {
    const response = await fetch(`${this.apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: mensaje,
        userId: this.userId,
        sessionId: this.sessionId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Mostrar respuesta del bot
    this.addMensajeBot(data.reply, true);

    // Si detecta intención de captura de lead
    if (data.isLeadCapture) {
      setTimeout(() => {
        this.mostrarFormularioLead();
      }, 1000);
    }

    // Si hay redirección sugerida
    if (data.redirect) {
      setTimeout(() => {
        this.ofrecerRedireccion(data.redirect);
      }, 1500);
    }

    // Mostrar fuentes si están disponibles
    if (data.sources && data.sources.length > 0) {
      console.log('📚 Fuentes consultadas:', data.sources);
    }
  }

  /**
   * Procesamiento local (fallback)
   */
  procesarConsultaLocal(texto) {
    const respuesta = this.obtenerRespuestaLocal(texto);
    setTimeout(() => {
      this.addMensajeBot(respuesta, false);
    }, 500);
  }

  /**
   * Obtener respuesta local (sin servidor)
   */
  obtenerRespuestaLocal(query) {
    const q = query.toLowerCase();

    if (q.includes('hola') || q.includes('hey')) {
      return '👋 ¡Hola! Soy tu asistente de Novabook. ¿En qué puedo ayudarte?';
    }
    if (q.includes('libro') || q.includes('buscar')) {
      return '📚 Puedo ayudarte a buscar libros. ¿Qué tipo de libro te interesa?';
    }
    if (q.includes('contacto') || q.includes('email')) {
      return '📧 Claro, puedo ayudarte con tus datos de contacto. ¿Cuál es tu nombre?';
    }

    return '✨ Tu pregunta es interesante. El servidor AI no está disponible ahora, pero volveremos con respuestas más inteligentes cuando se reconecte.';
  }

  /**
   * Mostrar indicador de escritura
   */
  mostrarIndicadorEscritura(mostrar) {
    const indicator = document.getElementById('typing-indicator');
    if (mostrar) {
      indicator.classList.remove('hidden');
    } else {
      indicator.classList.add('hidden');
    }
  }

  /**
   * Agregar mensaje del usuario
   */
  addMensajeUsuario(texto) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-message usuario';
    div.innerHTML = `<p>${this.escapeHTML(texto)}</p>`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /**
   * Agregar mensaje del bot
   */
  addMensajeBot(texto, isHTML = false) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-message bot';

    if (isHTML) {
      div.innerHTML = `<div class="bot-message-content">${texto}</div>`;
    } else {
      div.innerHTML = `<p>${this.escapeHTML(texto)}</p>`;
    }

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /**
   * Mostrar formulario de captura de lead
   */
  mostrarFormularioLead() {
    const messagesDiv = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-lead-form';
    div.innerHTML = `
      <div class="lead-form-content">
        <h4>📋 Tu información de contacto</h4>
        <input type="text" id="lead-name" placeholder="Tu nombre" maxlength="100">
        <input type="email" id="lead-email" placeholder="Tu email" maxlength="100">
        <input type="tel" id="lead-phone" placeholder="Tu teléfono (opcional)" maxlength="20">
        <button id="btn-submit-lead" class="lead-btn">Enviar datos</button>
      </div>
    `;
    messagesDiv.appendChild(div);

    document.getElementById('btn-submit-lead').addEventListener('click', () => {
      this.enviarDatosLead();
    });
  }

  /**
   * Enviar datos de lead
   */
  async enviarDatosLead() {
    const name = document.getElementById('lead-name').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();

    if (!name || (!email && !phone)) {
      alert('Por favor completa nombre y al menos un contacto (email o teléfono)');
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          userId: this.userId,
          message: '(Del chatbot AI)'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Limpiar formulario
        document.querySelector('.chatbot-lead-form').remove();

        // Mostrar confirmación
        this.addMensajeBot(
          `✅ ¡Gracias ${name}! Hemos recibido tus datos. Nos pondremos en contacto pronto.`,
          false
        );
      }
    } catch (error) {
      console.error('Error enviando datos:', error);
      this.addMensajeBot('❌ Error enviando datos. Por favor intenta de nuevo.', false);
    }
  }

  /**
   * Ofrecer redirección
   */
  ofrecerRedireccion(url) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-message bot';
    div.innerHTML = `
      <div class="bot-message-content">
        <button onclick="window.location.href='./${url}'" class="redirect-btn">
          🔗 Ir a esa sección
        </button>
      </div>
    `;
    messagesDiv.appendChild(div);
  }

  /**
   * Escapar HTML
   */
  escapeHTML(texto) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return texto.replace(/[&<>"']/g, m => map[m]);
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChatbotNovabook({
      apiUrl: 'http://localhost:5000/api'
    });
  });
} else {
  new ChatbotNovabook({
    apiUrl: 'http://localhost:5000/api'
  });
}
