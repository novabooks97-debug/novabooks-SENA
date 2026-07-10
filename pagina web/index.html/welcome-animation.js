/**
 * Welcome Animation Controller - NUEVA VERSION
 * El libro se abre completamente y el formulario aparece
 */

document.addEventListener('DOMContentLoaded', function() {
  // Obtener el elemento del overlay de bienvenida
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  
  if (welcomeOverlay) {
    // Duración de la animación en milisegundos (4 segundos totales)
    const animationDuration = 4000;
    
    // Después de que termine la animación, ocultar el overlay
    setTimeout(function() {
      welcomeOverlay.classList.add('hidden');
      welcomeOverlay.style.display = 'none';
    }, animationDuration);
    

  }
  
  // Permitir que el usuario pueda saltarse la animación con click
  const overlay = document.getElementById('welcomeOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      // Click en cualquier parte del overlay salta la animación
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        
        // Mostrar inmediatamente el formulario
        const loginContainer = document.querySelector('.login-container');
        const registerContainer = document.querySelector('.register-container');
        
        if (loginContainer) {
          loginContainer.style.opacity = '1';
          loginContainer.style.animation = 'none';
        }
        if (registerContainer) {
          registerContainer.style.opacity = '1';
          registerContainer.style.animation = 'none';
        }
      }
    });
  }
});

