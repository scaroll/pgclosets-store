# Mobile Testing Checklist

**Agent #15 - Mobile Experience & PWA Specialist**

Comprehensive testing checklist for mobile experience validation.

---

## Device Testing

### Critical Devices (Must Test)

- [ ] iPhone 14 Pro (iOS 17)
- [ ] iPhone SE (iOS 16)
- [ ] Samsung Galaxy S23 (Android 13)
- [ ] iPad Pro 11" (iPadOS 17)

### High Priority Devices

- [ ] iPhone 13 (iOS 16)
- [ ] Google Pixel 7 (Android 13)
- [ ] Samsung Galaxy A53 (Android 12)
- [ ] iPad Air (iPadOS 16)

### Low Priority Devices

- [ ] Samsung Galaxy Fold (Android 12)
- [ ] OnePlus 10 Pro (Android 13)
- [ ] Xiaomi Redmi Note 11 (Android 11)

---

## Touch Interaction Testing

### Touch Targets

- [ ] All buttons ≥44×44px (iOS)
- [ ] All buttons ≥48×48px (Android)
- [ ] Links have adequate spacing
- [ ] Form inputs easily tappable
- [ ] No accidental taps between elements

### Gestures

- [ ] Swipe left/right navigation works
- [ ] Pinch-to-zoom on images works
- [ ] Pull-to-refresh functions correctly
- [ ] Long-press shows context menu
- [ ] Double-tap zoom works
- [ ] Pan gestures smooth

### Haptic Feedback

- [ ] Light feedback on swipes
- [ ] Medium feedback on important actions
- [ ] Success pattern on completions
- [ ] Error pattern on failures
- [ ] No excessive vibrations

---

## Layout & UI Testing

### Responsive Design

- [ ] 320px width (iPhone SE portrait)
- [ ] 375px width (iPhone standard)
- [ ] 390px width (iPhone Pro)
- [ ] 428px width (iPhone Pro Max)
- [ ] 768px width (iPad portrait)
- [ ] 1024px width (iPad landscape)

### Safe Areas

- [ ] Content not hidden by notch
- [ ] Bottom content not hidden by home indicator
- [ ] Rounded corners respected
- [ ] Dynamic Island area clear (iPhone 14 Pro+)

### Orientation

- [ ] Portrait mode optimized
- [ ] Landscape mode functional
- [ ] Orientation change smooth
- [ ] No layout breaks on rotate
- [ ] Content reflows properly

### Typography

- [ ] Text readable at 16px minimum
- [ ] Line height ≥1.5 for body text
- [ ] Sufficient contrast (WCAG AA)
- [ ] No horizontal scrolling for text
- [ ] Font scales with system settings

---

## Performance Testing

### Load Times

- [ ] FCP <1.8s on 3G
- [ ] LCP <2.5s on 4G
- [ ] TTI <3.5s average mobile
- [ ] Bundle size <200KB main chunk

### Network Conditions

- [ ] Fast 3G (1.6 Mbps)
- [ ] Slow 3G (400 Kbps)
- [ ] 4G (4 Mbps)
- [ ] Offline mode

### Animations

- [ ] 60 FPS scrolling
- [ ] Smooth transitions
- [ ] No janky animations
- [ ] GPU-accelerated where needed

### Memory

- [ ] No memory leaks on navigation
- [ ] Images properly released
- [ ] Listeners cleaned up
- [ ] Stable memory usage (<100MB)

---

## PWA Testing

### Installation (iOS)

- [ ] Add to Home Screen option available
- [ ] Icon appears on home screen
- [ ] Splash screen shows on launch
- [ ] Runs in standalone mode
- [ ] Status bar themed correctly

### Installation (Android)

- [ ] Install prompt appears (after criteria met)
- [ ] Installation completes successfully
- [ ] Icon appears on home screen
- [ ] App runs in standalone mode
- [ ] Theme color applied

### Offline Functionality

- [ ] Offline page shows when offline
- [ ] Cached pages accessible offline
- [ ] Images load from cache
- [ ] API calls fail gracefully
- [ ] Forms queue for background sync

### Service Worker

- [ ] Registers successfully
- [ ] Updates automatically
- [ ] Caches resources correctly
- [ ] Serves cached content
- [ ] Cleans up old caches

### Push Notifications

- [ ] Permission request works
- [ ] Notifications received
- [ ] Notification click opens app
- [ ] Badge shows on icon
- [ ] Vibration pattern correct

---

## Form Testing

### Input Types

- [ ] Email keyboard for email fields
- [ ] Number keyboard for tel/number fields
- [ ] Appropriate keyboard for each field type
- [ ] Autocomplete works correctly
- [ ] Autofill populates fields

### Validation

- [ ] Inline validation messages
- [ ] Error states clear
- [ ] Success states visible
- [ ] Required fields indicated
- [ ] Validation on blur and submit

