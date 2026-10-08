/**
 * Accessible Widget Controller
 * WCAG 2.1 AA Compliant
 */

// Utility: Shared keyboard navigation for radio groups
const handleRadioKeyNav = (e, buttons) => {
    const buttonsArray = Array.from(buttons);
    const currentIndex = buttonsArray.indexOf(e.currentTarget);
    let nextIndex = null;

    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            nextIndex = (currentIndex + 1) % buttonsArray.length;
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            nextIndex = (currentIndex - 1 + buttonsArray.length) % buttonsArray.length;
            break;
        case 'Home':
            e.preventDefault();
            nextIndex = 0;
            break;
        case 'End':
            e.preventDefault();
            nextIndex = buttonsArray.length - 1;
            break;
    }

    if (nextIndex !== null) {
        buttonsArray[nextIndex].focus();
        buttonsArray[nextIndex].click();
    }
};

// Utility: LocalStorage helper
const storage = {
    get: (key, defaultValue = null) => {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (e) {
            console.warn(`Failed to load ${key}:`, e);
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn(`Failed to save ${key}:`, e);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn(`Failed to remove ${key}:`, e);
        }
    }
};

class AccessibilityWidgetController {
    constructor(options = {}) {
        // Configuration
        this.toggleButtonSelector = options.toggleButton || '.accessibility-toggle-btn';
        this.panelSelector = options.panel || '.accessibility-widget-panel';
        this.backdropSelector = options.backdrop || '.accessibility-widget-backdrop';

        // Elements
        this.toggleButtons = document.querySelectorAll(this.toggleButtonSelector);
        this.panel = document.querySelector(this.panelSelector);
        this.backdrop = document.querySelector(this.backdropSelector);

        // State
        this.isOpen = false;
        this.focusedElementBeforeOpen = null;
        this.focusableElements = [];

        // Validate required elements
        if (this.toggleButtons.length === 0 || !this.panel) {
            console.error('AccessibilityWidget: Required elements not found');
            return;
        }

        // Bind methods
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.init();
    }

