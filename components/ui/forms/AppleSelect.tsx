import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface AppleSelectProps {
  label: string
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  searchable?: boolean
}

export function AppleSelect({ label, options, value, onChange, searchable }: AppleSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || '')

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue === selectedValue ? '' : currentValue)
    if (onChange) onChange(currentValue)
    setOpen(false)
  }

  const selectedLabel = options.find(option => option.value === selectedValue)?.label

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                setOpen(prev => !prev)
              }
            }}
          >
            {selectedLabel ? selectedLabel : 'Select...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            {searchable && <CommandInput placeholder="Search..." />}
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.label} // Command matches by label or value. Usually label for search.
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValue === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