### Accessibility

- [ ] Labels associated with inputs
- [ ] Error messages announced
- [ ] Focus order logical
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## Navigation Testing

### Mobile Navigation

- [ ] Hamburger menu opens smoothly
- [ ] Menu items easy to tap
- [ ] Submenu navigation clear
- [ ] Back button functions correctly
- [ ] Breadcrumbs visible (tablet+)

### Bottom Navigation

- [ ] Icons clearly labeled
- [ ] Active state obvious
- [ ] Smooth transitions
- [ ] Persistent across pages
- [ ] Safe area insets respected

### Search

- [ ] Search bar accessible
- [ ] Keyboard appropriate
- [ ] Results load quickly
- [ ] Autocomplete helpful
- [ ] Clear search function

---

## Content Testing

### Images

- [ ] Optimized for mobile (WebP)
- [ ] Adaptive quality based on network
- [ ] Lazy loading works
- [ ] Placeholder shows while loading
- [ ] Alt text present

### Videos

- [ ] Autoplay disabled on mobile
- [ ] Controls accessible
- [ ] Plays in appropriate player
- [ ] Doesn't block page load
- [ ] Adaptive quality

### Text Content

- [ ] Readable font sizes
- [ ] Appropriate line lengths
- [ ] No horizontal scrolling
- [ ] Paragraph spacing adequate
- [ ] Headings hierarchical

---

## E-Commerce Testing

### Product Cards

- [ ] Touch-optimized layout
- [ ] Large add-to-cart button
- [ ] Price clearly visible
- [ ] Stock status shown
- [ ] Quick view works

### Cart

- [ ] Easy quantity adjustment
- [ ] Remove item clear
- [ ] Subtotal updates instantly
- [ ] Checkout button prominent
- [ ] Empty cart state clear

### Checkout

- [ ] Form fields appropriate
- [ ] Payment methods clear
- [ ] Loading states visible
- [ ] Error handling graceful
- [ ] Success confirmation clear

---

## Accessibility Testing

### Touch Accessibility

- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] Keyboard navigation logical
- [ ] Skip navigation link present
- [ ] Landmarks properly labeled

### Screen Reader

- [ ] VoiceOver (iOS) compatible
- [ ] TalkBack (Android) compatible
- [ ] Images have alt text
- [ ] ARIA labels appropriate
- [ ] Dynamic content announced

### Visual Accessibility

- [ ] Color contrast sufficient (4.5:1)
- [ ] Text scalable to 200%
- [ ] No color-only indicators
- [ ] Focus indicators 3px minimum
- [ ] Dark mode supported

---

## Browser Testing

### iOS Browsers

- [ ] Safari (latest)
- [ ] Safari (iOS 16)
- [ ] Chrome iOS
- [ ] Firefox iOS

### Android Browsers

- [ ] Chrome (latest)
- [ ] Samsung Internet
- [ ] Firefox Android
- [ ] Edge Android

---

## Network Testing

### Connection Types

- [ ] WiFi
- [ ] 4G/LTE
- [ ] 3G
- [ ] Slow 3G
- [ ] Offline

### Data Saver Mode

- [ ] Respects data saver preference
- [ ] Reduces image quality
- [ ] Disables autoplay
- [ ] Defers non-critical loads

---

## Security Testing

### HTTPS

- [ ] All resources loaded via HTTPS
- [ ] No mixed content warnings
- [ ] Valid SSL certificate
- [ ] Secure cookies

### Permissions

- [ ] Location permission requested appropriately
- [ ] Camera permission requested appropriately
- [ ] Notification permission requested appropriately
- [ ] Permissions can be revoked

---

## Analytics Testing

### Event Tracking

- [ ] Page views tracked
- [ ] Button clicks tracked
- [ ] Form submissions tracked
- [ ] Errors tracked
- [ ] Conversions tracked

### Mobile-Specific

- [ ] Touch heatmap data collected
- [ ] Scroll depth tracked
- [ ] Gesture events tracked
- [ ] Device type identified
- [ ] Network speed tracked

---

## Regression Testing

### After Each Deploy

- [ ] PWA still installable
- [ ] Service worker updates
- [ ] Critical user flows work
- [ ] No console errors
- [ ] Performance within targets

### Weekly

- [ ] Full device matrix test
- [ ] Lighthouse mobile audit
- [ ] Accessibility audit
- [ ] Performance budget check

---

## Sign-Off Criteria

Before deploying to production:

- [ ] All critical devices tested
- [ ] Zero critical bugs
- [ ] Performance targets met
- [ ] Accessibility compliant (WCAG AA)
- [ ] PWA installable
- [ ] Offline functionality works
- [ ] Analytics tracking verified

---

**Last Updated**: 2025-10-14
**Agent**: #15 - Mobile Experience & PWA Specialist
**Version**: 1.0.0
