function setText(element: Element, key: string, translations: Record<string, string>) {
    if (key && translations[key]) {
        element.textContent = translations[key];
    }
}

function setAttr(
    element: Element,
    key: string,
    attribute: string,
    translations: Record<string, string>,
) {
    if (key && translations[key]) {
        element.setAttribute(attribute, translations[key]);
    }
}

export function updateTranslations(translations: Record<string, string>) {
    document.querySelectorAll<HTMLElement>('[data-translation-key]').forEach((element) => {
        const key = element.dataset.translationKey;
        if (key) setText(element, key, translations);
    });

    document
        .querySelectorAll<HTMLElement>('[data-translation-key-placeholder]')
        .forEach((element) => {
            const key = element.dataset.translationKeyPlaceholder;
            if (key) setAttr(element, key, 'placeholder', translations);
        });

    document.querySelectorAll<HTMLElement>('[data-translation-key-title]').forEach((element) => {
        const key = element.dataset.translationKeyTitle;
        if (key) setAttr(element, key, 'title', translations);
    });
}

document.addEventListener('language-change', (event) => {
    const { lang, translations } = (event as CustomEvent).detail ?? {};
    if (!translations) return;

    updateTranslations(translations);

    // Keep the document in sync with what is actually on screen. Without this
    // <html lang> stayed "en" no matter the selection, so screen readers read
    // Spanish copy with an English voice.
    if (lang) document.documentElement.setAttribute('lang', lang);

    if (translations['head.title']) document.title = translations['head.title'];

    const description = document.querySelector('meta[name="description"]');
    if (description && translations['head.description']) {
        description.setAttribute('content', translations['head.description']);
    }
});
