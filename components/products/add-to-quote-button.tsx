'use client'

import { Button } from '@/components/ui/button'
import { useQuoteBasketStore } from '@/lib/stores/quote-basket-store'
import { cn } from '@/lib/utils'
import { FileText, Check } from 'lucide-react'
import { useState } from 'react'

interface Product {
  id: string
  slug: string
  name: string
  category?: string
  price: number | string
  image?: string
}

interface AddToQuoteButtonProps {
  product: Product
  quantity?: number
  variantId?: string
  variantName?: string
  disabled?: boolean
  className?: string
}

export function AddToQuoteButton({
  product,
  quantity = 1,
  variantId,
  variantName,
  disabled = false,
  className,
}: AddToQuoteButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const { addItem, openBasket } = useQuoteBasketStore()

  const handleAddToQuote = async () => {
    setIsAdding(true)

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category || 'Doors',
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: product.image,
        quantity,
        variantId,
        variantName,
      })

      setIsAdded(true)

      // Auto open basket after adding
      setTimeout(() => {
        openBasket()
      }, 300)

      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to quote basket:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleAddToQuote}
      disabled={disabled || isAdding}
      variant="outline"
      size="lg"
      className={cn(
        'h-12 w-full border-apple-blue-200 text-apple-blue-700 hover:bg-apple-blue-50 hover:text-apple-blue-800 dark:border-apple-blue-900 dark:text-apple-blue-400 dark:hover:bg-apple-blue-950',
        isAdded && 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100',
        className
      )}
    >
      {isAdded ? (
        <>
          <Check className="h-5 w-5" />
          Added to Quote
        </>
      ) : isAdding ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Adding...
        </>
      ) : (
        <>
          <FileText className="h-5 w-5" />
          Add to Quote Basket
        </>
      )}
    </Button>
  )
}
