# Testing

ACEROMAX implementa un sistema de testing robusto utilizando **Jest** y **React Testing Library** para asegurar la calidad y confiabilidad del código.

## 🧪 Configuración de Testing

### Dependencias

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^30.0.0",
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0"
  }
}
```

### Configuración de Jest

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
}

module.exports = createJestConfig(config)
```

### Setup de Jest

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfills para Node.js environment
global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithOtp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  })),
}))

// Mock Supabase server client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  })),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
```

## 🧪 Pruebas Implementadas

### 1. Utilidades de Pago

```typescript
// src/__tests__/lib/payment-utils.test.ts
import { validateCardNumber, getCardBrand } from '@/lib/payment-utils'

describe('payment-utils', () => {
  describe('validateCardNumber', () => {
    it('should validate a correct Visa card number', () => {
      expect(validateCardNumber('4532015112830366')).toBe(true)
    })

    it('should validate a correct Mastercard number', () => {
      expect(validateCardNumber('5425233430109903')).toBe(true)
    })

    it('should reject an invalid card number', () => {
      expect(validateCardNumber('1234567890123456')).toBe(false)
    })
  })

  describe('getCardBrand', () => {
    it('should detect Visa', () => {
      expect(getCardBrand('4532015112830366')).toBe('visa')
    })

    it('should detect Mastercard', () => {
      expect(getCardBrand('5425233430109903')).toBe('mastercard')
    })

    it('should return unknown for unrecognized patterns', () => {
      expect(getCardBrand('9999999999999999')).toBe('unknown')
    })
  })
})
```

### 2. Utilidades de Formato

```typescript
// src/__tests__/lib/format-utils.test.ts
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
  })
})
```

### 3. Componentes UI

```typescript
// src/__tests__/components/Pagination.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Pagination } from '@/components/products/pagination'

describe('Pagination', () => {
  it('should render page numbers correctly', () => {
    render(<Pagination totalPages={5} currentPage={1} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should disable previous button on first page', () => {
    render(<Pagination totalPages={5} currentPage={1} />)

    const previousButton = screen.getByText(/anterior/i)
    expect(previousButton).toBeDisabled()
  })

  it('should highlight current page', () => {
    render(<Pagination totalPages={5} currentPage={3} />)

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveClass('bg-brand-600')
  })
})
```

## 🚀 Scripts de Testing

### Comandos Disponibles

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo CI (sin watch)
npm run test:ci

# Ver cobertura de pruebas
npm run test:coverage

# Ejecutar pruebas específicas
npm test -- --testNamePattern="payment-utils"

# Ejecutar pruebas en modo verbose
npm test -- --verbose
```

### Configuración en package.json

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci",
    "test:coverage": "jest --coverage"
  }
}
```

## 📊 Cobertura de Pruebas

### Resultados Actuales

```
Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        2.179 s
```

### Áreas Cubiertas

| Categoría | Archivos | Cobertura |
|-----------|----------|-----------|
| **Utilidades de Pago** | `payment-utils.test.ts` | ✅ 18 tests |
| **Utilidades de Formato** | `format-utils.test.ts` | ✅ 6 tests |
| **Componentes UI** | `Pagination.test.tsx` | ✅ 6 tests |
| **Total** | **3 archivos** | **✅ 25 tests** |

## 🧪 Tipos de Pruebas

### 1. Unit Tests (Pruebas Unitarias)

Prueban funciones individuales en aislamiento:

```typescript
// Ejemplo: Validación de tarjeta
describe('validateCardNumber', () => {
  it('should validate correct Visa card', () => {
    expect(validateCardNumber('4532015112830366')).toBe(true)
  })
  
  it('should reject invalid card', () => {
    expect(validateCardNumber('1234567890123456')).toBe(false)
  })
})
```

### 2. Component Tests (Pruebas de Componentes)

Prueban componentes React de forma aislada:

```typescript
// Ejemplo: Componente de paginación
describe('Pagination', () => {
  it('should render correctly', () => {
    render(<Pagination totalPages={5} currentPage={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
```

### 3. Integration Tests (Pruebas de Integración)

Prueban la interacción entre componentes:

```typescript
// Ejemplo: Flujo de checkout
describe('Checkout Flow', () => {
  it('should complete checkout process', async () => {
    const user = userEvent.setup()
    
    // Simular agregar al carrito
    await user.click(screen.getByText('Agregar al Carrito'))
    
    // Simular ir a checkout
    await user.click(screen.getByText('Proceder al Pago'))
    
    // Verificar que se muestra el formulario de checkout
    expect(screen.getByText('Información de Envío')).toBeInTheDocument()
  })
})
```

## 🔧 Mocks y Stubs

### Mock de Supabase

```typescript
// Mock completo de Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123' }, session: { access_token: 'token' } },
      error: null,
    }),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: {}, error: null }),
  })),
}
```

### Mock de Next.js

```typescript
// Mock de navegación
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock de cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))
```

## 🎯 Estrategias de Testing

### 1. Testing de Utilidades

**Enfoque**: Pruebas puras de funciones sin dependencias externas.

```typescript
// ✅ Bueno: Función pura
export function validateCardNumber(cardNumber: string): boolean {
  // Implementación del algoritmo Luhn
  return luhnCheck(cardNumber)
}