    init() {
        this.updateFocusableElements();

        // Toggle buttons
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggle());
        });

        // Close button
        const closeButton = this.panel.querySelector('.widget-close-btn');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }

        // Backdrop
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }

        this.initActiveSettingsStatus();
    }

    /**
     * The "settings active" marker on the toggle button is CSS-only, so expose the same
     * information to assistive technology as the button's accessible description.
     * Watches the <html> attributes the marker's CSS uses, so the two never disagree.
     */
    initActiveSettingsStatus() {
        // `hidden` keeps it out of the reading order; aria-describedby still reads hidden elements
        this.statusElement = document.createElement('span');
        this.statusElement.id = 'accessibility-active-settings';
        this.statusElement.hidden = true;
        document.body.appendChild(this.statusElement);

        this.toggleButtons.forEach(button => {
            const ids = (button.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
            if (!ids.includes(this.statusElement.id)) ids.push(this.statusElement.id);
            button.setAttribute('aria-describedby', ids.join(' '));
        });

        this.updateActiveSettingsStatus();

        new MutationObserver(() => this.updateActiveSettingsStatus()).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-selected-font', 'data-cursor', 'data-links', 'data-images', 'data-reading-mask']
        });
    }

    updateActiveSettingsStatus() {
        const root = document.documentElement;
        const settings = [
            [root.classList.contains('dark-theme'), 'Dark mode'],
            [root.classList.contains('high-contrast'), 'High contrast'],
            [root.classList.contains('greyscale'), 'Greyscale'],
            [root.dataset.selectedFont === 'large', 'Large text'],
            [root.dataset.selectedFont === 'bold', 'Bold text'],
            [root.dataset.cursor === 'big-cursor', 'Large cursor'],
            [root.dataset.links === 'highlight', 'Highlight links'],
            [root.dataset.images === 'images-hidden', 'Hide images'],
            [root.dataset.readingMask === 'active', 'Reading mask']
        ];

        const active = settings.filter(([isOn]) => isOn).map(([, label]) => label);
        const text = active.length ? `Active settings: ${active.join(', ')}` : '';

        if (this.statusElement.textContent !== text) {
            this.statusElement.textContent = text;
        }
    }

    updateFocusableElements() {
        if (!this.panel) return;

        const focusableSelectors = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        this.focusableElements = Array.from(this.panel.querySelectorAll(focusableSelectors));
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.focusedElementBeforeOpen = document.activeElement;

        // Update ARIA and visibility
        this.toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'true'));
        this.panel.setAttribute('aria-hidden', 'false');
        this.panel.setAttribute('data-open', 'true');

        if (this.backdrop) {
            this.backdrop.setAttribute('aria-hidden', 'false');
            this.backdrop.style.display = 'block';
        }

        // Attach document listeners only when open
        document.addEventListener('click', this.handleClickOutside);
        document.addEventListener('keydown', this.handleKeyDown);

        // Focus management
        if (this.focusableElements[0]) {
            setTimeout(() => this.focusableElements[0].focus(), 100);
        }
    }

    close() {
        this.isOpen = false;

        // Update ARIA and visibility
        this.toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
        this.panel.setAttribute('aria-hidden', 'true');
        this.panel.setAttribute('data-open', 'false');

        if (this.backdrop) {
            this.backdrop.setAttribute('aria-hidden', 'true');
            this.backdrop.style.display = 'none';
        }

        // Remove document listeners when closed
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleKeyDown);

        // Return focus
        if (this.focusedElementBeforeOpen && this.focusedElementBeforeOpen.focus) {
            this.focusedElementBeforeOpen.focus();
        } else {
            const visibleButton = Array.from(this.toggleButtons).find(btn => btn.offsetParent !== null);
            if (visibleButton) visibleButton.focus();
        }
    }

    handleClickOutside(e) {
        // Use closest() for efficient check
        if (e.target.closest(this.panelSelector) || e.target.closest(this.toggleButtonSelector)) {
            return;
        }
        this.close();
    }

    handleKeyDown(e) {
        // Escape key
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
            return;
        }

        // Tab key - trap focus within panel
        if (e.key === 'Tab' && this.focusableElements.length > 0) {
            const first = this.focusableElements[0];
            const last = this.focusableElements[this.focusableElements.length - 1];

            if (this.focusableElements.length === 1) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
}


/**
 * Theme Manager - Display Modes (Light, Dark, Contrast, Greyscale)
 */
class ThemeManager {
    constructor() {
        this.storageKey = 'accessibility-theme';
        this.buttons = document.querySelectorAll('.theme-button');

        if (this.buttons.length === 0) return;

        this.init();
    }

