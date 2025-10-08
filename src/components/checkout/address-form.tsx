'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { createAddress, updateAddress } from '@/app/address-actions'
import { toast } from 'sonner'
import { Database } from '@/types/database.types'
import { Loader2 } from 'lucide-react'

type Address = Database['public']['Tables']['addresses']['Row']

interface AddressFormProps {
  address?: Address
  onSuccess?: () => void
  onCancel?: () => void
}

export const AddressForm = ({ address, onSuccess, onCancel }: AddressFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: address?.type || 'shipping' as 'shipping' | 'billing',
    full_name: address?.full_name || '',
    phone: address?.phone || '',
    address_line_1: address?.address_line_1 || '',
    address_line_2: address?.address_line_2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postal_code: address?.postal_code || '',
    country: address?.country || 'Ecuador',
    is_default: address?.is_default || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result
      if (address) {
        result = await updateAddress(address.id, formData)
      } else {
        result = await createAddress(formData)
      }

      if (result.success) {
        toast.success(address ? 'Dirección actualizada' : 'Dirección guardada correctamente')
        onSuccess?.()
      } else {
        toast.error(result.error || 'Error al guardar la dirección')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Error al guardar la dirección')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="0999999999"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address_line_1">Dirección *</Label>
            <Input
              id="address_line_1"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              required
              placeholder="Av. Principal #123"
            />
          </div>

          <div>
            <Label htmlFor="address_line_2">Referencia (Opcional)</Label>
            <Input
              id="address_line_2"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleChange}
              placeholder="Edificio azul, junto al parque"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Quito"
              />
            </div>

            <div>
              <Label htmlFor="state">Provincia *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Pichincha"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">Código Postal</Label>
              <Input
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="170150"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700">Establecer como dirección predeterminada</span>
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
                address ? 'Actualizar Dirección' : 'Guardar Dirección'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

