// Validar número de tarjeta (algoritmo de Luhn)
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false
  }

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Obtener tipo de tarjeta basado en el número
export function getCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  if (/^4/.test(cleaned)) {
    return 'visa'
  } else if (/^5[1-5]/.test(cleaned)) {
    return 'mastercard'
  } else if (/^3[47]/.test(cleaned)) {
    return 'amex'
  } else if (/^6(?:011|5)/.test(cleaned)) {
    return 'discover'
  }
  
  return 'unknown'
}

