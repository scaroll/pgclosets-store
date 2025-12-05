"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, ArrowLeft, Trash2, FileText, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWishlistStore } from "@/lib/stores/wishlist-store"
import { useCartStore } from "@/lib/stores/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice, cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, itemCount } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const { toast } = useToast()
  const [removingId, setRemovingId] = React.useState<string | null>(null)

  // Handle remove item with animation
  const handleRemove = (productId: string) => {
    setRemovingId(productId)
    setTimeout(() => {
      removeItem(productId)
      setRemovingId(null)
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      })
    }, 300)
  }

  // Handle add all to cart
  const handleAddAllToCart = () => {
    let addedCount = 0
    items.forEach((item) => {
      addToCart({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      })
      addedCount++
    })

    if (addedCount > 0) {
      toast({
        title: "Added to cart",
        description: `${addedCount} ${addedCount === 1 ? 'item' : 'items'} added to your cart.`,
      })
    }
  }

  // Handle request quote for wishlist
  const handleRequestQuote = () => {
    // Store wishlist items in sessionStorage for the quote page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('wishlist-quote-items', JSON.stringify(items))
    }

    toast({
      title: "Redirecting to quote request",
      description: "We'll help you get a quote for your wishlist items.",
    })

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = '/request-quote'
    }, 500)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-apple-dark-bg-elevated py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-apple-gray-600 dark:text-apple-dark-text-secondary">
              <li>
                <Link href="/" className="hover:text-apple-blue-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-apple-gray-900 dark:text-apple-dark-text font-medium">
                Wishlist
              </li>
            </ol>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-2">
                My Wishlist
              </h1>
              <p className="text-lg text-apple-gray-600 dark:text-apple-dark-text-secondary">
                {itemCount > 0
                  ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} saved`
                  : "Save your favorite products for later"}
              </p>
            </div>

            {itemCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your entire wishlist?')) {
                    clearWishlist()
                    toast({
                      title: "Wishlist cleared",
                      description: "All items have been removed from your wishlist.",
                    })
                  }
                }}
                className="hidden md:flex"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-950/30 dark:to-red-950/30 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-pink-500 dark:text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-apple-gray-600 dark:text-apple-dark-text-secondary mb-8 max-w-md mx-auto">
              Start exploring our collection and save your favorite products for later. Click the heart icon on any product to add it to your wishlist.
            </p>
            <Button asChild size="lg" className="rounded-apple">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Wishlist Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: removingId === item.productId ? 0 : 1,
                      y: 0,
                      scale: removingId === item.productId ? 0.95 : 1
                    }}
                    exit={{ opacity: 0, scale: 0.95, x: -100 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                          {/* Product Image */}
                          <Link
                            href={`/products/${item.productId}`}
                            className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-apple-dark-bg-tertiary group"
                          >
                            <Image
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, 128px"
                            />
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div className="space-y-2">
                              <Link href={`/products/${item.productId}`}>
                                <h3 className="text-lg font-bold text-apple-gray-900 dark:text-apple-dark-text hover:text-apple-blue-500 transition-colors line-clamp-2">
                                  {item.name}
                                </h3>
                              </Link>

                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-apple-gray-900 dark:text-apple-dark-text">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                              <Button
                                size="sm"
                                onClick={() => {
                                  addToCart({
                                    id: item.id,
                                    productId: item.productId,
                                    name: item.name,
                                    price: item.price,
                                    quantity: 1,
                                    image: item.image,
                                  })
                                  toast({
                                    title: "Added to cart",
                                    description: `${item.name} has been added to your cart.`,
                                  })
                                }}
                                className="flex-1 sm:flex-none rounded-apple"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemove(item.productId)}
                                className="rounded-apple text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue Shopping Link */}
              <div className="pt-4">
                <Button variant="outline" asChild className="rounded-apple">
                  <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            {/* Wishlist Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-2">
                      Wishlist Summary
                    </h2>
                    <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
                    </p>
                  </div>

                  <Separator />

                  {/* Total Value */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-apple-gray-600 dark:text-apple-dark-text-secondary">
                        Total Value
                      </span>
                      <span className="font-medium text-apple-gray-900 dark:text-apple-dark-text">
                        {formatPrice(items.reduce((sum, item) => sum + item.price, 0))}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleAddAllToCart}
                      className="w-full rounded-apple h-12 text-base font-semibold"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add All to Cart
                    </Button>

                    <Button
                      onClick={handleRequestQuote}
                      variant="outline"
                      className="w-full rounded-apple h-12 text-base font-semibold border-2 hover:bg-apple-blue-50 hover:border-apple-blue-500 hover:text-apple-blue-600 dark:hover:bg-apple-blue-950/20 dark:hover:border-apple-blue-400 dark:hover:text-apple-blue-400 transition-all"
                      size="lg"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Request Quote
                    </Button>
                  </div>

                  <Separator />

                  {/* Info Section */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center mt-0.5">
                        <Heart className="w-3 h-3 text-white fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Save for Later
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Your wishlist is saved across devices when you're signed in.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center mt-0.5">
                        <FileText className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                          Free Quotes
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Get expert advice and pricing for your wishlist items.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clear Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your entire wishlist?')) {
                        clearWishlist()
                        toast({
                          title: "Wishlist cleared",
                          description: "All items have been removed from your wishlist.",
                        })
                      }
                    }}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Wishlist
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
