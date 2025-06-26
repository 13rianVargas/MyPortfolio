// Tipos para eventos personalizados del tema
export interface ThemeEventDetail {
  mode?: 'dark' | 'light' | 'auto' | 'toggle';
}

export interface ThemeEvent extends CustomEvent<ThemeEventDetail> {
  detail: ThemeEventDetail;
}

// Interface para el theme manager
export interface ThemeManager {
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  getCurrentTheme: () => 'dark' | 'light';
  getSavedTheme: () => string | null;
  getSystemPreference: () => boolean;
}

// Extender la interfaz global de Window para incluir nuestros eventos personalizados y el theme manager
declare global {
  interface WindowEventMap {
    'basecoat:theme': ThemeEvent;
  }
  
  interface Window {
    themeManager?: ThemeManager;
  }
}