    init() {
        // Load saved theme or detect system preference
        const savedTheme = storage.get(this.storageKey);
        this.applyTheme(savedTheme || this.detectSystemTheme());

        // Watch for system theme changes only if no manual preference
        if (!savedTheme) this.watchSystemTheme();

        // Bind events
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleThemeChange(e));
            button.addEventListener('keydown', (e) => handleRadioKeyNav(e, this.buttons));
        });
    }

    detectSystemTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark-theme';
        }
        if (window.matchMedia('(prefers-contrast: more)').matches) {
            return 'high-contrast';
        }
        return 'light-theme';
    }

    watchSystemTheme() {
        const handleChange = (query, darkTheme, lightTheme) => {
            query.addEventListener('change', (e) => {
                if (!storage.get(this.storageKey)) {
                    this.applyTheme(e.matches ? darkTheme : lightTheme);
                }
            });
        };

        handleChange(window.matchMedia('(prefers-color-scheme: dark)'), 'dark-theme', 'light-theme');
        handleChange(window.matchMedia('(prefers-contrast: more)'), 'high-contrast', 'light-theme');
    }

    handleThemeChange(e) {
        const theme = e.currentTarget.dataset.theme;
        if (!theme) return;

        const themeMap = {
            'light': 'light-theme',
            'dark': 'dark-theme',
            'contrast': 'high-contrast',
            'greyscale': 'greyscale'
        };

        const themeClass = themeMap[theme] || 'light-theme';
        this.applyTheme(themeClass);
        storage.set(this.storageKey, themeClass);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        root.className = root.className.replace(/\b(light-theme|dark-theme|high-contrast|greyscale)\b/g, '');
        root.classList.add(theme);

        // Update system preference badge visibility
        const systemBadge = document.getElementById('theme-system-badge');
        if (systemBadge) {
            systemBadge.style.display = storage.get(this.storageKey) ? 'none' : 'inline-flex';
        }

        // Update aria-checked states (roving tabindex: only the checked radio is in the tab order)
        const themeMap = {
            'light-theme': 'light',
            'dark-theme': 'dark',
            'high-contrast': 'contrast',
            'greyscale': 'greyscale'
        };

        this.buttons.forEach(button => {
            const isChecked = button.dataset.theme === themeMap[theme];
            button.setAttribute('aria-checked', isChecked ? 'true' : 'false');
            button.setAttribute('tabindex', isChecked ? '0' : '-1');
        });
    }
}


/**
 * Font Manager - Text Controls (Normal, Large, Bold)
 */
class FontManager {
    constructor() {
        this.storageKey = 'accessibility-font';
        this.buttons = document.querySelectorAll('[data-font]');

        if (this.buttons.length === 0) return;

        this.init();
    }

    init() {
        // Load saved font
        this.applyFont(storage.get(this.storageKey, 'normal'));

        // Bind events
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFontChange(e));
            button.addEventListener('keydown', (e) => handleRadioKeyNav(e, this.buttons));
        });
    }

    handleFontChange(e) {
        const font = e.currentTarget.dataset.font;
        if (font) {
            this.applyFont(font);
            storage.set(this.storageKey, font);
        }
    }

    applyFont(font) {
        document.documentElement.setAttribute('data-selected-font', font);

        // Update aria-checked states (roving tabindex: only the checked radio is in the tab order)
        this.buttons.forEach(button => {
            const isChecked = button.dataset.font === font;
            button.setAttribute('aria-checked', isChecked ? 'true' : 'false');
            button.setAttribute('tabindex', isChecked ? '0' : '-1');
        });
    }
}


/**
 * Visual Aid Toggle Manager (Cursor, Links, Images)
 */
class VisualAidManager {
    constructor(options) {
        this.storageKey = `accessibility-${options.type}`;
        this.button = document.querySelector(options.selector);
        this.attribute = options.attribute;
        this.activeValue = options.activeValue;
        this.inactiveValue = options.inactiveValue;
        this.onChange = options.onChange || null;

        if (!this.button) return;

        // Load saved state and apply
        this.setState(storage.get(this.storageKey) === 'active');

        // Bind events
        this.button.addEventListener('click', () => this.toggle());
    }

    toggle() {
        const isActive = document.documentElement.getAttribute(this.attribute) === this.inactiveValue;
        this.setState(isActive);
        storage.set(this.storageKey, isActive ? 'active' : 'inactive');
    }

    setState(isActive) {
        document.documentElement.setAttribute(this.attribute, isActive ? this.activeValue : this.inactiveValue);
        this.button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (this.onChange) this.onChange(isActive);
    }
}


/**
 * Image Alt Text Manager
 * Adds a visible text stand-in after each image, shown by CSS while "Hide Images" is on.
 * Only one of the image and its label is displayed at a time, so screen readers never
 * hear the description twice, and image-only links keep their accessible name.
 */
class ImageAltTextManager {
    constructor() {
        this.labelClass = 'img-alt-text';
        this.observer = null;
    }

