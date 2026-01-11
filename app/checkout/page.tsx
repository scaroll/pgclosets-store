import { CheckoutFlow } from '@/components/checkout/checkout-flow'

export const metadata = {
  title: 'Checkout | PG Closets',
  description: 'Secure checkout for your custom closet order.',
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Checkout</h1>
      <CheckoutFlow />
    </div>
  )
}
