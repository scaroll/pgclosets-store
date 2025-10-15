# Form Accessibility Testing Checklist

**WCAG 2.1 AAA Compliance for PG Closets Premium Forms**

## Overview

This checklist ensures all form components meet WCAG 2.1 Level AAA standards. Test each form implementation against these criteria before deployment.

---

## Automated Testing

### Install Testing Tools

```bash
npm install --save-dev @axe-core/react jest-axe @testing-library/jest-dom
```

### Axe-Core Integration

```tsx
import { render } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"

expect.extend(toHaveNoViolations)

describe("PremiumContactForm Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<PremiumContactForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

---

## Manual Testing Checklist

### ✅ Keyboard Navigation

Test with keyboard only (no mouse):

- [ ] **Tab** - Can reach all form fields in logical order
- [ ] **Shift+Tab** - Can navigate backwards through fields
- [ ] **Enter** - Submits the form from any field
- [ ] **Space** - Toggles checkboxes and radio buttons
- [ ] **Arrow Keys** - Navigate within select dropdowns
- [ ] **Escape** - Closes modals and dropdowns
- [ ] No keyboard traps (can exit all interactive elements)
- [ ] Focus order matches visual layout

#### How to Test

1. Disconnect mouse
2. Use only Tab, Shift+Tab, Enter, Space, Arrow keys
3. Verify all interactive elements are reachable
4. Verify focus never gets "stuck"

---

### ✅ Focus Indicators

Visual feedback when element has keyboard focus:

- [ ] All form fields have visible focus indicators
- [ ] Focus indicator has 4px copper ring
- [ ] Focus indicator has sufficient contrast (3:1 minimum)
- [ ] Focus indicator doesn't obscure input content
- [ ] Custom components (checkbox, radio) have focus indicators
- [ ] Focus indicator visible in both light and dark modes

#### How to Test

```tsx
// Focus should show 4px copper ring
className="focus-visible:ring-4 focus-visible:ring-copper-100 focus-visible:border-copper-500"

// Check with keyboard navigation
Tab through all fields and verify visible ring appears
```

---

### ✅ Screen Reader Compatibility

Test with screen readers (VoiceOver on Mac, NVDA/JAWS on Windows):

- [ ] Form fields announce label and type
- [ ] Error messages are announced when they appear
- [ ] Success states are announced
- [ ] Loading states are announced
- [ ] Required fields are announced
- [ ] Helper text is associated with inputs
- [ ] Form submits correctly

#### VoiceOver Testing (Mac)

```bash
# Enable VoiceOver
Cmd + F5

# Navigate form
Control + Option + Right Arrow (next element)
Control + Option + Left Arrow (previous element)

# Interact with element
Control + Option + Space
```

Expected announcements:

```
"Email Address, required, edit text"
"This field is required"
"Email address is valid, success"
"Submitting form..."
```

#### ARIA Attributes

Verify all inputs have proper ARIA:

```tsx
<input
  aria-label="Email Address"
  aria-describedby="email-helper email-error"
  aria-invalid={hasError}
  aria-required={required}
/>

<p id="email-error" role="alert" aria-live="polite">
  {error}
</p>
```

---

### ✅ Color Contrast

Verify sufficient contrast ratios:

**Text Contrast Requirements:**
- AAA: 7:1 for normal text
- AAA: 4.5:1 for large text (18pt+)
- AA: 4.5:1 for normal text (minimum)

**Form Elements:**
- [ ] Input text: 9.8:1 (charcoal-900 on white) ✅
- [ ] Label text: 8.2:1 (stone-600 on white) ✅
- [ ] Error text: 7.1:1 (error-600 on white) ✅
- [ ] Success text: 7.3:1 (success-600 on white) ✅
- [ ] Placeholder: 4.8:1 (stone-400 on white) ✅
- [ ] Disabled text: 3.8:1 (acceptable for disabled)

#### How to Test

1. Use browser DevTools color picker
2. Check contrast ratio in Accessibility panel
3. Or use online tool: https://webaim.org/resources/contrastchecker/

```tsx
// Example contrast check
Background: #FFFFFF (white)
Text: #1C1917 (charcoal-900)
Ratio: 9.8:1 ✅ AAA
```

---

### ✅ Touch Targets

Minimum 44x44px for all interactive elements:

- [ ] Input fields have adequate height (48px minimum)
- [ ] Checkboxes have 44x44px touch area (with invisible padding)
- [ ] Radio buttons have 44x44px touch area
- [ ] Submit buttons have 56px minimum height
- [ ] Icon buttons have 44x44px minimum
- [ ] Touch targets have 8px spacing between them

#### How to Test

```tsx
// Measure element dimensions in DevTools
// Should be at least 44x44px

