// Test utility functions for formatting

describe('Format Utilities', () => {
  describe('Currency Formatting', () => {
    it('should format prices correctly', () => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(amount)
      }

      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1500.50)).toBe('$1,500.50')
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'America/Mexico_City'
        }).format(date)
      }

      const testDate = new Date('2024-01-15T12:00:00Z')
      const formatted = formatDate(testDate)

      expect(formatted).toContain('2024')
      expect(formatted).toContain('enero')
      // Date might vary by timezone, just check format is correct
      expect(formatted).toMatch(/\d{1,2} de \w+ de \d{4}/)
    })
  })

  describe('Order Number Generation', () => {
    it('should generate order numbers with correct format', () => {
      const generateOrderNumber = () => {
        const timestamp = Date.now().toString(36).toUpperCase()
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `ORD-${timestamp}-${random}`
      }

      const orderNumber = generateOrderNumber()

      expect(orderNumber).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]{4}$/)
    })

    it('should generate unique order numbers', () => {
      const generateOrderNumber = () => {
        const timestamp = Date.now().toString(36).toUpperCase()
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `ORD-${timestamp}-${random}`
      }

      const orderNumber1 = generateOrderNumber()
      const orderNumber2 = generateOrderNumber()

      expect(orderNumber1).not.toBe(orderNumber2)
    })
  })

  describe('Slug Generation', () => {
    it('should convert text to slug format', () => {
      const slugify = (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }

      expect(slugify('Acero Inoxidable 304')).toBe('acero-inoxidable-304')
      expect(slugify('Producto Especial!')).toBe('producto-especial')
      expect(slugify('  Nombre   con   espacios  ')).toBe('nombre-con-espacios')
    })
  })
})

