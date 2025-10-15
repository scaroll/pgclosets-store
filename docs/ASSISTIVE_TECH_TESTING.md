# Assistive Technology Testing Guide

## Overview

This guide provides comprehensive testing procedures for verifying PG Closets accessibility with various assistive technologies.

---

## Screen Reader Testing

### NVDA (Windows)

**Version**: Latest stable release
**Browser**: Chrome or Firefox

#### Setup

1. Download NVDA from [nvaccess.org](https://www.nvaccess.org)
2. Install and launch NVDA
3. Press `Insert + N` to open NVDA menu
4. Navigate to Preferences > Settings > Speech to configure voice

#### Testing Procedures

##### Basic Navigation
- **Browse Mode**: Use arrow keys to navigate by line
- **Focus Mode**: Press `Insert + Space` to switch modes
- **Headings**: Press `H` to jump between headings
- **Landmarks**: Press `D` to jump between landmarks
- **Links**: Press `K` to jump between links
- **Forms**: Press `F` to jump to form fields

##### Key Shortcuts
- `Insert + Down Arrow` - Read all
- `Insert + T` - Read window title
- `Insert + B` - Read status bar
- `Insert + F7` - Elements list (headings, links, landmarks)
- `Ctrl` - Stop speech

#### Test Checklist

- [ ] Page title announces correctly
- [ ] Headings create logical structure
- [ ] Landmarks identify page regions
- [ ] Form fields have labels
- [ ] Buttons and links have accessible names
- [ ] Images have appropriate alt text
- [ ] Dynamic content announces via live regions
- [ ] Focus order is logical
- [ ] Error messages are announced
- [ ] Loading states are announced

---

### JAWS (Windows)

**Version**: Latest stable release
**Browser**: Chrome, Edge, or Firefox

#### Setup

1. Purchase and install JAWS from [freedomscientific.com](https://www.freedomscientific.com/products/software/jaws/)
2. Launch JAWS
3. Configure voice settings in JAWS Settings Center

#### Testing Procedures

##### Basic Navigation
- **Virtual Cursor**: Use arrow keys (PC cursor must be off)
- **Headings**: Press `H` to jump between headings
- **Landmarks**: Press `R` to jump between regions
- **Links**: Press `Insert + F7` for links list
- **Forms Mode**: JAWS enters automatically on form fields

##### Key Shortcuts
- `Insert + Down Arrow` - Say all
- `Insert + F` - List forms
- `Insert + Ctrl + F` - List frames
- `Insert + F5` - Form field list
- `Insert + T` - Read window title

#### Test Checklist

- [ ] Virtual cursor navigation works smoothly
- [ ] Forms mode activates properly
- [ ] Tables are announced with row/column headers
- [ ] ARIA roles and properties are recognized
- [ ] Custom widgets behave as expected
- [ ] Modal dialogs trap focus correctly
- [ ] Keyboard shortcuts don't conflict with JAWS

---

### VoiceOver (macOS)

**Version**: Built-in, latest macOS
**Browser**: Safari (recommended)

#### Setup

1. Enable VoiceOver: System Preferences > Accessibility > VoiceOver
2. Press `Cmd + F5` to toggle VoiceOver on/off
3. Open VoiceOver Utility for advanced settings

#### Testing Procedures

##### Basic Navigation
- **VoiceOver Cursor**: Use `Ctrl + Option + Arrow keys`
- **Web Rotor**: Press `Ctrl + Option + U` to open rotor
- **Headings**: In rotor, select headings and use arrow keys
- **Landmarks**: In rotor, select landmarks
- **Quick Nav**: Press left/right arrow keys with Quick Nav on

##### Key Shortcuts
- `Ctrl + Option + A` - Read all
- `Ctrl + Option + W` - Read window title
- `Ctrl + Option + H H` - Open VoiceOver Help
- `Ctrl + Option + Cmd + H` - Jump to next heading
- `Ctrl + Option + Cmd + L` - Jump to next link

#### Test Checklist

- [ ] Rotor lists all headings, landmarks, links
- [ ] Quick Nav navigation works smoothly
- [ ] Form fields are properly labeled
- [ ] Custom controls work with VoiceOver
- [ ] Notifications are announced
- [ ] Modal dialogs are accessible
- [ ] Keyboard focus is visible

---

### VoiceOver (iOS)

**Version**: Built-in, latest iOS
**Browser**: Safari

#### Setup

1. Enable VoiceOver: Settings > Accessibility > VoiceOver
2. Triple-click home button (or side button) to toggle
3. Adjust speaking rate in VoiceOver settings

#### Testing Procedures

##### Basic Gestures
- **Swipe right** - Next item
- **Swipe left** - Previous item
- **Double tap** - Activate item
- **Two-finger swipe up** - Read all
- **Rotor**: Rotate two fingers to change navigation mode

##### Testing Focus

- [ ] All interactive elements are focusable
- [ ] Swipe gestures navigate in logical order
- [ ] Form fields are properly labeled
- [ ] Buttons have descriptive labels
- [ ] Images have alt text
- [ ] Dynamic updates are announced
- [ ] Modal dialogs trap focus

---

### TalkBack (Android)

**Version**: Built-in, latest Android
**Browser**: Chrome

#### Setup

1. Enable TalkBack: Settings > Accessibility > TalkBack
2. Confirm activation in dialog
3. Use volume key shortcut to toggle

#### Testing Procedures

##### Basic Gestures
- **Swipe right** - Next item
- **Swipe left** - Previous item
- **Double tap** - Activate item
- **Swipe down then right** - Read from top
- **Local context menu**: Swipe up then right

##### Testing Focus

- [ ] Linear navigation follows logical order
- [ ] All buttons and links are announced
- [ ] Form fields have labels
- [ ] Images have descriptions
- [ ] Expandable sections work correctly
- [ ] Custom gestures have alternatives

---

## Keyboard Navigation Testing

### Full Keyboard Access

**Browser**: All major browsers

#### Testing Procedures

##### Basic Navigation
- `Tab` - Next focusable element
- `Shift + Tab` - Previous focusable element
- `Enter` - Activate links and buttons
- `Space` - Activate buttons, toggle checkboxes
- `Arrow Keys` - Navigate within widgets
- `Esc` - Close modals/menus

#### Test Checklist

- [ ] All interactive elements reachable via Tab
- [ ] Tab order follows visual order
- [ ] Focus indicator always visible (3px ring minimum)
- [ ] No keyboard traps
- [ ] Skip links work correctly
- [ ] Modal dialogs trap focus
- [ ] Dropdowns navigate with arrow keys
- [ ] Custom widgets have keyboard support
- [ ] Enter/Space activates buttons
- [ ] Escape closes overlays

### Advanced Navigation

#### Custom Shortcuts
- [ ] `Ctrl + /` or `?` opens keyboard shortcuts help
- [ ] `Ctrl + K` opens search (if implemented)
- [ ] `Home` jumps to page top
- [ ] `End` jumps to page bottom
- [ ] Custom shortcuts don't conflict with browser/OS

---

## Voice Control Testing

### Dragon NaturallySpeaking (Windows)

**Version**: Professional 16 or later

#### Setup

1. Install Dragon NaturallySpeaking
2. Complete voice training
3. Configure application-specific commands

#### Testing Procedures

##### Basic Commands
- "Click [link text]" - Click link
- "Click [button text]" - Click button
- "Fill in [field name]" - Focus form field
- "Press Tab" - Navigate forward
- "Press Escape" - Close dialogs

#### Test Checklist

- [ ] All links clickable by voice
- [ ] All buttons clickable by voice
- [ ] Form fields accessible by voice
- [ ] Custom elements have accessible names
- [ ] Voice commands work in all widgets
- [ ] No elements require mouse-only interaction

---

## Switch Control Testing

### iOS Switch Control

**Setup**: Settings > Accessibility > Switch Control

#### Testing Procedures

1. Connect switch device or use screen tap as switch
2. Enable Switch Control
3. Configure scanning method (auto-scanning recommended)

#### Test Checklist

- [ ] All interactive elements selectable via switch
- [ ] Scanning order is logical
- [ ] Custom widgets work with switch control
- [ ] Time-sensitive actions have alternatives
- [ ] No mouse-hover-only content

---

## Magnification Testing

### ZoomText (Windows)

**Version**: Latest release

#### Test Checklist

- [ ] Content reflows at high magnification
- [ ] Focus remains visible when magnified
- [ ] No horizontal scrolling required (at 200%)
- [ ] Text remains readable at 400% zoom
- [ ] Images scale without pixelation
- [ ] UI controls remain functional when magnified

### macOS Zoom

**Setup**: System Preferences > Accessibility > Zoom

#### Test Checklist

- [ ] Content works at 2x zoom
- [ ] Focus tracked when zoomed
- [ ] Smooth scroll available
- [ ] Hover states visible when magnified

---

## Color Blindness Testing

### Simulation Tools

- **Chrome DevTools**: Rendering tab > Emulate vision deficiencies
- **Color Oracle**: Free color blindness simulator
- **Sim Daltonism** (macOS): Real-time simulation

#### Test Checklist

##### Protanopia (Red-Blind)
- [ ] All information conveyed without red
- [ ] Error states have icon + text
- [ ] Links distinguishable from text
- [ ] Charts use patterns + color

##### Deuteranopia (Green-Blind)
- [ ] Success states have icon + text
- [ ] Form validation clear without green
- [ ] Call-to-action buttons distinguishable

##### Tritanopia (Blue-Blind)
- [ ] Primary actions distinguishable
- [ ] Information conveyed without blue alone
- [ ] Link states have underlines

---

## Cognitive Accessibility Testing

### Reading Level

**Tool**: Hemingway Editor or similar

#### Test Checklist

- [ ] Content at grade 8 reading level or below
- [ ] Short paragraphs (3-4 sentences)
- [ ] Clear headings and subheadings
- [ ] Bullet points for lists
- [ ] Simple, direct language
- [ ] Consistent terminology

### Comprehension

- [ ] Instructions are clear and concise
- [ ] Error messages explain how to fix
- [ ] Progress indicators for multi-step processes
- [ ] Glossary for technical terms
- [ ] Help text available where needed

---

## Testing Schedule

### Pre-Release

- [ ] Automated accessibility scan (axe-core)
- [ ] Manual keyboard navigation test
- [ ] Screen reader smoke test (NVDA + VoiceOver)
- [ ] Color contrast validation
- [ ] Mobile accessibility test

### Full Release Testing

- [ ] Comprehensive NVDA testing
- [ ] Comprehensive JAWS testing
- [ ] VoiceOver (macOS + iOS) testing
- [ ] TalkBack testing
- [ ] Dragon NaturallySpeaking testing
- [ ] Switch control testing
- [ ] ZoomText/magnification testing
- [ ] Color blindness simulation
- [ ] Cognitive accessibility review

### Continuous Monitoring

- **Daily**: Automated accessibility tests in CI/CD
- **Weekly**: Keyboard navigation spot checks
- **Monthly**: Full assistive technology test pass
- **Quarterly**: External audit by certified professionals

---

## Common Issues & Solutions

### Issue: Screen reader not announcing button

**Solutions**:
1. Check button has accessible text (`aria-label` or text content)
2. Verify `role="button"` if not using `<button>` element
3. Ensure button is not `display: none` or `visibility: hidden`

### Issue: Focus not visible

**Solutions**:
1. Never use `outline: none` without replacement
2. Add high-contrast focus ring: `outline: 3px solid #0066cc; outline-offset: 2px;`
3. Test with keyboard navigation

### Issue: Modal not trapping focus

**Solutions**:
1. Use `FocusTrap` component from a11y library
2. Ensure first focusable element receives focus on open
3. Handle Tab/Shift+Tab to loop focus
4. Return focus to trigger element on close

### Issue: Dynamic content not announcing

**Solutions**:
1. Use ARIA live regions (`aria-live="polite"` or `"assertive"`)
2. Add `role="status"` or `role="alert"`
3. Ensure `aria-atomic="true"` for complete announcements
4. Use `LiveRegion` component from a11y library

---

## Resources

### Testing Tools

- **NVDA**: https://www.nvaccess.org
- **JAWS**: https://www.freedomscientific.com/products/software/jaws/
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/
- **Color Oracle**: https://colororacle.org/

### Documentation

- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **WebAIM**: https://webaim.org/
- **Deque University**: https://dequeuniversity.com/

---

**Last Updated**: October 14, 2025
**Version**: 2.0
**Maintained By**: PG Closets Accessibility Team