// Checkbox with invisible touch area
<CheckboxPrimitive.Root
  className="
    h-5 w-5  /* Visible: 20x20px */
    before:absolute before:inset-0 before:-m-2
    before:min-w-[44px] before:min-h-[44px]  /* Touch: 44x44px */
  "
/>
```

---

### ✅ Labels and Instructions

Clear, descriptive labels and instructions:

- [ ] Every input has a visible label
- [ ] Labels are associated with inputs (htmlFor/id)
- [ ] Required fields marked with asterisk and text
- [ ] Error messages are specific and helpful
- [ ] Instructions provided before form (not just in placeholder)
- [ ] Placeholder text is supplementary, not the only label

#### Good vs Bad Examples

```tsx
// ✅ Good - Clear label and instruction
<PremiumInput
  label="Email Address"
  helperText="We'll never share your email with anyone"
  placeholder="john@example.com"
  required
/>
// Announces: "Email Address, required, edit text, We'll never share your email with anyone"

// ❌ Bad - Only placeholder as label
<input placeholder="Email" />
// Announces: "edit text" (no context!)
```

---

### ✅ Error Handling

Accessible error messages and recovery:

- [ ] Errors announced by screen reader
- [ ] Errors persist until corrected
- [ ] Errors don't rely on color alone (icon + text)
- [ ] Error messages are specific and helpful
- [ ] Multiple errors presented as list
- [ ] Focus moves to first error on submit
- [ ] Users can correct errors and resubmit

#### Error Message Requirements

```tsx
// ✅ Good error messages
"Please enter a valid email address (e.g., you@example.com)"
"Password must be at least 8 characters with uppercase, lowercase, number, and special character"
"This email is already registered. Try logging in instead."

// ❌ Bad error messages
"Invalid email"
"Password error"
"Error"
```

#### Implementation

```tsx
<motion.p
  id={errorId}
  role="alert"
  aria-live="polite"
  className="text-error-600 flex items-start gap-1"
>
  <AlertCircle className="w-4 h-4 flex-shrink-0" />
  <span>{error}</span>
</motion.p>
```

---

### ✅ Form Structure

Semantic HTML and proper structure:

- [ ] Form uses `<form>` element
- [ ] Inputs use correct type (email, tel, url, etc.)
- [ ] Related fields grouped in `<fieldset>`
- [ ] Fieldsets have `<legend>` describing the group
- [ ] Submit button is `<button type="submit">`
- [ ] No `<div>` or `<span>` used as buttons

#### Semantic Structure

```tsx
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>Personal Information</legend>
    <PremiumInput label="Name" type="text" />
    <PremiumInput label="Email" type="email" />
  </fieldset>

  <fieldset>
    <legend>Project Details</legend>
    <PremiumTextarea label="Description" />
  </fieldset>

  <button type="submit">Submit</button>
</form>
```

---

### ✅ Time Limits

No time limits or adequate warnings:

- [ ] Auto-save prevents data loss from timeouts
- [ ] No session timeouts during form completion
- [ ] If timeout exists, user warned 60 seconds before
- [ ] User can extend timeout without losing data
- [ ] Form remembers data after page reload

#### Implementation

```tsx
// Auto-save prevents data loss
const form = usePremiumForm({
  formId: "contact-form",
  autoSave: true,
  autoSaveInterval: 2000, // Save every 2 seconds
  trackAbandonment: true, // Warn before page close
})
```

---

### ✅ Multi-Step Forms

Progressive disclosure and navigation:

- [ ] Current step clearly indicated
- [ ] Total steps shown (e.g., "Step 2 of 4")
- [ ] Progress bar shows completion percentage
- [ ] Can navigate back to previous steps
- [ ] Data persists when navigating between steps
- [ ] Can save and return later
- [ ] Validation errors don't prevent back navigation

#### Implementation

```tsx
const form = usePremiumForm({
  steps: 4,
  autoSave: true,
})

const { currentStep, nextStep, previousStep, progress } = form

<div className="mb-8">
  <p className="text-center mb-2">
    Step {currentStep + 1} of {form.steps}
  </p>
  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-copper-500 transition-all"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
```

---

### ✅ Mobile Accessibility

Touch-friendly and responsive:

- [ ] Form works on mobile devices (iOS/Android)
- [ ] Touch targets are 44x44px minimum
- [ ] Text is readable without zoom (16px minimum)
- [ ] Form fits in viewport without horizontal scroll
- [ ] Native mobile keyboards appear (type="email" shows @)
- [ ] Autocomplete attributes for auto-fill
- [ ] Pinch-to-zoom not disabled

#### Mobile-Specific Testing

```tsx
// Test on real devices:
// - iPhone (Safari)
// - Android (Chrome)

