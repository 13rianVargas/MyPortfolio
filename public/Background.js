(function() {
  function createRipple(x, y) {
    const container = document.getElementById('ripples-container');
    if (!container) return;
    
    const spawnRing = (delay) => {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        // Tamaño del ripple basado en el viewport
        const size = Math.max(window.innerWidth, window.innerHeight) * 0.6;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        container.appendChild(ripple);

        // Remover el elemento después de la animación
        setTimeout(function() {
          if (ripple.parentNode) {
            ripple.remove();
          }
        }, 2000);
      }, delay);
    };

    // Crear 1 onda para efecto de agua más limpio
    spawnRing(0);
  }

  function handleClick(e) {
    const target = e.target;
    
    // Lista de selectores de elementos interactivos
    const interactiveSelectors = 'button, a, input, textarea, select, [role="button"], .business-card, .card-container, .card-front, .card-back, .flip-hint, nav, header, footer, .scene, .profile-photo, img, svg, path, .glass-container';
    
    // Verificar si el click fue en un elemento interactivo
    if (target.closest && target.closest(interactiveSelectors)) {
      return;
    }

    createRipple(e.pageX, e.pageY);
  }

  // Usar setTimeout para asegurar que el DOM esté listo
  setTimeout(function() {
    // Remover listener previo si existe
    document.removeEventListener('click', handleClick);
    document.addEventListener('click', handleClick);
  }, 100);
})();
