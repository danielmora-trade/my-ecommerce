'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddressSelector } from './address-selector'
import { PaymentSelector } from './payment-selector'
import { createOrder } from '@/app/order-actions'
import { toast } from 'sonner'
import { Check, ChevronRight, Loader2, MapPin, CreditCard, PackageCheck } from 'lucide-react'
import { Database } from '@/types/database.types'
import { CartItemWithProduct } from '@/app/cart-actions'

type Address = Database['public']['Tables']['addresses']['Row']
type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

interface CheckoutFlowProps {
  cartSummary: {
    items: CartItemWithProduct[]
    itemCount: number
    subtotal: number
    tax: number
    total: number
  }
  addresses: Address[]
  paymentMethods: PaymentMethod[]
}

type Step = 'address' | 'payment' | 'confirm'

export const CheckoutFlow = ({
  cartSummary,
  addresses: initialAddresses,
  paymentMethods: initialPaymentMethods,
}: CheckoutFlowProps) => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('address')
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    initialAddresses.find(a => a.is_default)?.id || ''
  )
  const [selectedPaymentType, setSelectedPaymentType] = useState<'cash_on_delivery' | 'credit_card'>('cash_on_delivery')
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(
    initialPaymentMethods.find(p => p.is_default)?.id || ''
  )
  const [isProcessing, setIsProcessing] = useState(false)

  // Para actualizar datos cuando se agregan nuevas direcciones o métodos de pago
  const addresses = initialAddresses
  const paymentMethods = initialPaymentMethods

  const handleAddressesChange = () => {
    router.refresh()
  }

  const handlePaymentMethodsChange = () => {
    router.refresh()
  }

  const canProceedToPayment = () => {
    return selectedAddressId !== ''
  }

  const canProceedToConfirm = () => {
    if (selectedPaymentType === 'cash_on_delivery') {
      return true
    }
    return selectedPaymentMethodId !== ''
  }

  const handlePlaceOrder = async () => {
    if (!canProceedToConfirm()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    setIsProcessing(true)

    try {
      const result = await createOrder({
        shipping_address_id: selectedAddressId,
        billing_address_id: selectedAddressId, // Usar la misma dirección para facturación
        payment_method: selectedPaymentType,
        payment_method_id: selectedPaymentMethodId || undefined,
      })

      if (result.success && result.order) {
        toast.success('¡Pedido realizado con éxito!')
        router.push(`/orden-confirmada/${result.order.order_number}`)
      } else {
        toast.error(result.error || 'Error al procesar el pedido')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Error al procesar el pedido')
      setIsProcessing(false)
    }
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId)
  const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPaymentMethodId)

  const steps = [
    { id: 'address', label: 'Dirección de Envío', icon: MapPin },
    { id: 'payment', label: 'Método de Pago', icon: CreditCard },
    { id: 'confirm', label: 'Confirmación', icon: PackageCheck },
  ]

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = 
              (step.id === 'address' && (currentStep === 'payment' || currentStep === 'confirm')) ||
              (step.id === 'payment' && currentStep === 'confirm')

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' :
                    isActive ? 'bg-brand-600' : 'bg-gray-200'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <StepIcon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div>
          {currentStep === 'address' && (
            <div className="space-y-4">
              <AddressSelector
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onAddressesChange={handleAddressesChange}
              />
              <Button
                onClick={() => setCurrentStep('payment')}
                disabled={!canProceedToPayment()}
                className="w-full bg-brand-600 hover:bg-brand-700"
                size="lg"
              >
                Continuar al Pago
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="space-y-4">
              <PaymentSelector
                paymentMethods={paymentMethods}
                selectedPaymentType={selectedPaymentType}
                selectedPaymentMethodId={selectedPaymentMethodId}
                onSelectPaymentType={setSelectedPaymentType}
                onSelectPaymentMethod={setSelectedPaymentMethodId}
                onPaymentMethodsChange={handlePaymentMethodsChange}
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentStep('address')}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Volver
                </Button>
                <Button
                  onClick={() => setCurrentStep('confirm')}
                  disabled={!canProceedToConfirm()}
                  className="flex-1 bg-brand-600 hover:bg-brand-700"
                  size="lg"
                >
                  Revisar Pedido
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'confirm' && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Dirección de Envío */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-brand-600" />
                      Dirección de Envío
                    </h4>
                    {selectedAddress && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{selectedAddress.full_name}</p>
                        <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                        <p className="text-sm text-gray-700 mt-2">
                          {selectedAddress.address_line_1}
                        </p>
                        {selectedAddress.address_line_2 && (
                          <p className="text-sm text-gray-600">{selectedAddress.address_line_2}</p>
                        )}
                        <p className="text-sm text-gray-700">
                          {selectedAddress.city}, {selectedAddress.state}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() => setCurrentStep('address')}
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                    >
                      Cambiar dirección
                    </Button>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-brand-600" />
                      Método de Pago
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {selectedPaymentType === 'cash_on_delivery' ? (
                        <div>
                          <p className="font-medium">Pago Contra Entrega</p>
                          <p className="text-sm text-gray-600">Pagarás en efectivo al recibir tu pedido</p>
                        </div>
                      ) : (
                        selectedPaymentMethod && (
                          <div>
                            <p className="font-medium">Pago con Tarjeta</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {selectedPaymentMethod.card_brand} •••• {selectedPaymentMethod.card_last_four}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <Button
                      onClick={() => setCurrentStep('payment')}
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                    >
                      Cambiar método de pago
                    </Button>
                  </div>

                  {/* Productos */}
                  <div>
                    <h4 className="font-semibold mb-3">Productos ({cartSummary.itemCount})</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cartSummary.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl">
                            🔩
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.products?.name}</p>
                            <p className="text-gray-600">Cantidad: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentStep('payment')}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Volver
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-brand-600 hover:bg-brand-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Realizar Pedido'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'artículo' : 'artículos'})</span>
                <span className="font-medium">${cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IVA (12%)</span>
                <span className="font-medium">${cartSummary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="font-medium text-green-600">GRATIS</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-600">${cartSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Envío seguro y confiable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Garantía de devolución</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

