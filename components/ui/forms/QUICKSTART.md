# Form System Quickstart

Get started with the Premium Form System in 5 minutes.

## Installation

Already installed! Just import and use.

## Basic Usage

### 1. Simple Form

```tsx
import { FloatingInput, FloatingTextArea } from '@/components/ui/forms'

function SimpleForm() {
  return (
    <form>
      <FloatingInput
        label="Your Name"
        placeholder="John Smith"
      />
      <FloatingInput
        label="Email"
        type="email"
        placeholder="john@example.com"
      />
      <FloatingTextArea
        label="Message"
        maxLength={500}
      />
      <button type="submit">Send</button>
    </form>
  )
}
```

### 2. With Validation

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FloatingInput } from '@/components/ui/forms'

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short')
})

function ValidatedForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <FloatingInput
        {...register('name')}
        label="Name"
        error={errors.name?.message}
      />
      <FloatingInput
        {...register('email')}
        label="Email"
        type="email"
        error={errors.email?.message}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 3. Pre-built Forms

```tsx
import { ContactForm, QuoteForm } from '@/components/ui/forms'

// Contact Form
<ContactForm
  onSubmit={async (data) => {
    console.log('Contact:', data)
  }}
/>

// Quote Form
<QuoteForm
  onSubmit={async (data) => {
    console.log('Quote:', data)
  }}
/>
```

## Common Patterns

### Password Field

```tsx
<FloatingInput
  label="Password"
  type="password"
  showPasswordToggle
  leftIcon={<Lock />}
/>
```

### Select with Search

```tsx
<AppleSelect
  label="Country"
  searchable
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
/>
```

### Checkbox Agreement

```tsx
<AppleCheckbox
  label="I agree to terms"
  required
  error={errors.terms?.message}
/>
```

### Radio Choice

```tsx
<AppleRadioGroup
  label="Contact Method"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' }
  ]}
/>
```

### Toggle Setting

```tsx
<AppleToggle
  label="Dark Mode"
  description="Use dark theme"
  checked={darkMode}
  onCheckedChange={setDarkMode}
/>
```

## Error Handling

```tsx
<FloatingInput
  label="Email"
  error="This email is already taken"
  // Shows red border + error icon + message
/>
```

## Success State

```tsx
<FloatingInput
  label="Email"
  success="Email is available!"
  // Shows green border + checkmark + message
/>
```

## Loading State

```tsx
<button
  type="submit"
  disabled={isLoading}
  className="..."
>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Loading...
    </span>
  ) : (
    'Submit'
  )}
</button>
```

## Styling Tips

```tsx
// Add custom classes
<FloatingInput
  label="Email"
  className="text-lg font-medium"
/>

// Custom button style
<button className="
  w-full bg-slate-900 text-white px-8 py-3
  hover:bg-slate-800 hover:shadow-xl
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Submit
</button>
```

## See Full Showcase

```bash
# View all components and examples
Open: /components/ui/forms/FormShowcase.tsx
```

## Need Help?

See full documentation in README.md
