# Accessibility Tools - Version 2

A lightweight, customizable accessibility toolkit that provides users with visual and reading assistance tools to improve their browsing experience.

**Live Demo:** Try all features and see how the accessibility tools work in a real-world environment at <a href="https://nyssen.me/tools/accessibility-toolkit/" target="_blank">https://nyssen.me/tools/accessibility-toolkit/</a>

## Overview

This accessibility widget offers a comprehensive set of tools designed to help users with various accessibility needs, including visual impairments, dyslexia, ADHD, motor difficulties, and more. The widget is fully keyboard-accessible, privacy-focused, and has minimal performance impact.

## Quick Start

### Installation

1. **Include the CSS file** in your HTML `<head>`:
   ```html
   <link rel="stylesheet" href="assets/css/accessibility-tools.css">
   ```

2. **Add the toggle button** (typically in your header). Its visible text is its accessible name, so don't add an `aria-label` that differs from it (WCAG 2.5.3 Label in Name):
   ```html
   <button
       class="accessibility-toggle-btn"
       type="button"
       aria-haspopup="dialog"
       aria-expanded="false"
       aria-controls="accessibility-panel">
       <span>Accessibility Tools</span>
   </button>
   ```

3. **Add the accessibility panel** (typically before closing `</body>`):
   ```html
   <div
       class="accessibility-widget-panel"
       id="accessibility-panel"
       role="dialog"
       aria-modal="true"
       aria-labelledby="accessibility-panel-title"
       aria-hidden="true"
       data-open="false">
       <h2 id="accessibility-panel-title">Accessibility Tools</h2>
       <!-- Panel content here -->
   </div>
   ```

4. **Include the JavaScript file**, either in the `<head>` with `defer` or before closing `</body>`:
   ```html
   <script src="assets/js/accessibility-tools.js" defer></script>
   ```

5. **Optional: avoid a flash of the wrong theme.** Saved settings are applied when the script runs, so a visitor who chose dark mode may briefly see the light theme first. To prevent this, add the small inline script from the `<head>` of [index.html](index.html) before your stylesheets. If your site uses a Content Security Policy, allow it with a hash or nonce.

### Complete Example

See [index.html](index.html) for a complete working example with all features implemented.

## Features

### Display Modes (4 options)

- **Light Mode** - Traditional bright background with dark text
- **Dark Mode** - Dark background with light text, reduces eye strain
- **High Contrast Mode** - Maximum text-to-background contrast
- **Greyscale Mode** - Removes all colors from the page

On first visit, the widget follows the user's device preferences: dark mode if `prefers-color-scheme: dark` is set, otherwise high contrast if `prefers-contrast: more` is set.

### Text Controls (3 options)

- **Normal Text Size** - Standard size as designed
- **Large Text Size** - Increases all text by 20%
- **Bold Text** - Increases all text by 20% (like Large Text Size) and makes all of it bold

### Visual Aids (4 toggles)

- **Large Cursor** - Increases cursor size approximately 3x
- **Highlight Links** - Adds yellow background and underline to all links
- **Hide Images** - Hides images and displays their alt text in their place (decorative images with an empty `alt` are simply hidden)
- **Reading Mask** - Creates a spotlight effect that highlights the current reading line, which can help users with dyslexia keep their place and read more comfortably. The clear band follows the mouse, touch, or keyboard focus

### Additional Features

- **Reset All Settings** - Returns all settings to defaults
- **Automatic Settings Persistence** - User preferences are saved to localStorage
- **Full Keyboard Accessibility** - All features are keyboard-navigable
- **Screen Reader Support** - The toggle button's accessible description lists the settings currently active, matching the visual marker on the button
- **Privacy-Focused** - All data stored locally, nothing sent to servers

## Performance

- Lightweight, with minimal impact on page load times: no dependencies and no network requests after the page loads
- Compressed file size: approximately 10KB (CSS and JavaScript, gzipped)
- Reading mask updates at 60 FPS for smooth movement
- Uses approximately 200 bytes of localStorage

