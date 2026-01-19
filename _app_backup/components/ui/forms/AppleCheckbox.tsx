import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

// AppleCheckbox
interface AppleCheckboxProps {
  label: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function AppleCheckbox({
  label,
  description,
  checked,
  onCheckedChange,
}: AppleCheckboxProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={label} checked={checked} onCheckedChange={onCheckedChange} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={label}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

// AppleRadioGroup
interface RadioOption {
  value: string
  label: string
}

interface AppleRadioGroupProps {
  label: string
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
}

export function AppleRadioGroup({ label, options, value, onValueChange }: AppleRadioGroupProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <RadioGroup defaultValue={value} onValueChange={onValueChange}>
        {options.map(option => (
          <div className="flex items-center space-x-2" key={option.value}>
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

// AppleToggle
interface AppleToggleProps {
  label: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'default' | 'lg'
}

export function AppleToggle({
  label,
  checked,
  onCheckedChange,
  size = 'default',
}: AppleToggleProps) {
  const sizeClasses = {
    sm: 'w-9',
    default: 'w-11',
    lg: 'w-14',
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(sizeClasses[size === 'default' ? 'default' : size])}
      />
      <Label htmlFor={label}>{label}</Label>
    </div>
  )
}
