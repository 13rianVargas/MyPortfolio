(() => {
  'use strict';
  
  console.log('Theme script loaded');
  
  // Constantes para los temas
  const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
    AUTO: 'auto'
  };
  
  const STORAGE_KEY = 'themeMode';
  const DARK_CLASS = 'dark';
  const THEME_EVENT = 'basecoat:theme';

  // Función para aplicar el tema
  const applyTheme = (isDark) => {
    console.log('Applying theme, isDark:', isDark);
    const htmlElement = document.documentElement;
    const shouldBeDark = Boolean(isDark);
    
    htmlElement.classList.toggle(DARK_CLASS, shouldBeDark);
    console.log('HTML classes after toggle:', htmlElement.className);
    
    try {
      localStorage.setItem(STORAGE_KEY, shouldBeDark ? THEMES.DARK : THEMES.LIGHT);
      console.log('Theme saved to localStorage:', shouldBeDark ? THEMES.DARK : THEMES.LIGHT);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de tema:', error);
    }
  };

  // Función para obtener el tema guardado
  const getSavedTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.warn('No se pudo acceder al localStorage:', error);
      return null;
    }
  };

  // Función para detectar preferencia del sistema
  const getSystemPreference = () => {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.warn('No se pudo detectar la preferencia del sistema:', error);
      return false;
    }
  };

  // Inicializar tema
  const initializeTheme = () => {
    console.log('Initializing theme...');
    const savedTheme = getSavedTheme();
    console.log('Saved theme:', savedTheme);
    const systemPrefersDark = getSystemPreference();
    console.log('System prefers dark:', systemPrefersDark);
    const shouldUseDark = savedTheme ? savedTheme === THEMES.DARK : systemPrefersDark;
    console.log('Should use dark on init:', shouldUseDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add(DARK_CLASS);
      console.log('Added dark class to HTML element');
    }
  };

  // Manejar eventos de cambio de tema
  const handleThemeChange = (event) => {
    console.log('Theme change event received:', event);
    const mode = event.detail?.mode;
    console.log('Event mode:', mode);
    const currentlyDark = document.documentElement.classList.contains(DARK_CLASS);
    console.log('Currently dark:', currentlyDark);
    
    let shouldBeDark;
    
    switch (mode) {
      case THEMES.DARK:
        shouldBeDark = true;
        break;
      case THEMES.LIGHT:
        shouldBeDark = false;
        break;
      case THEMES.AUTO:
        shouldBeDark = getSystemPreference();
        break;
      default:
        // Toggle mode (default behavior)
        shouldBeDark = !currentlyDark;
        break;
    }
    
    console.log('Should be dark:', shouldBeDark);
    applyTheme(shouldBeDark);
  };

  // Manejar cambios en las preferencias del sistema
  const handleSystemPreferenceChange = (event) => {
    const savedTheme = getSavedTheme();
    // Solo aplicar preferencias del sistema si no hay tema guardado o está en modo auto
    if (!savedTheme || savedTheme === THEMES.AUTO) {
      applyTheme(event.matches);
    }
  };

  // Inicializar
  console.log('About to initialize theme...');
  initializeTheme();

  // Agregar listeners
  console.log('Adding event listeners...');
  document.addEventListener(THEME_EVENT, handleThemeChange);
  console.log('Theme event listener added');
  
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // Usar el método más moderno si está disponible
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemPreferenceChange);
    } else {
      // Fallback para navegadores más antiguos
      mediaQuery.addListener(handleSystemPreferenceChange);
    }
  } catch (error) {
    console.warn('No se pudo configurar el listener para cambios del sistema:', error);
  }

  // Exponer funciones útiles globalmente (opcional)
  window.themeManager = {
    setTheme: (theme) => {
      document.dispatchEvent(new CustomEvent(THEME_EVENT, {
        detail: { mode: theme }
      }));
    },
    getCurrentTheme: () => {
      return document.documentElement.classList.contains(DARK_CLASS) ? THEMES.DARK : THEMES.LIGHT;
    },
    getSavedTheme,
    getSystemPreference
  };
})();
