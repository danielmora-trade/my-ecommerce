'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Banknote, Plus, Check } from 'lucide-react'
import { Database } from '@/types/database.types'
import { PaymentForm } from './payment-form'

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

interface PaymentSelectorProps {
  paymentMethods: PaymentMethod[]
  selectedPaymentType?: 'cash_on_delivery' | 'credit_card'
  selectedPaymentMethodId?: string
  onSelectPaymentType: (type: 'cash_on_delivery' | 'credit_card') => void
  onSelectPaymentMethod: (methodId: string) => void
  onPaymentMethodsChange?: () => void
}

export const PaymentSelector = ({
  paymentMethods,
  selectedPaymentType,
  selectedPaymentMethodId,
  onSelectPaymentType,
  onSelectPaymentMethod,
  onPaymentMethodsChange
}: PaymentSelectorProps) => {
  const [showForm, setShowForm] = useState(false)

  const handleSuccess = () => {
    setShowForm(false)
    onPaymentMethodsChange?.()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Método de Pago</h3>

      {/* Opción de pago contra entrega */}
      <Card
        className={`cursor-pointer transition-all ${
          selectedPaymentType === 'cash_on_delivery'
            ? 'border-brand-600 border-2 bg-brand-50'
            : 'border-gray-200 hover:border-brand-300'
        }`}
        onClick={() => onSelectPaymentType('cash_on_delivery')}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedPaymentType === 'cash_on_delivery'
                ? 'border-brand-600 bg-brand-600'
                : 'border-gray-300'
            }`}>
              {selectedPaymentType === 'cash_on_delivery' && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            
            <Banknote className={`h-6 w-6 ${
              selectedPaymentType === 'cash_on_delivery' ? 'text-brand-600' : 'text-gray-400'
            }`} />
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Pago Contra Entrega</h4>
              <p className="text-sm text-gray-600">Paga en efectivo cuando recibas tu pedido</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opción de pago con tarjeta */}
      <div className="space-y-3">
        <Card
          className={`cursor-pointer transition-all ${
            selectedPaymentType === 'credit_card'
              ? 'border-brand-600 border-2 bg-brand-50'
              : 'border-gray-200 hover:border-brand-300'
          }`}
          onClick={() => onSelectPaymentType('credit_card')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentType === 'credit_card'
                  ? 'border-brand-600 bg-brand-600'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentType === 'credit_card' && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              
              <CreditCard className={`h-6 w-6 ${
                selectedPaymentType === 'credit_card' ? 'text-brand-600' : 'text-gray-400'
              }`} />
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Pagar en Línea</h4>
                <p className="text-sm text-gray-600">Usa tu tarjeta de crédito o débito</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mostrar tarjetas guardadas si se selecciona pago con tarjeta */}
        {selectedPaymentType === 'credit_card' && (
          <div className="pl-8 space-y-3">
            {!showForm ? (
              <>
                {paymentMethods.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 mb-4">No tienes tarjetas guardadas</p>
                    <Button
                      onClick={() => setShowForm(true)}
                      size="sm"
                      className="bg-brand-600 hover:bg-brand-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Tarjeta
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Selecciona una tarjeta</span>
                      <Button
                        onClick={() => setShowForm(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nueva Tarjeta
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <Card
                          key={method.id}
                          className={`cursor-pointer transition-all ${
                            selectedPaymentMethodId === method.id
                              ? 'border-brand-600 border-2'
                              : 'border-gray-200 hover:border-brand-300'
                          }`}
                          onClick={() => onSelectPaymentMethod(method.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedPaymentMethodId === method.id
                                  ? 'border-brand-600 bg-brand-600'
                                  : 'border-gray-300'
                              }`}>
                                {selectedPaymentMethodId === method.id && (
                                  <Check className="h-2.5 w-2.5 text-white" />
                                )}
                              </div>
                              
                              <CreditCard className="h-5 w-5 text-gray-600" />
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm capitalize">{method.card_brand}</span>
                                  <span className="text-gray-600 text-sm">•••• {method.card_last_four}</span>
                                  {method.is_default && (
                                    <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                                      Predeterminada
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  Vence {method.card_exp_month?.toString().padStart(2, '0')}/{method.card_exp_year}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div>
                <h4 className="text-sm font-semibold mb-3">Nueva Tarjeta</h4>
                <PaymentForm
                  onSuccess={handleSuccess}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