    enable() {
        this.addLabels(document.body);

        // Label images added later (carousels, lazy-loaded content) while the option is on
        if (!this.observer && 'MutationObserver' in window) {
            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) this.addLabels(node);
                    });
                });
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    disable() {
        // Labels stay in the DOM (hidden by CSS) so re-enabling is instant
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    addLabels(root) {
        const images = root.matches('img') ? [root] : root.querySelectorAll('img');
        images.forEach(img => this.addLabel(img));
    }

    addLabel(img) {
        if (img.dataset.altLabel || img.closest('.accessibility-widget-panel')) return;

        // Empty or missing alt: decorative (or undescribed), so it is just hidden
        const alt = (img.getAttribute('alt') || '').trim();
        if (!alt) return;

        img.dataset.altLabel = 'true';

        const label = document.createElement('span');
        label.className = this.labelClass;
        label.setAttribute('role', 'img');
        label.setAttribute('aria-label', alt);
        label.textContent = `Image: ${alt}`;
        img.insertAdjacentElement('afterend', label);
    }
}


/**
 * Reading Mask Manager
 * Creates a focus overlay that follows the cursor to help with reading
 */
class ReadingMaskManager {
    constructor() {
        this.storageKey = 'accessibility-reading-mask';
        this.button = document.querySelector('.js__reading-mask-toggle');
        this.isActive = false;
        this.maskHeight = 100;
        this.rafId = null;
        this.currentY = window.innerHeight / 2;

        if (!this.button) return;

        this.createMask();

        // Load saved state
        if (storage.get(this.storageKey) === 'active') {
            this.activate();
        }

        // Bind events
        this.button.addEventListener('click', () => this.toggle());
    }

    createMask() {
        this.maskElement = document.createElement('div');
        this.maskElement.className = 'reading-mask';
        this.maskElement.setAttribute('aria-hidden', 'true');
        this.maskElement.style.display = 'none';
        this.maskElement.innerHTML = `
            <div class="reading-mask-top"></div>
            <div class="reading-mask-line"></div>
            <div class="reading-mask-bottom"></div>
        `;
        document.body.appendChild(this.maskElement);

        // Store references
        [this.topMask, this.readingLine, this.bottomMask] = this.maskElement.children;
    }

    toggle() {
        this.isActive ? this.deactivate() : this.activate();
    }

    activate() {
        this.isActive = true;
        this.maskElement.style.display = 'block';
        this.button.setAttribute('aria-pressed', 'true');
        document.documentElement.setAttribute('data-reading-mask', 'active');

        // Bind events with arrow functions to preserve context
        this.handleMove = (e) => {
            this.currentY = e.touches ? e.touches[0].clientY : e.clientY;
            if (!this.rafId) {
                this.rafId = requestAnimationFrame(() => {
                    this.updateMaskPosition(this.currentY);
                    this.rafId = null;
                });
            }
        };

        // Keyboard users: move the band to whatever receives focus, so the focused
        // element is never left under the dimmed part of the screen
        this.handleFocus = (e) => this.moveToElement(e.target);

        document.addEventListener('mousemove', this.handleMove);
        document.addEventListener('touchmove', this.handleMove);
        document.addEventListener('focusin', this.handleFocus);

        // Initial position: on the focused element if activated from the keyboard
        const focused = document.activeElement;
        if (focused && focused !== document.body && focused.matches(':focus-visible')) {
            this.moveToElement(focused);
        } else {
            this.updateMaskPosition(this.currentY);
        }
        storage.set(this.storageKey, 'active');
    }

    moveToElement(element) {
        const rect = element.getBoundingClientRect();
        this.currentY = rect.top + rect.height / 2;
        this.updateMaskPosition(this.currentY);
    }

    deactivate() {
        this.isActive = false;
        this.maskElement.style.display = 'none';
        this.button.setAttribute('aria-pressed', 'false');
        document.documentElement.setAttribute('data-reading-mask', 'inactive');

        document.removeEventListener('mousemove', this.handleMove);
        document.removeEventListener('touchmove', this.handleMove);
        document.removeEventListener('focusin', this.handleFocus);

        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        storage.set(this.storageKey, 'inactive');
    }

