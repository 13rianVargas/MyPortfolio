function updateTextContent(element: Element, key: string, translations: Record<string, string>) {
    if (key && translations[key]) {
        element.textContent = translations[key];
    }
}

function updateAttribute(element: Element, key: string, attribute: string, translations: Record<string, string>) {
    if (key && translations[key]) {
        element.setAttribute(attribute, translations[key]);
    }
}

export function updateTranslations(translations: Record<string, string>) {
    document.querySelectorAll<HTMLElement>('[data-translation-key]').forEach(element => {
        const key = element.dataset.translationKey;
        if (key) {
            updateTextContent(element, key, translations);
        }
    });

    document.querySelectorAll<HTMLElement>('[data-translation-key-placeholder]').forEach(element => {
        const key = element.dataset.translationKeyPlaceholder;
        if (key) {
            updateAttribute(element, key, 'placeholder', translations);
        }
    });

    document.querySelectorAll<HTMLElement>('[data-translation-key-title]').forEach(element => {
        const key = element.dataset.translationKeyTitle;
        if (key) {
            updateAttribute(element, key, 'title', translations);
        }
    });
}

document.addEventListener('language-change', (event) => {
    const { translations } = (event as CustomEvent).detail;
    if (translations) {
        updateTranslations(translations);
    }
});