## Browser Support

Works on all modern browsers:
- Chrome 80+
- Firefox 74+
- Safari 14+
- Edge 80+
- Opera 67+

Mobile support:
- iOS 14+
- Android (Chrome 80+)

In practice, any browser version released since late 2020.

## Who Benefits?

The widget helps users with:

- **Visual Impairments** - Large cursor, high contrast, large text, bold text, highlight links
- **Dyslexia** - Reading mask (often the most helpful), bold text, large text, high contrast
- **ADHD** - Reading mask, hide images, greyscale mode, dark mode
- **Light Sensitivity/Photophobia** - Dark mode, greyscale mode, reading mask
- **Motor Impairments** - Large cursor, highlight links, large text (all fully keyboard-accessible)
- **Cognitive Disabilities** - Reading mask, hide images, highlight links, high contrast
- **Color Blindness** - High contrast, greyscale, highlight links
- **Age-Related Vision Changes** - Large text, large cursor, high contrast, bold text
- **Fatigue and Eye Strain** - Dark mode, reading mask, large text, high contrast

## Documentation

### For End Users

See [USER-GUIDE.md](USER-GUIDE.md) for comprehensive documentation including:
- Detailed feature descriptions
- How to use each feature
- Who benefits from specific tools
- Troubleshooting guide
- Keyboard access instructions
- Privacy information

### For Developers

**Key Implementation Notes:**

1. The widget uses `localStorage` to persist user preferences
2. Theme preference detection uses the `prefers-color-scheme` and `prefers-contrast` media queries
3. All ARIA attributes are properly implemented for screen reader support. The radio groups use a roving `tabindex`, so `Tab` moves between groups and the arrow keys move within them
4. The reading mask uses mouse/touch position tracking with `requestAnimationFrame`, and follows keyboard focus via `focusin`
5. CSS classes are applied to the `<html>` element for global theme changes
6. "Hide Images" inserts a `<span class="img-alt-text" role="img">` after each image with alt text, and a `MutationObserver` labels images added later while the option is on
7. Supports Windows contrast themes (`forced-colors`), `prefers-reduced-motion`, and `prefers-contrast`

**Customization:**

You can customize the widget appearance by modifying `assets/css/accessibility-tools.css`. Key CSS custom properties and classes are well-documented in the stylesheet.

## File Structure

```
Accessibility-Toolkit/
├── README.md                           # This file
├── USER-GUIDE.md                       # End-user documentation
├── index.html                          # Demo/example implementation
├── favicon.ico
└── assets/
    ├── css/
    │   ├── accessibility-tools.css     # Main widget styles
    │   ├── milligram.css               # Demo page styles
    │   └── normalize.min.css           # Demo page CSS reset
    ├── js/
    │   └── accessibility-tools.js      # Main widget functionality
    └── images/
        └── img_5255.webp               # Demo image
```

## Important Notes

### What These Tools Do

These accessibility tools provide **visual customization options** to help users personalize their browsing experience. Users can adjust colors, text size, and visual elements to suit their preferences and needs.

### What These Tools Don't Replace

**Please note:** These tools are designed as a **supplement** to proper web accessibility, not a replacement. They:

- Do not fix underlying accessibility issues in the website
- Do not guarantee WCAG compliance
- Do not replace proper semantic HTML and accessible code

Continue to ensure your website is built with accessibility best practices from the ground up. These tools simply give users additional control over their viewing experience.

## Standards Compliance

Built following WCAG 2.2 Level AA guidelines with focus on:
- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader support
- Color contrast
- Semantic HTML

## Privacy

- All settings stored locally on user's device only
- No data collection or tracking of accessibility preferences
- No personal data sent to servers
- Settings remain completely private

## Support

For issues or questions about implementing the widget, refer to:
- [USER-GUIDE.md](USER-GUIDE.md) for feature documentation
- [index.html](index.html) for implementation examples

## License

Copyright © nyssen.me

---

**Version:** 2.0
**Last Updated:** 2026