    updateMaskPosition(mouseY) {
        const halfHeight = this.maskHeight / 2;
        const topHeight = Math.max(0, mouseY - halfHeight);
        const bottomTop = mouseY + halfHeight;

        this.topMask.style.height = `${topHeight}px`;
        this.readingLine.style.top = `${topHeight}px`;
        this.readingLine.style.height = `${this.maskHeight}px`;
        this.bottomMask.style.top = `${bottomTop}px`;
        this.bottomMask.style.height = `calc(100vh - ${bottomTop}px)`;
    }
}


/**
 * Reset Manager
 */
class ResetManager {
    constructor(managers) {
        this.managers = managers;
        this.button = document.getElementById('resetButton');

        if (!this.button) return;

        // Live region must already exist in the DOM before its text changes, or screen readers may
        // miss it. Placed inside the panel so it is not hidden by aria-modal.
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('role', 'status');
        this.liveRegion.className = 'sr-only';
        this.button.insertAdjacentElement('afterend', this.liveRegion);

        this.button.addEventListener('click', () => this.resetAll());
    }

    resetAll() {
        // Clear all localStorage keys
        ['theme', 'font', 'cursor', 'links', 'images', 'reading-mask'].forEach(key =>
            storage.remove(`accessibility-${key}`)
        );

        // Reset to defaults
        const root = document.documentElement;
        root.className = root.className.replace(/\b(dark-theme|high-contrast|greyscale)\b/g, '');
        root.classList.add('light-theme');
        root.setAttribute('data-selected-font', 'normal');
        root.setAttribute('data-cursor', 'normal-cursor');
        root.setAttribute('data-links', 'no-highlight');
        root.setAttribute('data-images', 'images-mode');
        root.setAttribute('data-reading-mask', 'inactive');

        // Update UI states
        this.managers.theme?.applyTheme('light-theme');
        this.managers.font?.applyFont('normal');
        this.managers.cursor?.setState(false);
        this.managers.links?.setState(false);
        this.managers.images?.setState(false);
        if (this.managers.readingMask?.isActive) {
            this.managers.readingMask.deactivate();
        }

        // Announce to screen readers (cleared first so repeated resets are announced again)
        this.liveRegion.textContent = '';
        setTimeout(() => {
            this.liveRegion.textContent = 'All accessibility settings have been reset to defaults';
        }, 100);
    }
}


/**
 * Initialize All Managers
 */
function initAccessibilityWidget() {
    // Initialize widget controller
    const widgetController = new AccessibilityWidgetController({
        toggleButton: '.accessibility-toggle-btn',
        panel: '.accessibility-widget-panel',
        backdrop: '.accessibility-widget-backdrop'
    });
    
    // Initialize feature managers
    const imageAltText = new ImageAltTextManager();
    const managers = {
        theme: new ThemeManager(),
        font: new FontManager(),
        cursor: new VisualAidManager({
            type: 'cursor',
            selector: '.js__cursor-toggle',
            attribute: 'data-cursor',
            activeValue: 'big-cursor',
            inactiveValue: 'normal-cursor'
        }),
        links: new VisualAidManager({
            type: 'links',
            selector: '.js__links-toggle',
            attribute: 'data-links',
            activeValue: 'highlight',
            inactiveValue: 'no-highlight'
        }),
        images: new VisualAidManager({
            type: 'images',
            selector: '.js__images-toggle',
            attribute: 'data-images',
            activeValue: 'images-hidden',
            inactiveValue: 'images-mode',
            onChange: (isActive) => isActive ? imageAltText.enable() : imageAltText.disable()
        }),
        readingMask: new ReadingMaskManager()
    };
    
    // Initialize reset manager
    new ResetManager(managers);
    
    return { widgetController, managers };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibilityWidget);
} else {
    initAccessibilityWidget();
}
