'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useState } from 'react'

interface ProductSearchProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string
}

export function ProductSearch({ className, ...props }: ProductSearchProps) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    try {
      // Navigate to search results page with query param
      // The API will be called by the results page, or we can fetch here for autocomplete
      // For now, let's redirect to a search page
      const params = new URLSearchParams()
      params.set('q', input)
      router.push(`/products?${params.toString()}`)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('relative w-full max-w-sm', className)}
      role="form"
      {...props}
    >
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for products..."
          value={input}
          onChange={handleInputChange}
          className="pr-12"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          disabled={isLoading}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}
