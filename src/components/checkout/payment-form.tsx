'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { createPaymentMethod } from '@/app/payment-actions'
import { validateCardNumber, getCardBrand } from '@/lib/payment-utils'
import { toast } from 'sonner'
import { Loader2, CreditCard } from 'lucide-react'

interface PaymentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const PaymentForm = ({ onSuccess, onCancel }: PaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    card_number: '',
    card_holder: '',
    exp_month: '',
    exp_year: '',
    cvv: '',
    is_default: false,
  })

  const [cardBrand, setCardBrand] = useState<string>('')

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '')
    
    // Limitar a solo números
    value = value.replace(/\D/g, '')
    
    // Limitar a 16 dígitos
    value = value.substring(0, 16)
    
    // Agregar espacios cada 4 dígitos
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
    
    setFormData(prev => ({ ...prev, card_number: formattedValue }))
    
    // Detectar tipo de tarjeta
    if (value.length >= 6) {
      setCardBrand(getCardBrand(value))
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 2)
    if (value.length === 2 && parseInt(value) > 12) {
      value = '12'
    }
    if (value.length === 1 && parseInt(value) > 1) {
      value = '0' + value
    }
    setFormData(prev => ({ ...prev, exp_month: value }))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 2)
    setFormData(prev => ({ ...prev, exp_year: value }))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4)
    setFormData(prev => ({ ...prev, cvv: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar número de tarjeta
      if (!validateCardNumber(formData.card_number)) {
        toast.error('Número de tarjeta inválido')
        setIsLoading(false)
        return
      }

      // Validar mes de expiración
      const month = parseInt(formData.exp_month)
      if (month < 1 || month > 12) {
        toast.error('Mes de expiración inválido')
        setIsLoading(false)
        return
      }

      // Validar año de expiración (no debe estar en el pasado)
      const currentYear = new Date().getFullYear() % 100
      const year = parseInt(formData.exp_year)
      if (year < currentYear) {
        toast.error('Año de expiración inválido')
        setIsLoading(false)
        return
      }

      // Obtener últimos 4 dígitos
      const cardNumber = formData.card_number.replace(/\s/g, '')
      const lastFour = cardNumber.slice(-4)

      const result = await createPaymentMethod({
        type: 'credit_card',
        card_last_four: lastFour,
        card_brand: cardBrand || 'unknown',
        card_exp_month: month,
        card_exp_year: 2000 + year,
        provider: 'manual',
        provider_payment_method_id: `card_${Date.now()}`,
        is_default: formData.is_default,
      })

      if (result.success) {
        toast.success('Tarjeta guardada correctamente')
        onSuccess?.()
      } else {
        toast.error(result.error || 'Error al guardar la tarjeta')
      }
    } catch (error) {
      console.error('Error saving payment method:', error)
      toast.error('Error al guardar la tarjeta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="card_number">Número de Tarjeta *</Label>
            <div className="relative">
              <Input
                id="card_number"
                name="card_number"
                value={formData.card_number}
                onChange={handleCardNumberChange}
                required
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {cardBrand === 'visa' && <span className="text-blue-600 font-bold text-xs">VISA</span>}
                {cardBrand === 'mastercard' && <span className="text-red-600 font-bold text-xs">MC</span>}
                {cardBrand === 'amex' && <span className="text-blue-800 font-bold text-xs">AMEX</span>}
                {!cardBrand && <CreditCard className="h-5 w-5 text-gray-400" />}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="card_holder">Nombre del Titular *</Label>
            <Input
              id="card_holder"
              name="card_holder"
              value={formData.card_holder}
              onChange={(e) => setFormData(prev => ({ ...prev, card_holder: e.target.value.toUpperCase() }))}
              required
              placeholder="JUAN PEREZ"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exp_month">Mes *</Label>
              <Input
                id="exp_month"
                name="exp_month"
                value={formData.exp_month}
                onChange={handleMonthChange}
                required
                placeholder="MM"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="exp_year">Año *</Label>
              <Input
                id="exp_year"
                name="exp_year"
                value={formData.exp_year}
                onChange={handleYearChange}
                required
                placeholder="AA"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                value={formData.cvv}
                onChange={handleCvvChange}
                required
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700">Usar como método de pago predeterminado</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-brand-600 hover:bg-brand-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Tarjeta'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

