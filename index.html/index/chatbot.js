class ChatbotNovabook {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
    this.mostrarMensajeBienvenida();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <div id="chatbot-widget" class="chatbot-widget">
        <!-- BOTÓN FLOTANTE -->
        <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Abrir chatbot">
          <span class="chatbot-icon">💬</span>
          <span class="chatbot-badge">1</span>
        </button>

        <!-- VENTANA DE CHAT -->
        <div id="chatbot-container" class="chatbot-container hidden">
          <!-- HEADER -->
          <div class="chatbot-header">
            <h3>📚 Asistente Novabook</h3>
            <button id="chatbot-close" class="chatbot-close" aria-label="Cerrar chat">×</button>
          </div>

          <!-- MENSAJES -->
          <div id="chatbot-messages" class="chatbot-messages"></div>

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

    // Insertar en el body
    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);
  }

  attachEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.closeChat());
    send.addEventListener('click', () => this.enviarMensaje());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.enviarMensaje();
    });
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    
    this.isOpen = true;
    container.classList.remove('hidden');
    toggle.classList.add('active');
    document.getElementById('chatbot-input').focus();
    
    // Remover badge
    const badge = toggle.querySelector('.chatbot-badge');
    if (badge) badge.style.display = 'none';
  }

  closeChat() {
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    
    this.isOpen = false;
    container.classList.add('hidden');
    toggle.classList.remove('active');
  }

  mostrarMensajeBienvenida() {
    setTimeout(() => {
      this.addMensajeBot(
        "👋 ¡Hola! Soy tu asistente de Novabook.\n\n" +
        "Puedo ayudarte con:\n" +
        "📚 Buscar libros por título, autor o género\n" +
        "⭐ Acceder a tus favoritos\n" +
        "⏱ Ver tu lista de lectura\n" +
        "💬 Responder cualquier pregunta\n" +
        "🔗 Guiarte por el sitio\n\n" +
        "¿Qué necesitas hoy?",
        false
      );
    }, 500);
  }

  enviarMensaje() {
    const input = document.getElementById('chatbot-input');
    const texto = input.value.trim();

    if (!texto) return;

    // Agregar mensaje del usuario
    this.addMensajeUsuario(texto);
    input.value = '';

    // Procesar respuesta
    setTimeout(() => this.procesarConsulta(texto), 300);
  }

  addMensajeUsuario(texto) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-message usuario';
    div.innerHTML = `<p>${this.escapeHTML(texto)}</p>`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

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

  procesarConsulta(query) {
    // 1. Buscar libros específicos
    const librosEncontrados = buscarLibroSimilar(query);
    
    if (librosEncontrados.length > 0) {
      if (librosEncontrados.length === 1) {
        this.addMensajeBot(`Encontré este libro que coincide con tu búsqueda:`, false);
        this.addMensajeBot(formatearLibro(librosEncontrados[0]), true);
      } else {
        this.addMensajeBot(`Encontré ${librosEncontrados.length} libros que coinciden:`, false);
        librosEncontrados.forEach(libro => {
          this.addMensajeBot(formatearLibro(libro), true);
        });
      }
      
      // Ofrecer ir al catálogo
      setTimeout(() => {
        this.addMensajeBot(
          "¿Te gustaría ir al catálogo completo para ver más opciones? " +
          "<button onclick=\"window.location.href='./libros.html'\" style=\"background:#39ff14; color:black; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold;\">Ir a Libros</button>",
          true
        );
      }, 500);
      return;
    }

    // 2. Buscar respuesta inteligente y redirección
    const resultado = buscarRespuestaIA(query);
    this.addMensajeBot(resultado.respuesta, false);
    
    // 3. Si hay redirección sugerida, ofrecerla
    if (resultado.redirect) {
      setTimeout(() => {
        const nombrePagina = PAGINAS_SITIO.find(p => p.url === resultado.redirect)?.nombre || "página";
        this.addMensajeBot(
          `¿Quieres que te lleve a ${nombrePagina}? ` +
          `<button onclick=\"window.location.href='./${resultado.redirect}'\" style=\"background:#39ff14; color:black; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold;\">Sí, llevarme</button>`,
          true
        );
      }, 500);
    }
  }

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
document.addEventListener('DOMContentLoaded', () => {
  new ChatbotNovabook();
});