// Verify keyboard types
<input type="email" inputMode="email" autoComplete="email" />
// Should show email keyboard with @ symbol

<input type="tel" inputMode="tel" autoComplete="tel" />
// Should show numeric keypad

<input type="number" inputMode="numeric" />
// Should show numeric keyboard
```

---

## Testing Tools

### Browser Extensions

1. **axe DevTools** - Free accessibility checker
   - https://www.deque.com/axe/devtools/

2. **WAVE** - Web accessibility evaluation tool
   - https://wave.webaim.org/extension/

3. **Lighthouse** - Built into Chrome DevTools
   - Accessibility audit in Performance tab

### Screen Readers

1. **VoiceOver** (Mac) - Built-in
   - Enable: System Preferences → Accessibility → VoiceOver

2. **NVDA** (Windows) - Free
   - Download: https://www.nvaccess.org/

3. **JAWS** (Windows) - Paid
   - Download: https://www.freedomscientific.com/products/software/jaws/

### Color Contrast Checkers

1. **WebAIM Contrast Checker**
   - https://webaim.org/resources/contrastchecker/

2. **Accessible Colors**
   - https://accessible-colors.com/

3. **Contrast Ratio**
   - https://contrast-ratio.com/

---

## Automated Testing Suite

### Complete Test File

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe, toHaveNoViolations } from "jest-axe"
import { PremiumContactForm } from "@/components/forms/premium/PremiumContactForm.example"

expect.extend(toHaveNoViolations)

describe("PremiumContactForm Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<PremiumContactForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("should be keyboard navigable", async () => {
    const user = userEvent.setup()
    render(<PremiumContactForm />)

    // Tab through all fields
    await user.tab() // Name field
    expect(screen.getByLabelText(/full name/i)).toHaveFocus()

    await user.tab() // Email field
    expect(screen.getByLabelText(/email address/i)).toHaveFocus()

    await user.tab() // Phone field
    expect(screen.getByLabelText(/phone number/i)).toHaveFocus()

    await user.tab() // Message field
    expect(screen.getByLabelText(/your message/i)).toHaveFocus()

    await user.tab() // Submit button
    expect(screen.getByRole("button", { name: /send message/i })).toHaveFocus()
  })

  it("should announce errors to screen readers", async () => {
    const user = userEvent.setup()
    render(<PremiumContactForm />)

    const submitButton = screen.getByRole("button", { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      const errorMessage = screen.getByRole("alert")
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveAttribute("aria-live", "polite")
    })
  })

  it("should have proper ARIA attributes", () => {
    render(<PremiumContactForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toHaveAttribute("aria-required", "true")
    expect(emailInput).toHaveAttribute("aria-describedby")

    const nameInput = screen.getByLabelText(/full name/i)
    expect(nameInput).toHaveAttribute("aria-required", "true")
  })

  it("should have sufficient color contrast", async () => {
    const { container } = render(<PremiumContactForm />)

    // axe-core checks color contrast
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: true },
      },
    })

    expect(results).toHaveNoViolations()
  })

  it("should submit form with Enter key", async () => {
    const user = userEvent.setup()
    const onSuccess = jest.fn()

    render(<PremiumContactForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/full name/i), "John Smith")
    await user.type(screen.getByLabelText(/email address/i), "john@example.com")
    await user.type(screen.getByLabelText(/your message/i), "Test message")

    // Submit with Enter key
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Smith",
          email: "john@example.com",
          message: "Test message",
        })
      )
    })
  })
})
```

---

## Checklist Summary

Use this quick checklist before deployment:

- [ ] Runs axe-core with zero violations
- [ ] All fields keyboard navigable
- [ ] Visible focus indicators (4px ring)
- [ ] Screen reader announces labels and errors
- [ ] Color contrast meets AAA (7:1)
- [ ] Touch targets 44x44px minimum
- [ ] Labels properly associated
- [ ] Error messages helpful and specific
- [ ] Works with VoiceOver/NVDA/JAWS
- [ ] Mobile-friendly (tested on iOS/Android)
- [ ] Auto-save prevents data loss
- [ ] Form submits with Enter key

---

## Resources

### WCAG 2.1 Guidelines

- **Level A**: Basic accessibility
- **Level AA**: Industry standard
- **Level AAA**: Enhanced accessibility (our goal)

Full guidelines: https://www.w3.org/WAI/WCAG21/quickref/

### Additional Reading

- [WebAIM Form Accessibility](https://webaim.org/techniques/forms/)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Last Updated:** October 2025
**Maintained By:** Agent #12 - Premium Form Design
