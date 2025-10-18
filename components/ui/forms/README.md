# Premium Form System

Complete form component library with Apple design patterns, floating labels, real-time validation, and full accessibility support.

## Features

- **Floating Labels**: Animated labels that float on focus/value
- **Real-time Validation**: Zod schema validation with React Hook Form
- **Accessibility**: Full WCAG 2.1 AA compliance
- **Error States**: Inline error messages with animations
- **Success Feedback**: Visual success indicators
- **Loading States**: Built-in loading indicators
- **Responsive**: Mobile-first design
- **Dark Mode Ready**: Theme-aware components

## Components

### 1. FloatingInput

Text input with floating label animation.

```tsx
import { FloatingInput } from '@/components/ui/forms'

<FloatingInput
  label="Email Address"
  type="email"
  error={errors.email?.message}
  leftIcon={<Mail className="w-5 h-5" />}
  showPasswordToggle // For password fields
/>
```

**Props:**
- `label` (string, required): Label text
- `error` (string): Error message to display
- `success` (string): Success message to display
- `helperText` (string): Helper text below input
- `leftIcon` (ReactNode): Icon on the left
- `rightIcon` (ReactNode): Icon on the right
- `showPasswordToggle` (boolean): Show password visibility toggle
- All standard input props

### 2. FloatingTextArea

Auto-resizing textarea with character counter.

```tsx
import { FloatingTextArea } from '@/components/ui/forms'

<FloatingTextArea
  label="Your Message"
  maxLength={1000}
  autoResize
  minRows={3}
  maxRows={10}
  error={errors.message?.message}
/>
```

**Props:**
- `label` (string, required): Label text
- `error` (string): Error message
- `maxLength` (number): Max characters (shows counter)
- `autoResize` (boolean): Auto-resize on input (default: true)
- `minRows` (number): Minimum rows (default: 3)
- `maxRows` (number): Maximum rows (default: 10)
- All standard textarea props

### 3. AppleSelect

Custom select dropdown with search and descriptions.

```tsx
import { AppleSelect } from '@/components/ui/forms'

<AppleSelect
  label="Project Type"
  value={value}
  onChange={setValue}
  searchable
  options={[
    {
      value: 'new',
      label: 'New Installation',
      description: 'Fresh installation'
    }
  ]}
/>
```

**Props:**
- `label` (string, required): Label text
- `options` (SelectOption[], required): Array of options
- `value` (string): Selected value
- `onChange` (function): Value change handler
- `searchable` (boolean): Enable search
- `error` (string): Error message
- `placeholder` (string): Placeholder text
- `disabled` (boolean): Disable select

**SelectOption Interface:**
```tsx
interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}
```

### 4. AppleCheckbox

Checkbox with label and description.

```tsx
import { AppleCheckbox } from '@/components/ui/forms'

<AppleCheckbox
  label="Subscribe to newsletter"
  description="Get weekly updates"
  checked={value}
  onCheckedChange={setValue}
  required
  error={errors.terms?.message}
/>
```

**Props:**
- `label` (string): Label text
- `description` (string): Description text
- `checked` (boolean): Checked state
- `onCheckedChange` (function): Change handler
- `error` (string): Error message
- `required` (boolean): Required field
- `disabled` (boolean): Disable checkbox

### 5. AppleRadioGroup

Radio button group with descriptions.

```tsx
import { AppleRadioGroup } from '@/components/ui/forms'

<AppleRadioGroup
  label="Contact Method"
  value={value}
  onValueChange={setValue}
  orientation="horizontal"
  options={[
    {
      value: 'email',
      label: 'Email',
      description: '24 hour response'
    }
  ]}
/>
```

**Props:**
- `label` (string): Group label
- `options` (RadioOption[], required): Radio options
- `value` (string): Selected value
- `onValueChange` (function): Change handler
- `orientation` ('horizontal' | 'vertical'): Layout
- `error` (string): Error message
- `required` (boolean): Required field

### 6. AppleToggle

iOS-style toggle switch.

```tsx
import { AppleToggle } from '@/components/ui/forms'

<AppleToggle
  label="Enable notifications"
  description="Receive updates"
  checked={value}
  onCheckedChange={setValue}
  size="md" // sm | md | lg
/>
```

**Props:**
- `label` (string): Label text
- `description` (string): Description text
- `checked` (boolean): Toggle state
- `onCheckedChange` (function): Change handler
- `size` ('sm' | 'md' | 'lg'): Toggle size
- `disabled` (boolean): Disable toggle

