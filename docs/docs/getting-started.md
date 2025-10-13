# Guía de Inicio

Esta guía te ayudará a configurar y ejecutar ACEROMAX E-Commerce en tu entorno de desarrollo.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.17 o superior
- **npm** 9.0 o superior
- **Git** para clonar el repositorio
- **Cuenta de Supabase** (gratuita)

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd my-ecommerce
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Service Role Key (solo para operaciones admin)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Configurar Supabase

#### Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia la URL y la clave anónima a tu `.env.local`

#### Aplicar Migraciones

1. Ve al **SQL Editor** en tu dashboard de Supabase
2. Ejecuta las migraciones en orden:

```sql
-- 1. Esquema inicial
-- Ejecutar: supabase/migrations/20251008070249_initial_schema.sql

-- 2. Políticas RLS
-- Ejecutar: supabase/migrations/20251008070405_rls_policies.sql

-- 3. Datos base
-- Ejecutar: supabase/migrations/20251008070811_seed_base_data.sql

-- 4. Correcciones de seguridad
-- Ejecutar: supabase/migrations/20251008071038_fix_security_search_path_v2.sql

-- 5. Sistema de roles admin
-- Ejecutar: supabase/migrations/20251008091720_create_admin_roles_system.sql

-- 6. Corrección de políticas RLS
-- Ejecutar: supabase/migrations/20251008093823_fix_user_roles_rls_policies.sql

-- 7. Fecha estimada de entrega
-- Ejecutar: supabase/migrations/20251008095212_add_estimated_delivery_to_orders.sql
```

#### Configurar Autenticación

1. Ve a **Authentication > Providers**
2. Habilita **Email** provider
3. Habilita **Google** provider:
   - Agrega tu Client ID y Client Secret de Google
   - Configura la URL de callback: `http://localhost:3000/auth/callback`

#### Configurar Email Templates

1. Ve a **Authentication > Email Templates**
2. Actualiza el template de **Magic Link**:

```html
<h2>¡Inicia Sesión en ACEROMAX!</h2>

<p>Haz clic en el siguiente enlace para iniciar sesión:</p>

<p>
  <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">
    Iniciar Sesión
  </a>
</p>

<p>Este enlace expira en 1 hora y solo se puede usar una vez.</p>
```

### 5. Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev

# El servidor estará disponible en http://localhost:3000
```

## 🧪 Verificar la Instalación

### 1. Página Principal

Visita `http://localhost:3000` y verifica que:
- ✅ La página carga correctamente
- ✅ Se muestran productos
- ✅ La navegación funciona
- ✅ El buscador está visible

### 2. Autenticación

1. Ve a `http://localhost:3000/auth/signin`
2. Prueba los tres métodos:
   - **Email + Password**: Crea una cuenta
   - **Magic Link**: Ingresa tu email
   - **Google OAuth**: Click en "Sign in with Google"

### 3. Carrito de Compras

1. Inicia sesión
2. Agrega productos al carrito
3. Verifica que el contador se actualice
4. Ve a `/carrito` y confirma los items

### 4. Panel de Administración

1. Crea un usuario admin en Supabase:

```sql
-- Reemplaza 'user-email@example.com' con tu email
INSERT INTO user_roles (user_id, role, created_by)
SELECT id, 'admin', id
FROM auth.users
WHERE email = 'user-email@example.com';
```

2. Ve a `http://localhost:3000/admin`
3. Verifica que puedas acceder al dashboard

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo CI
npm run test:ci

# Ver cobertura de pruebas
npm run test:coverage
```

## 📚 Ver Documentación

```bash
# Iniciar servidor de documentación
npm run docs

# Build de documentación
npm run docs:build
```

La documentación estará disponible en `http://localhost:3000` (puerto diferente al proyecto principal).

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Linter de código |
| `npm test` | Pruebas en modo watch |
| `npm run test:ci` | Pruebas en modo CI |
| `npm run test:coverage` | Cobertura de pruebas |
| `npm run docs` | Servidor de documentación |
| `npm run docs:build` | Build de documentación |

## 🔧 Configuración Avanzada

### Variables de Entorno Opcionales

```env
# Desarrollo
NODE_ENV=development

# Base de datos
DATABASE_URL=postgresql://...

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (opcional, para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Configuración de Tailwind

El proyecto usa Tailwind CSS 4 con configuración personalizada:

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### Configuración de TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🚨 Solución de Problemas

### Error: "Cannot connect to Supabase"

1. Verifica que las variables de entorno estén correctas
2. Confirma que el proyecto de Supabase esté activo
3. Revisa que no haya restricciones de red

### Error: "RLS policy violation"

1. Verifica que las migraciones se hayan ejecutado
2. Confirma que el usuario tenga los roles correctos
3. Revisa las políticas RLS en Supabase Dashboard

### Error: "OAuth callback failed"

1. Verifica la configuración de Google OAuth
2. Confirma que la URL de callback sea correcta
3. Revisa que el middleware no interfiera con `/auth/callback`

### Error: "Magic link not working"

1. Verifica el template de email en Supabase
2. Confirma que use `{{ .TokenHash }}` y `type=magiclink`
3. Revisa que el callback route esté configurado correctamente

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs**: `npm run dev` muestra errores detallados
2. **Consulta la documentación**: `/docs` tiene información completa
3. **Verifica las pruebas**: `npm test` confirma que todo funciona
4. **Revisa Supabase Dashboard**: Logs y métricas en tiempo real

## 🎯 Próximos Pasos

Una vez que tengas el proyecto funcionando:

1. **Explora las funcionalidades**:
   - Catálogo de productos
   - Sistema de carrito
   - Proceso de checkout
   - Panel de administración

2. **Personaliza el diseño**:
   - Modifica los colores en `tailwind.config.js`
   - Actualiza los componentes en `src/components/ui/`
   - Cambia las imágenes en `public/`

3. **Agrega funcionalidades**:
   - Nuevos tipos de productos
   - Métodos de pago adicionales
   - Sistema de cupones
   - Notificaciones por email

4. **Prepara para producción**:
   - Configura dominio personalizado
   - Optimiza imágenes y assets
   - Configura monitoreo y analytics
   - Implementa backup de base de datos

