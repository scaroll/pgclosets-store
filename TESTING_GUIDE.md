# Visual Testing Guide - UX/UI Quick Wins

## 🧪 Quick Visual Tests (5 Minutes)

### Test 1: Skip Navigation Link
**WCAG Level A - Critical**

1. **Desktop Test**:
   - Open homepage in Chrome
   - Press `Tab` key once
   - ✅ **Expected**: Black button appears at top-left saying "Skip to main content"
   - Press `Enter`
   - ✅ **Expected**: Page scrolls smoothly to main content

2. **Screen Reader Test** (Optional):
   - Enable VoiceOver (Mac: Cmd+F5) or NVDA (Windows)
   - Press `Tab` once
   - ✅ **Expected**: Announces "Skip to main content area"
   - Press `Enter`
   - ✅ **Expected**: Announces "Skipped to main content"

---

### Test 2: Color Contrast (WCAG Level AA)
**No manual testing needed** - Already fixed in CSS

Verify with browser extension:
1. Install [WAVE Extension](https://wave.webaim.org/extension/)
2. Click WAVE icon on any page
3. ✅ **Expected**: 0 contrast errors

---

### Test 3: Mobile Sticky CTA
**Conversion Optimization**

1. **Mobile/Responsive Test**:
   - Open homepage
   - Resize browser to mobile (< 768px) OR open on phone
   - ✅ **Expected**: Black button appears at bottom: "Get FREE Design Consultation"

2. **Scroll Test**:
   - Scroll down the page
   - ✅ **Expected**: CTA hides smoothly
   - Scroll back up
   - ✅ **Expected**: CTA reappears smoothly

3. **Click Test**:
   - Click the sticky CTA
   - ✅ **Expected**: Navigate to `/request-work` page

4. **Page Visibility Test**:
   - Go to homepage → ✅ CTA visible
   - Go to `/products` → ✅ CTA visible
   - Go to `/about` → ✅ CTA hidden (not on list)

---

### Test 4: Mega Menu Hover Timeout
**UX Polish**

1. **Hover Test**:
   - Hover over "Products" in navigation
   - ✅ **Expected**: Mega menu opens
   - Move mouse slightly away (but stay close)
   - ✅ **Expected**: Menu stays open for 300ms before closing

2. **Bridge Test**:
   - Hover over "Products"
   - Mega menu opens
   - Move mouse down to mega menu content
   - ✅ **Expected**: Menu stays open (no flicker)

---

### Test 5: Form Required Attributes
**HTML5 Validation**

1. **Empty Form Test**:
   - Go to `/contact` page
   - Click "Get Your FREE Quote" without filling anything
   - ✅ **Expected**: Browser shows "Please fill out this field" (native validation)

2. **Email Test**:
   - Enter invalid email (e.g., "test")
   - Click submit
   - ✅ **Expected**: Browser shows "Please include an '@' in the email address"

---

### Test 6: Input Mode - Mobile Keyboards
**Mobile UX**

1. **Email Field Test** (iPhone/Android):
   - Open `/contact` on mobile
   - Tap email field
   - ✅ **Expected**: Keyboard shows `@` and `.com` keys (email keyboard)

2. **Phone Field Test** (iPhone/Android):
   - Tap phone field
   - ✅ **Expected**: Numeric keypad appears (not full QWERTY)

---

### Test 7: Error Message Announcements
**Screen Reader Support**

1. **Visual Test** (No screen reader):
   - Go to `/contact` page
   - Enter "a" in First Name field
   - Tab to next field
   - ✅ **Expected**: Red error message appears below field

2. **Screen Reader Test** (Optional):
   - Enable VoiceOver or NVDA
   - Enter "a" in First Name field
   - Tab to next field
   - ✅ **Expected**: Screen reader announces the error immediately

---

### Test 8: CTA Copy Improvements
**Conversion Optimization**

1. **Header Desktop**:
   - Look at main navigation
   - ✅ **Expected**: Button says "Get FREE Design Consultation"

2. **Mobile Menu**:
   - Open mobile menu (hamburger icon)
   - ✅ **Expected**: CTA says "Get Your FREE Quote"

3. **Top Bar**:
   - Look at black bar above header
   - ✅ **Expected**: "📞 Speak to a Designer Now: (613) 422-5800"

4. **Contact Form**:
   - Go to `/contact` page
   - ✅ **Expected**: Submit button says "Get Your FREE Quote"

---

### Test 9: Focus Indicators
**WCAG Level AA**

1. **Keyboard Navigation**:
   - Press `Tab` repeatedly through the page
   - Look at each focused element
   - ✅ **Expected**:
     - 3px blue outline around focused element
     - Subtle blue shadow/glow effect
     - Clear visibility on all elements

2. **Input Focus**:
   - Go to `/contact` page
   - Click in email field
   - ✅ **Expected**:
     - 3px blue outline
     - Blue shadow around input
     - High contrast visibility

---

### Test 10: Value Proposition Banner
**Trust Signals**

1. **First Visit**:
   - Open homepage in incognito/private mode
   - ✅ **Expected**: Dark banner at very top with:
     - "Official Renin Dealer"
     - "500+ Ottawa Installations"
     - "Price Match Guarantee"
     - X close button on right

2. **Dismiss Test**:
   - Click X to close banner
   - ✅ **Expected**: Banner smoothly disappears

3. **Persistence Test**:
   - Refresh page
   - ✅ **Expected**: Banner stays hidden (localStorage)

4. **Mobile Test**:
   - Open on mobile
   - ✅ **Expected**: Trust signals scroll horizontally if needed

5. **Return Visit**:
   - Open in new incognito tab
   - ✅ **Expected**: Banner shows again (new session)

---

## 🚦 Quick Automated Tests

### Lighthouse (Chrome DevTools)

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Check "Accessibility" only
4. Click "Generate report"
5. ✅ **Expected Score**: 95+ (was ~85-90)

**Key Improvements to Verify**:
- ✅ Color contrast passes
- ✅ Skip link detected
- ✅ ARIA attributes valid
- ✅ Focus indicators visible

---

### WAVE Extension

1. Install [WAVE Browser Extension](https://wave.webaim.org/extension/)
2. Click WAVE icon on any page
3. ✅ **Expected**:
   - 0 Errors (was 1-3)
   - 0 Contrast Errors (was 3)
   - 10+ Features detected (skip link, ARIA)

---

### axe DevTools

1. Install [axe DevTools Extension](https://www.deque.com/axe/devtools/)
2. Open DevTools → axe tab
3. Click "Scan ALL of my page"
4. ✅ **Expected**:
   - 0 Critical issues
   - 0 Serious issues
   - Color contrast passes

---

## 📱 Mobile-Specific Tests

### iPhone Safari (iOS 15+)

1. **Sticky CTA**:
   - Visit homepage
   - Scroll down → CTA hides
   - Scroll up → CTA appears
   - ✅ **Safe area inset**: CTA respects notch/home indicator

2. **Email Keyboard**:
   - Go to `/contact`
   - Tap email field
   - ✅ **Expected**: Email keyboard with `@` key

3. **Phone Keyboard**:
   - Tap phone field
   - ✅ **Expected**: Numeric keypad

### Android Chrome

1. **Sticky CTA**:
   - Same test as iPhone
   - ✅ **Expected**: Smooth scroll behavior

2. **Input Keyboards**:
   - Email → Email keyboard layout
   - Phone → Numeric layout

---

## 🎯 Regression Tests

### Ensure Nothing Broke

1. **Homepage**:
   - ✅ Logo loads
   - ✅ Navigation works
   - ✅ Hero section displays
   - ✅ Footer displays

2. **Contact Form**:
   - ✅ All fields editable
   - ✅ Form submits successfully
   - ✅ Success message appears
   - ✅ Email sent (check inbox)

3. **Products Page**:
   - ✅ Products load
   - ✅ Images display
   - ✅ Links work

4. **Navigation**:
   - ✅ All menu items clickable
   - ✅ Mega menu works on hover
   - ✅ Mobile menu opens/closes

---

## ✅ Final Checklist

Copy this checklist for your testing:

```
Desktop Tests:
[ ] Skip navigation works (Tab → Enter → Scrolls)
[ ] Focus indicators visible (3px blue outline)
[ ] Mega menu timeout feels smooth (300ms)
[ ] Value prop banner displays
[ ] Value prop banner dismisses and persists
[ ] Contact form validation works
[ ] CTA copy updated everywhere

Mobile Tests:
[ ] Sticky CTA appears on /, /products, /services
[ ] Sticky CTA hides on scroll down
[ ] Sticky CTA shows on scroll up
[ ] Email keyboard shows @ key
[ ] Phone keyboard shows numeric pad
[ ] Value prop banner scrolls horizontally
[ ] Safe area insets work (iPhone X+)

Accessibility Tests:
[ ] Lighthouse Accessibility Score 95+
[ ] WAVE: 0 errors, 0 contrast errors
[ ] axe DevTools: 0 critical/serious issues
[ ] Screen reader announces errors (optional)
[ ] Keyboard navigation works on all pages

Regression Tests:
[ ] Homepage loads correctly
[ ] Contact form submits successfully
[ ] Products page works
[ ] Navigation works (desktop + mobile)
[ ] No console errors
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Skip Link Not Appearing
**Fix**: Ensure you're pressing Tab (not clicking). It's keyboard-only.

### Issue 2: Mobile Sticky CTA Not Showing
**Fix**:
1. Check viewport width < 768px
2. Check you're on /, /products, or /services
3. Try scrolling up

### Issue 3: Value Prop Banner Still Showing After Dismiss
**Fix**:
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Banner should reappear

### Issue 4: Email Keyboard Not Showing
**Fix**:
1. Ensure you're on actual mobile device (not desktop responsive mode)
2. iOS 12.2+ required for inputMode support
3. Try Android if iOS fails

### Issue 5: Focus Indicators Not Visible
**Fix**:
1. Ensure you're using keyboard (Tab key)
2. Don't click with mouse (different focus state)
3. Check browser supports :focus-visible (most modern browsers do)

---

## 📊 Success Metrics

After deployment, track:

1. **Lighthouse Accessibility Score**: Target 95+
2. **Form Completion Rate**: Baseline + 15-20%
3. **Mobile Conversion Rate**: Baseline + 10-15%
4. **Bounce Rate**: Baseline - 5-10%
5. **Error Reports**: Accessibility complaints -90%

---

**Testing Time Estimate**: 15-20 minutes for complete manual testing
**Automated Testing**: 5 minutes (Lighthouse + WAVE)
**Total QA Time**: ~30 minutes

✅ **Happy Testing!**
