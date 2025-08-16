import { CheckoutForm } from '@/components/checkout/checkout-form'
import { StoreHeader } from '@/components/store/store-header'
import { StoreFooter } from '@/components/store/store-footer'

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order with our secure payment system
            </p>
          </div>
          
          <CheckoutForm />
        </div>
      </main>
      
      <StoreFooter />
    </div>
  )
}