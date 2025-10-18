# Premium Quote Form - Testing Script

## Pre-Flight Check ✈️

```bash
# 1. Ensure you're in the project directory
cd /Users/spencercarroll/pgclosets-store-main

# 2. Start dev server if not running
npm run dev

# 3. Open in browser
open http://localhost:3000/quote/premium
```

## Manual Testing Checklist

### ✅ Step 1: Product Selection

**Test Cases:**
- [ ] Click on "Sliding Closet Doors" - should highlight with blue border
- [ ] Click on "Barn Doors" - should also highlight (multi-select)
- [ ] Click on same product again - should deselect
- [ ] Click on "Custom Solution" - should show text area
- [ ] Type in custom text area - should accept input
- [ ] Try to proceed without selecting anything - should show error
- [ ] Select at least one product - error should clear
- [ ] Click "Continue" - should go to Step 2

**Expected:**
- Visual cards with icons
- Blue border on selected
- Checkmark appears on selected
- Custom text area appears/disappears
- Error message if none selected
- Smooth transition to Step 2

---

### ✅ Step 2: Room Details

**Test Cases:**
- [ ] Enter dimensions: 8, 8, 2 - should accept numbers
- [ ] Select door count: "2 doors" - should work
- [ ] Click on "Modern Minimalist" style - should highlight
- [ ] Click "Upload Photos" button
- [ ] Select 1 image - should show preview
- [ ] Upload 2 more images - should show 3 previews
- [ ] Click X on one preview - should remove that image
- [ ] Try to upload 6th image - should prevent/warn
- [ ] Try to upload 10MB file - should prevent/warn
- [ ] Try to proceed without door count - should show error
- [ ] Try to proceed without style - should show error
- [ ] Fill required fields - errors should clear
- [ ] Click "Continue" - should go to Step 3

**Expected:**
- Number inputs accept digits
- Dropdowns work correctly
- Style cards highlight on click
- Images show thumbnails
- Remove button works
- 5 image maximum enforced
- 5MB per file enforced
- Required field validation
- Smooth transition to Step 3

---

### ✅ Step 3: Contact Information

**Test Cases:**
- [ ] Type "John" in first name
- [ ] Type "Smith" in last name
- [ ] Type "john@example.com" in email
- [ ] Type "6135550123" in phone - should format to (613) 555-0123
- [ ] Type "k1a0b1" in postal - should format to K1A 0B1
- [ ] Clear email field - should show error "Email is required"
- [ ] Type "invalidemail" - should show "Please enter a valid email"
- [ ] Type valid email - error should clear
- [ ] Clear phone - should show error
- [ ] Type "123" in phone - should show "Please enter a valid phone number"
- [ ] Type valid phone - error should clear
- [ ] Clear postal - should show error
- [ ] Type "12345" in postal - should show "Please enter a valid postal code"
- [ ] Type valid postal - error should clear
- [ ] Fill all fields correctly - all errors clear
- [ ] Click "Continue" - should go to Step 4

**Expected:**
- All fields accept input
- Phone auto-formats: (613) 555-0123
- Postal auto-formats: K1A 0B1
- Real-time validation on blur
- Clear error messages with icons
- Help text visible
- Smooth transition to Step 4

---

### ✅ Step 4: Preferences

**Test Cases:**
- [ ] Click "Email" contact method - should highlight
- [ ] Click "Phone Call" - should switch highlight
- [ ] Select contact time from dropdown
- [ ] Click calendar field - native picker should open
- [ ] Select a future date
- [ ] Click "As soon as possible" urgency - should highlight
- [ ] Click "Within 1-2 weeks" - should switch highlight
- [ ] Select budget range
- [ ] Type in special requirements
- [ ] Select "How did you hear about us"
- [ ] Try to proceed without urgency - should show error
- [ ] Select urgency - error clears
- [ ] Click "Get My Quote" - should show loading spinner

**Expected:**
- Visual cards highlight on click
- Dropdowns work correctly
- Calendar opens native picker
- Can select future dates only
- Textarea accepts input
- Required field validation
- Loading state on submit
- Button disabled during submit

---

### ✅ Step 5: Success Page

**Test Cases:**
- [ ] Success page appears after submission
- [ ] Green checkmark animates
- [ ] "Request Received!" heading visible
- [ ] 4-step process guide displays
- [ ] Quote reference number shows
- [ ] "Return Home" button works
- [ ] "Browse Products" button works

**Expected:**
- Success animation
- Clear next steps
- Reference number format: #QR123456
- Both CTAs functional
- Professional appearance

---

## ✅ Auto-Save Testing

**Test Cases:**
- [ ] Fill in Step 1, select products
- [ ] See "Saving..." indicator
- [ ] See "Saved" indicator after 1 second
- [ ] Refresh the page
- [ ] Form should restore with selected products
- [ ] Continue to Step 2, fill some fields
- [ ] Refresh page
- [ ] Should restore to Step 2 with filled fields
- [ ] Complete and submit form
- [ ] Refresh page
- [ ] Form should be empty (cleared after submission)

**Expected:**
- Auto-save every second
- Status indicator shows saving/saved
- Form restores on refresh
- Clears after successful submission

---

## ✅ Navigation Testing

**Test Cases:**
- [ ] From Step 2, click "Back" - should go to Step 1
- [ ] From Step 3, click "Back" - should go to Step 2
- [ ] Click step indicator for Step 1 - should jump to Step 1
- [ ] Try to click Step 4 indicator from Step 1 - should not jump (validation)
- [ ] Fill Step 1, click Step 2 indicator - should jump
- [ ] Progress bar should update correctly
- [ ] Step counters show checkmarks when complete

