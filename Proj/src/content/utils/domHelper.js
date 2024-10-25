// src/content/utils/domHelper.js

export function findCaptionContainer() {
    return document.querySelector('[class*="caption-text"]');
}

export function areCaptionsVisible() {
    const captionContainer = findCaptionContainer();
    return captionContainer && captionContainer.innerText.trim().length > 0;
}

export function enableCaptions() {
    const captionsButton = document.querySelector('[aria-label="Turn on captions"]');
    if (captionsButton && !areCaptionsVisible()) {
        captionsButton.click();
    }
}
