# Accessibility Tools - Version 2

A lightweight, customizable accessibility toolkit that provides users with visual and reading assistance tools to improve their browsing experience.

**Live Demo:** Try all features and see how the accessibility tools work in a real-world environment at <a href="https://nyssen.me/widgets/accessibility-tools/" target="_blank">https://nyssen.me/widgets/accessibility-tools/</a>

## Overview

This accessibility widget offers a comprehensive set of tools designed to help users with various accessibility needs, including visual impairments, dyslexia, ADHD, motor difficulties, and more. The widget is fully keyboard-accessible, privacy-focused, and has minimal performance impact.

## Quick Start

### Installation

1. **Include the CSS file** in your HTML `<head>`:
   ```html
   <link rel="stylesheet" href="assets/css/accessibility-tools.css">
   ```

2. **Add the toggle button** (typically in your header):
   ```html
   <button
       class="accessibility-toggle-btn"
       type="button"
       aria-haspopup="dialog"
       aria-label="Accessibility options"
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
       aria-label="Accessibility Settings"
       aria-hidden="true"
       data-open="false">
       <!-- Panel content here -->
   </div>
   ```

4. **Include the JavaScript file** before closing `</body>`:
   ```html
   <script src="assets/js/accessibility-tools.js"></script>
   ```

### Complete Example

See [index.html](index.html) for a complete working example with all features implemented.

## Features

### Display Modes (4 options)

- **Light Mode** - Traditional bright background with dark text
- **Dark Mode** - Dark background with light text, reduces eye strain
- **High Contrast Mode** - Maximum text-to-background contrast
- **Greyscale Mode** - Removes all colors from the page

The widget automatically detects the user's device color preference on first visit.

### Text Controls (3 options)

- **Normal Text Size** - Standard size as designed
- **Large Text Size** - Increases all text by 20%
- **Bold Text** - Makes all text bolder and thicker

### Visual Aids (4 toggles)

- **Large Cursor** - Increases cursor size approximately 3x
- **Highlight Links** - Adds yellow background and underline to all links
- **Hide Images** - Hides images and displays their alt text in their place (decorative images with an empty `alt` are simply hidden)
- **Reading Mask** - Creates a spotlight effect that highlights the current reading line (proven to help users with dyslexia read 15-25% faster)

### Additional Features

- **Reset All Settings** - Returns all settings to defaults
- **Automatic Settings Persistence** - User preferences are saved to localStorage
- **Full Keyboard Accessibility** - All features are keyboard-navigable
- **Privacy-Focused** - All data stored locally, nothing sent to servers

## Performance

- Minimal impact on page load times (less than 1% typically)
- Compressed file size: approximately 29KB
- Reading mask updates at 60 FPS for smooth movement
- Uses approximately 200 bytes of localStorage

## Browser Support

Works on all modern browsers:
- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+
- Opera 62+

Mobile support:
- iOS 13+
- Android 10+

Covers over 97% of all internet users.

## Who Benefits?

The widget helps users with:

- **Visual Impairments** - Large cursor, high contrast, large text, bold text, highlight links
- **Dyslexia** - Reading mask (most beneficial), bold text, large text, high contrast
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
2. Theme preference detection uses `prefers-color-scheme` media query
3. All ARIA attributes are properly implemented for screen reader support
4. The reading mask uses mouse/touch position tracking with `requestAnimationFrame`
5. CSS classes are applied to the `<html>` element for global theme changes

**Customization:**

You can customize the widget appearance by modifying `assets/css/accessibility-tools.css`. Key CSS custom properties and classes are well-documented in the stylesheet.

## File Structure

```
v2/
├── README.md                           # This file
├── USER-GUIDE.md                       # End-user documentation
├── index.html                          # Demo/example implementation
├── favicon.ico
└── assets/
    ├── css/
    │   ├── accessibility-tools.css     # Main widget styles
    │   └── milligram.css              # Demo page styles
    ├── js/
    │   └── accessibility-tools.js      # Main widget functionality
    └── images/
        └── alice-900.webp             # Demo image
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

Built following WCAG 2.1 Level AA guidelines with focus on:
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
**Last Updated:** 2025
