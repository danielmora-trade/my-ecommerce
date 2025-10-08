import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCartSummary } from '@/app/cart-actions'
import { getUserAddresses } from '@/app/address-actions'
import { getUserPaymentMethods } from '@/app/payment-actions'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'

export const metadata = {
  title: 'Checkout - ACEROMAX',
  description: 'Completa tu pedido',
}

export default async function CheckoutPage() {
  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?redirect=/checkout')
  }

  // Get cart summary
  const summary = await getCartSummary()

  // If cart is empty, redirect to cart page
  if (summary.itemCount === 0) {
    redirect('/carrito')
  }

  // Get user addresses and payment methods
  const addresses = await getUserAddresses()
  const paymentMethods = await getUserPaymentMethods()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        <CheckoutFlow
          cartSummary={summary}
          addresses={addresses}
          paymentMethods={paymentMethods}
        />
      </div>

      <Footer />
    </div>
  )
}

