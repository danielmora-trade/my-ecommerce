# ACEROMAX E-Commerce

Plataforma de comercio electrónico para distribución de aceros y materiales de construcción.

## 🚀 Características

- ✅ Catálogo completo de productos con búsqueda y filtros
- ✅ Sistema de autenticación (Email, Magic Link, OAuth Google)
- ✅ Carrito de compras persistente
- ✅ Checkout completo con múltiples métodos de pago
- ✅ Panel de administración para gestión de productos y pedidos
- ✅ Sistema de roles y permisos
- ✅ Gestión de pedidos y seguimiento
- ✅ Pruebas unitarias con Jest
- ✅ Documentación completa con Docusaurus

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **UI**: Shadcn/ui, Radix UI
- **Testing**: Jest, React Testing Library
- **Docs**: Docusaurus

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd my-ecommerce

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo CI
npm run test:ci

# Ver cobertura de pruebas
npm run test:coverage

# Verificación de tipos
npm run type-check

# Linting
npm run lint
```

## 🔄 CI/CD Pipeline

El proyecto incluye un pipeline completo de GitHub Actions que se ejecuta automáticamente en cada push a `develop` o `main`:

- ✅ **Code Quality**: Type checking, linting, security audit
- ✅ **Unit Tests**: Tests con cobertura de código
- ✅ **Documentation Build**: Verificación de documentación
- ✅ **Deploy to Vercel**: Despliegue automático (solo si todos los checks pasan)

### Configuración del Pipeline

Ver [Guía Completa de Configuración](.github/PIPELINE_SETUP.md) para:
- Configurar GitHub Secrets
- Configurar Vercel
- Obtener tokens y IDs necesarios
- Solución de problemas

### Secrets Requeridos en GitHub

| Secret | Descripción |
|--------|-------------|
| `VERCEL_TOKEN` | Token de autenticación de Vercel |
| `VERCEL_ORG_ID` | ID de organización/cuenta Vercel |
| `VERCEL_PROJECT_ID` | ID del proyecto Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |

## 📚 Documentación

La documentación completa está disponible en el directorio `/docs`:

```bash
cd docs
npm install
npm start
```

O bien, puedes desde la raíz del proyecto ejecutar el siguiente comando para generar la documentación:

```bash
npm run docs
```

Visita http://localhost:3000 para ver la documentación.

## 🗄️ Base de Datos

Este proyecto usa Supabase. Las migraciones se encuentran en `/supabase/migrations`.

Para aplicar migraciones:
1. Ve a tu proyecto en Supabase Dashboard
2. Navega a SQL Editor
3. Ejecuta las migraciones en orden

## 🔑 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## 📁 Estructura del Proyecto

```
my-ecommerce/
├── docs/                    # Documentación (Docusaurus)
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilidades
│   ├── types/              # Tipos TypeScript
│   └── __tests__/          # Pruebas
├── supabase/
│   └── migrations/         # Migraciones DB
└── public/                 # Assets estáticos
```

## 🚦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm start` - Servidor de producción
- `npm run lint` - Linter
- `npm test` - Ejecutar pruebas
- `npm run test:ci` - Pruebas en CI
- `npm run test:coverage` - Cobertura de pruebas

## 📝 Licencia

Privado y propietario.