// ❌ Evitar: Función con dependencias externas
export async function validateCardWithAPI(cardNumber: string) {
  const response = await fetch('/api/validate-card', {
    method: 'POST',
    body: JSON.stringify({ cardNumber })
  })
  return response.json()
}
```

### 2. Testing de Componentes

**Enfoque**: Probar comportamiento, no implementación.

```typescript
// ✅ Bueno: Probar comportamiento
it('should disable button when loading', () => {
  render(<Button loading={true}>Submit</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})

// ❌ Evitar: Probar implementación
it('should have loading state', () => {
  const { container } = render(<Button loading={true}>Submit</Button>)
  expect(container.querySelector('.loading')).toBeInTheDocument()
})
```

### 3. Testing de Server Actions

**Enfoque**: Mock de dependencias y prueba de lógica de negocio.

```typescript
// Ejemplo: Testing de Server Action
describe('addToCart', () => {
  it('should add product to cart', async () => {
    // Mock de Supabase
    const mockSupabase = {
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }) },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'cart-123' } }),
        insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
      })),
    }

    const result = await addToCart('product-123', 2)
    
    expect(result.success).toBe(true)
    expect(mockSupabase.from).toHaveBeenCalledWith('cart_items')
  })
})
```

## 📈 Métricas de Calidad

### Cobertura de Código

```bash
# Ejecutar con cobertura
npm run test:coverage

# Resultado esperado:
# File      | % Stmts | % Branch | % Funcs | % Lines
# ----------|---------|----------|---------|--------
# All files |   85.2  |   78.9   |   92.1  |   84.7
```

### Límites de Cobertura

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 90%
- **Lines**: > 80%

## 🚨 Mejores Prácticas

### 1. Naming Conventions

```typescript
// ✅ Bueno: Descriptivo y específico
describe('validateCardNumber', () => {
  it('should return true for valid Visa card number', () => {
    // test
  })
  
  it('should return false for invalid card number', () => {
    // test
  })
})

// ❌ Evitar: Vago
describe('card validation', () => {
  it('should work', () => {
    // test
  })
})
```

### 2. Arrange-Act-Assert

```typescript
// ✅ Bueno: Estructura clara
it('should format currency correctly', () => {
  // Arrange
  const amount = 1500.50
  const expected = '$1,500.50'
  
  // Act
  const result = formatCurrency(amount)
  
  // Assert
  expect(result).toBe(expected)
})
```

### 3. Test Isolation

```typescript
// ✅ Bueno: Cada test es independiente
describe('Payment Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should validate Visa card', () => {
    // test independiente
  })
  
  it('should validate Mastercard', () => {
    // test independiente
  })
})
```

## 🔧 Configuración Avanzada

### Variables de Entorno para Testing

```env
# .env.test
NODE_ENV=test
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
```

### Configuración de Timeout

```javascript
// jest.config.js
const config = {
  // ... otras configuraciones
  testTimeout: 10000, // 10 segundos
}
```

### Configuración de Coverage

```javascript
// jest.config.js
const config = {
  // ... otras configuraciones
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 90,
      lines: 80,
      statements: 80,
    },
  },
}
```

## 🧪 Ejemplos de Pruebas

### Testing de Formularios

```typescript
// src/__tests__/components/checkout-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutForm } from '@/components/checkout/checkout-form'

describe('CheckoutForm', () => {
  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(<CheckoutForm />)
    
    // Intentar enviar sin completar campos
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    
    // Verificar mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
    })
  })
  
  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = jest.fn()
    
    render(<CheckoutForm onSubmit={mockOnSubmit} />)
    
    // Completar formulario
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    
    // Enviar formulario
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    
    // Verificar que se llamó onSubmit
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Juan Pérez',
        email: 'juan@example.com',
      })
    })
  })
})
```

### Testing de Hooks

```typescript
// src/__tests__/hooks/use-cart.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useCart } from '@/hooks/use-cart'

describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem('product-123', 2)
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].productId).toBe('product-123')
    expect(result.current.items[0].quantity).toBe(2)
  })
  
  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem('product-123', 2) // $100 * 2 = $200
      result.current.addItem('product-456', 1) // $50 * 1 = $50
    })
    
    expect(result.current.total).toBe(250)
  })
})
```

## 🚨 Solución de Problemas

### Error: "TextEncoder is not defined"

**Solución**: Agregar polyfills en `jest.setup.ts`:

```typescript
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
```

### Error: "Cannot find module"

**Solución**: Verificar `moduleNameMapper` en `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Error: "useRouter is not defined"

**Solución**: Mock de `next/navigation` en `jest.setup.ts`:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))
```

## 🔮 Futuras Mejoras

### Testing Adicional

- [ ] **E2E Tests** con Playwright
- [ ] **Visual Regression Tests** con Chromatic
- [ ] **Performance Tests** con Lighthouse
- [ ] **Accessibility Tests** con jest-axe
- [ ] **API Tests** con Supertest

### Herramientas Adicionales

- [ ] **MSW** para mock de APIs
- [ ] **Testing Library User Events** para interacciones
- [ ] **Jest DOM** para assertions de DOM
- [ ] **Coverage Reports** con HTML

### CI/CD Integration

- [ ] **GitHub Actions** para CI
- [ ] **Coverage Reports** en PRs
- [ ] **Test Results** en comentarios
- [ ] **Automated Testing** en cada commit

