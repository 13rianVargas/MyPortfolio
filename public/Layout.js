document.addEventListener('DOMContentLoaded', () => {
    const toggleLangButton = document.getElementById('toggle-lang');
    const langLabel = document.getElementById('lang-label');
    const translationsData = document.getElementById('translations-data');
    const translations = JSON.parse(translationsData.textContent);

    let currentLang = document.documentElement.lang;

    const updateTexts = (lang) => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const keys = key.split('.');
            let translation = translations[lang];
            for (const k of keys) {
                if (translation && typeof translation === 'object' && k in translation) {
                    translation = translation[k];
                } else {
                    translation = key; // Fallback to key if not found
                    break;
                }
            }
            el.textContent = translation;
        });
        document.title = translations[lang].head.title;
    };

    toggleLangButton.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        document.documentElement.lang = currentLang;
        langLabel.textContent = currentLang === 'en' ? 'ES' : 'EN';
        updateTexts(currentLang);
    });
});
