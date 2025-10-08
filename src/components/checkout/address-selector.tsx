'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Check } from 'lucide-react'
import { Database } from '@/types/database.types'
import { AddressForm } from './address-form'

type Address = Database['public']['Tables']['addresses']['Row']

interface AddressSelectorProps {
  addresses: Address[]
  selectedAddressId?: string
  onSelectAddress: (addressId: string) => void
  onAddressesChange?: () => void
}

export const AddressSelector = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressesChange
}: AddressSelectorProps) => {
  const [showForm, setShowForm] = useState(false)

  const handleSuccess = () => {
    setShowForm(false)
    onAddressesChange?.()
  }

  if (showForm) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Nueva Dirección de Envío</h3>
        <AddressForm
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Selecciona una Dirección de Envío</h3>
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva Dirección
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">No tienes direcciones guardadas</h4>
            <p className="text-gray-600 mb-4">Agrega una dirección de envío para continuar</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-brand-600 hover:bg-brand-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Dirección
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? 'border-brand-600 border-2 bg-brand-50'
                  : 'border-gray-200 hover:border-brand-300'
              }`}
              onClick={() => onSelectAddress(address.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedAddressId === address.id
                      ? 'border-brand-600 bg-brand-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedAddressId === address.id && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{address.full_name}</h4>
                      {address.is_default && (
                        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{address.address_line_1}</p>
                      {address.address_line_2 && (
                        <p className="text-gray-500">{address.address_line_2}</p>
                      )}
                      <p>
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </div>

                  <MapPin className={`h-5 w-5 flex-shrink-0 ${
                    selectedAddressId === address.id ? 'text-brand-600' : 'text-gray-400'
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