**Expected:**
- Back button works
- Can't skip ahead without validation
- Can go back freely
- Progress bar accurate
- Checkmarks appear on completed steps

---

## ✅ Mobile Testing

**Devices to Test:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

**Test Cases:**
- [ ] All buttons are easily tappable (44x44px)
- [ ] Product cards work well on mobile
- [ ] Photo upload uses camera
- [ ] Phone keyboard appears for phone field
- [ ] Email keyboard for email field
- [ ] Number keyboard for dimensions
- [ ] Date picker is native mobile picker
- [ ] Form scrolls smoothly
- [ ] Progress bar visible
- [ ] Success page looks good

**Expected:**
- Touch-friendly interface
- Appropriate keyboards
- Native mobile controls
- Smooth scrolling
- Readable text (16px minimum)

---

## ✅ Error Handling Testing

**Test Cases:**
- [ ] Try to upload 10MB image - should show error
- [ ] Try to upload non-image file - should show error
- [ ] Try to upload 6 images - should show error
- [ ] Fill invalid email - should show error
- [ ] Fill invalid phone - should show error
- [ ] Fill invalid postal - should show error
- [ ] Skip required fields - should prevent progression
- [ ] Disconnect internet, submit form - should show error

**Expected:**
- Clear error messages
- Prevents invalid actions
- User-friendly error text
- Graceful failure handling

---

## ✅ Browser Compatibility

**Browsers to Test:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Test Cases:**
- [ ] Form displays correctly
- [ ] All interactions work
- [ ] Auto-formatting works
- [ ] Photo upload works
- [ ] Date picker works
- [ ] Auto-save works
- [ ] Submission works

**Expected:**
- Consistent appearance
- All features functional
- No console errors
- Smooth performance

---

## ✅ Performance Testing

**Metrics to Check:**
- [ ] Initial page load < 2 seconds
- [ ] Time to interactive < 100ms
- [ ] Form submission < 3 seconds
- [ ] Photo upload preview < 500ms
- [ ] Step transition < 200ms
- [ ] Auto-save doesn't lag input

**Tools:**
- Chrome DevTools Performance tab
- Lighthouse audit
- Network tab

**Expected:**
- Fast load times
- Smooth interactions
- No jank or lag

---

## ✅ API Integration Testing

**Test Cases:**
- [ ] Submit form with all fields filled
- [ ] Check Network tab - POST to /api/quotes/quick
- [ ] Verify payload structure matches API
- [ ] Check Supabase for new record
- [ ] Check Slack for notification
- [ ] Verify success response
- [ ] Confirm localStorage cleared

**Expected Payload:**
```json
{
  "customer": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "(613) 555-0123",
    "province": "ON"
  },
  "product": {
    "name": "Sliding Closet Doors, Barn Doors",
    "category": "custom-quote",
    "price": 0,
    "selectedOptions": {
      "doorCount": "2",
      "style": "modern",
      "roomDimensions": "8x8x2",
      "urgency": "1-2-weeks",
      "contactMethod": "email",
      "contactTime": "morning",
      "preferredDate": "2025-11-01"
    }
  },
  "notes": "Budget: 2500-5000..."
}
```

---

## 🐛 Bug Report Template

If you find issues, report using this format:

```
**Bug**: [Brief description]
**Severity**: Critical / High / Medium / Low
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari/Edge]
**Device**: [Desktop/Mobile/Tablet]
**Screenshot**: [If applicable]
**Console Errors**: [Copy any errors]
```

---

## ✅ Acceptance Criteria

Before marking as complete:

- [ ] All 5 steps function correctly
- [ ] Visual selection works perfectly
- [ ] Photo upload operational (5 max)
- [ ] Smart formatting works (phone, postal)
- [ ] Calendar picker functional
- [ ] Real-time validation accurate
- [ ] Progress tracking correct
- [ ] Auto-save reliable
- [ ] Success page displays
- [ ] Mobile responsive
- [ ] No console errors
- [ ] API integration works
- [ ] Submission successful
- [ ] Data persists correctly

---

## 🎯 Success Metrics

After launch, monitor:

1. **Completion Rate**: Target >50%, expect 60-70%
2. **Step 1 Completion**: Expect 90%
3. **Step 2 Completion**: Expect 92%
4. **Step 3 Completion**: Expect 88%
5. **Step 4 Completion**: Expect 95%
6. **Photo Upload Rate**: Expect 30-40%
7. **Mobile Completion**: Expect 65-75%
8. **Error Rate**: Expect <10%

---

## 📊 Analytics Events to Track

```javascript
// Google Analytics 4
gtag('event', 'quote_form_start', {
  page_path: '/quote/premium'
});

gtag('event', 'quote_form_step_complete', {
  step: 1,
  products_selected: 2
});

gtag('event', 'quote_form_photo_upload', {
  photo_count: 3
});

gtag('event', 'quote_form_submit', {
  total_time: 180, // seconds
  products: 'sliding-doors,barn-doors',
  urgency: '1-2-weeks'
});

gtag('event', 'quote_form_abandon', {
  step: 2,
  time_spent: 45
});
```

---

## 🚀 Ready to Launch?

Once all tests pass:

1. ✅ Create pull request
2. ✅ Request code review
3. ✅ Run automated tests
4. ✅ Deploy to staging
5. ✅ QA team testing
6. ✅ Stakeholder approval
7. ✅ Soft launch (10% traffic)
8. ✅ Monitor metrics
9. ✅ Full launch (100% traffic)
10. ✅ Continuous optimization

---

**Happy Testing! 🧪**