## Form Validation

### Using with React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FloatingInput } from '@/components/ui/forms'

// Define schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters')
})

type FormData = z.infer<typeof schema>

// Use in component
function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FloatingInput
        {...register('email')}
        label="Email"
        error={errors.email?.message}
      />
      <FloatingInput
        {...register('password')}
        type="password"
        label="Password"
        error={errors.password?.message}
        showPasswordToggle
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Pre-built Forms

Complete forms with validation included:

```tsx
import { ContactForm, QuoteForm } from '@/components/ui/forms'

// Contact Form
<ContactForm
  onSubmit={async (data) => {
    await submitContact(data)
  }}
  isLoading={false}
/>

// Quote Form
<QuoteForm
  onSubmit={async (data) => {
    await submitQuote(data)
  }}
  isLoading={false}
/>
```

## Custom Validation

Create your own validated forms:

```tsx
import { FormField } from '@/components/ui/forms'

<FormField name="projectType" form={form}>
  {({ value, onChange, error }) => (
    <AppleSelect
      label="Project Type"
      value={value}
      onChange={onChange}
      error={error}
      options={options}
    />
  )}
</FormField>
```

## Accessibility

All components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Error state announcements
- Required field indicators

### Keyboard Navigation

**FloatingInput/TextArea:**
- `Tab` - Focus input
- `Shift + Tab` - Previous field
- `Esc` - Clear (if clearable)

**AppleSelect:**
- `Space/Enter` - Open dropdown
- `Arrow Up/Down` - Navigate options
- `Enter` - Select option
- `Esc` - Close dropdown
- Type to search (if searchable)

**Checkbox/Radio/Toggle:**
- `Space` - Toggle/select
- `Tab` - Next field
- `Arrow keys` - Navigate options (radio)

## Styling

Components use Tailwind CSS with:
- Slate color palette (Apple-inspired grays)
- Smooth transitions (200-300ms)
- Subtle shadows and borders
- Focus rings for accessibility

### Custom Styles

Override with className prop:

```tsx
<FloatingInput
  label="Email"
  className="text-lg" // Custom styles
/>
```

## Best Practices

1. **Always provide labels** - Essential for accessibility
2. **Use error messages** - Clear, actionable feedback
3. **Enable validation** - Real-time user guidance
4. **Test keyboard nav** - Ensure all features accessible
5. **Provide helper text** - Guide users proactively
6. **Use appropriate types** - email, tel, url, etc.
7. **Handle loading states** - Disable during submission
8. **Show success feedback** - Confirm completion

## Examples

### Login Form

```tsx
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember: z.boolean().optional()
})

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FloatingInput
        {...form.register('email')}
        label="Email"
        type="email"
        error={form.formState.errors.email?.message}
        leftIcon={<Mail />}
      />
      <FloatingInput
        {...form.register('password')}
        label="Password"
        type="password"
        error={form.formState.errors.password?.message}
        leftIcon={<Lock />}
        showPasswordToggle
      />
      <AppleCheckbox
        {...form.register('remember')}
        label="Remember me"
      />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

### Search Form

```tsx
function SearchForm() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')

  return (
    <form>
      <FloatingInput
        label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<Search />}
        placeholder="What are you looking for?"
      />
      <AppleSelect
        label="Filter by"
        value={filter}
        onChange={setFilter}
        options={filterOptions}
        searchable
      />
    </form>
  )
}
```

### Settings Form

```tsx
function SettingsForm() {
  return (
    <form>
      <AppleToggle
        label="Dark mode"
        description="Use dark theme"
        checked={darkMode}
        onCheckedChange={setDarkMode}
      />
      <AppleToggle
        label="Notifications"
        description="Receive updates"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
      <AppleRadioGroup
        label="Language"
        value={language}
        onValueChange={setLanguage}
        options={languageOptions}
      />
    </form>
  )
}
```

## Performance

- Components use React.memo where appropriate
- Animations use Framer Motion (GPU accelerated)
- Debounced validation (onChange mode)
- Virtual scrolling for long option lists
- Lazy loading of validation schemas

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (iOS 14+)
- Chrome Android (latest)

## Dependencies

- React 18+
- React Hook Form 7.x
- Zod 3.x
- Radix UI (Checkbox)
- Framer Motion 11.x
- Lucide React (icons)
- Tailwind CSS 3.x

## License

MIT - Part of PG Closets Store project
