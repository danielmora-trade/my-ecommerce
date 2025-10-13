# Deployment

Guía completa para desplegar ACEROMAX E-Commerce en producción.

## 🚀 Opciones de Deployment

### 1. Vercel (Recomendado)

Vercel es la plataforma ideal para Next.js con soporte nativo.

#### Configuración Inicial

1. **Conectar repositorio**:
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   ```

2. **Variables de entorno**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Configuración de dominio**:
   - Ve a Project Settings > Domains
   - Agrega tu dominio personalizado
   - Configura DNS según las instrucciones

#### Configuración de Supabase para Producción

1. **Actualizar URLs de redirect**:
   - Ve a Authentication > URL Configuration
   - Agrega tu dominio de producción
   - Actualiza Site URL

2. **Configurar OAuth**:
   - Actualiza URLs de callback en Google Console
   - Agrega dominio de producción en Supabase

### 2. Netlify

Alternativa a Vercel con buenas características.

#### Configuración

1. **Build settings**:
   ```yaml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Variables de entorno**:
   - Ve a Site Settings > Environment Variables
   - Agrega todas las variables de Supabase

### 3. Docker

Para deployment en servidores propios.

#### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

## 🔧 Configuración de Producción

### Variables de Entorno

```env
# Producción
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Opcional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Opcional: Sentry para error tracking
SENTRY_DSN=https://your-sentry-dsn
```

### Configuración de Next.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['your-project.supabase.co'],
  },
  // Optimizaciones para producción
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
```

### Configuración de Supabase

#### 1. Actualizar URLs de Autenticación

```sql
-- En Supabase Dashboard > Authentication > URL Configuration
-- Site URL: https://your-domain.com
-- Redirect URLs: 
--   https://your-domain.com/auth/callback
--   http://localhost:3000/auth/callback (para desarrollo)
```

#### 2. Configurar CORS

```sql
-- En Supabase Dashboard > Settings > API
-- CORS Origins: 
--   https://your-domain.com
--   http://localhost:3000
```

#### 3. Configurar Email Templates

Actualizar templates para usar el dominio de producción:

```html
<!-- Magic Link Template -->
<h2>¡Inicia Sesión en ACEROMAX!</h2>
<p>Haz clic en el siguiente enlace para iniciar sesión:</p>
<p>
  <a href="https://your-domain.com/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">
    Iniciar Sesión
  </a>
</p>
```

## 🛡️ Seguridad en Producción

### 1. Variables de Entorno

```bash
# Nunca commitees estas variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Headers de Seguridad

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 3. Configuración de Supabase

#### Habilitar SSL Enforcement

```sql
-- En Supabase Dashboard > Settings > Database
-- Habilitar "SSL Enforcement"
```

#### Configurar Network Restrictions

```sql
-- En Supabase Dashboard > Settings > Database
-- Agregar IPs permitidas (opcional)
```

## 📊 Monitoreo y Analytics

### 1. Vercel Analytics

```bash
# Instalar
npm install @vercel/analytics

# Configurar
# src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Error Tracking con Sentry

```bash
# Instalar
npm install @sentry/nextjs

# Configurar
# sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### 3. Performance Monitoring

```javascript
// next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}

// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Variables de Secrets

```bash
# En GitHub > Settings > Secrets
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-org-id
PROJECT_ID=your-project-id
```

## 📈 Optimizaciones de Performance

### 1. Build Optimization

```javascript
// next.config.js
module.exports = {
  // Habilitar compresión
  compress: true,
  
  // Optimizar imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Optimizar bundles
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
}
```

### 2. Database Optimization

```sql
-- Índices para mejorar performance
CREATE INDEX CONCURRENTLY idx_products_category_active 
ON products(category_id, is_active) 
WHERE is_active = true;

CREATE INDEX CONCURRENTLY idx_orders_user_status 
ON orders(user_id, status);

CREATE INDEX CONCURRENTLY idx_cart_items_cart_product 
ON cart_items(cart_id, product_id);
```

### 3. Caching Strategy

```typescript
// src/app/products/page.tsx
import { unstable_cache } from 'next/cache'

const getCachedProducts = unstable_cache(
  async (page: number, limit: number) => {
    return getAllProducts(page, limit)
  },
  ['products'],
  {
    revalidate: 3600, // 1 hora
    tags: ['products']
  }
)
```

## 🔍 Health Checks

### Endpoint de Health Check

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test database connection
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json(
        { status: 'error', message: 'Database connection failed' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    )
  }
}
```

### Monitoring Setup

```bash
# Uptime monitoring
curl -f https://your-domain.com/api/health || exit 1

# Database monitoring
curl -f https://your-project.supabase.co/rest/v1/products?select=id&limit=1 \
  -H "apikey: $SUPABASE_ANON_KEY"
```

## 🚨 Troubleshooting

### Error: "Build failed"

**Causas comunes**:
- Variables de entorno faltantes
- Errores de TypeScript
- Dependencias no instaladas

**Solución**:
```bash
# Verificar build localmente
npm run build

# Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL

# Verificar tipos
npm run type-check
```

### Error: "Database connection failed"

**Causas**:
- URL de Supabase incorrecta
- Clave anónima inválida
- Restricciones de red

**Solución**:
1. Verificar variables de entorno
2. Probar conexión desde Supabase Dashboard
3. Revisar logs de Supabase

### Error: "OAuth callback failed"

**Causas**:
- URL de callback incorrecta
- Configuración de Google OAuth

**Solución**:
1. Verificar URLs en Google Console
2. Actualizar redirect URLs en Supabase
3. Verificar configuración de dominio

## 📊 Métricas de Producción

### KPIs a Monitorear

- **Performance**: LCP, FID, CLS
- **Uptime**: Disponibilidad del sitio
- **Errors**: Tasa de errores 4xx/5xx
- **Database**: Queries lentas, conexiones
- **Business**: Conversiones, abandono de carrito

### Herramientas Recomendadas

- **Vercel Analytics**: Performance y uso
- **Sentry**: Error tracking
- **Supabase Dashboard**: Métricas de DB
- **Google Analytics**: Comportamiento de usuarios
- **Uptime Robot**: Monitoreo de disponibilidad

## 🔮 Escalabilidad

### Horizontal Scaling

- **Vercel**: Escalado automático
- **Supabase**: Planes escalables
- **CDN**: Assets estáticos optimizados
- **Edge Functions**: Lógica en edge (futuro)

### Vertical Scaling

- **Database**: Upgrade de plan de Supabase
- **Compute**: Más recursos en Vercel
- **Storage**: Supabase Storage escalable

### Optimizaciones Futuras

- [ ] **Redis Cache**: Para datos frecuentes
- [ ] **Read Replicas**: Para consultas pesadas
- [ ] **Edge Functions**: Lógica en edge
- [ ] **Microservices**: Separación de responsabilidades
