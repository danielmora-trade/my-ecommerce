import { validateCardNumber, getCardBrand } from '@/lib/payment-utils'

describe('payment-utils', () => {
  describe('validateCardNumber', () => {
    it('should validate a correct Visa card number', () => {
      // Visa test card
      expect(validateCardNumber('4532015112830366')).toBe(true)
    })

    it('should validate a correct Mastercard number', () => {
      // Mastercard test card
      expect(validateCardNumber('5425233430109903')).toBe(true)
    })

    it('should validate a correct AMEX number', () => {
      // AMEX test card
      expect(validateCardNumber('374245455400126')).toBe(true)
    })

    it('should reject an invalid card number', () => {
      expect(validateCardNumber('1234567890123456')).toBe(false)
    })

    it('should reject a card number with invalid checksum', () => {
      expect(validateCardNumber('4532015112830367')).toBe(false)
    })

    it('should reject empty string', () => {
      expect(validateCardNumber('')).toBe(false)
    })

    it('should reject non-numeric strings', () => {
      expect(validateCardNumber('abcd1234abcd1234')).toBe(false)
    })

    it('should reject card numbers that are too short', () => {
      expect(validateCardNumber('123')).toBe(false)
    })
  })

  describe('getCardBrand', () => {
    it('should detect Visa', () => {
      expect(getCardBrand('4532015112830366')).toBe('visa')
      expect(getCardBrand('4')).toBe('visa')
    })

    it('should detect Mastercard', () => {
      expect(getCardBrand('5425233430109903')).toBe('mastercard')
      expect(getCardBrand('51')).toBe('mastercard')
      expect(getCardBrand('55')).toBe('mastercard')
    })

    it('should detect American Express', () => {
      expect(getCardBrand('374245455400126')).toBe('amex')
      expect(getCardBrand('34')).toBe('amex')
      expect(getCardBrand('37')).toBe('amex')
    })

    it('should detect Discover', () => {
      expect(getCardBrand('6011111111111117')).toBe('discover')
      expect(getCardBrand('6011')).toBe('discover')
    })

    it('should return unknown for unrecognized patterns', () => {
      expect(getCardBrand('9999999999999999')).toBe('unknown')
      expect(getCardBrand('123')).toBe('unknown')
      expect(getCardBrand('')).toBe('unknown')
    })
  })
})

