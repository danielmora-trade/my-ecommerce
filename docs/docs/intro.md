# Introducción

Bienvenido a la documentación de **ACEROMAX**, una plataforma de comercio electrónico moderna y completa para la distribución de aceros y materiales de construcción.

## 🎯 Visión General

ACEROMAX es una aplicación e-commerce full-stack construida con las últimas tecnologías web, diseñada específicamente para la industria de distribución de aceros y materiales.

## ⚡ Características Principales

### Para Clientes
- 🛍️ **Catálogo de Productos**: Navegación intuitiva por categorías
- 🔍 **Búsqueda Avanzada**: Encuentra productos rápidamente
- 🛒 **Carrito de Compras**: Gestión completa del carrito
- 💳 **Múltiples Métodos de Pago**: Pago en sitio o contra entrega
- 📦 **Seguimiento de Pedidos**: Rastrea tus órdenes en tiempo real
- 👤 **Gestión de Perfil**: Administra tus datos y direcciones

### Para Administradores
- 📊 **Panel de Administración**: Dashboard completo
- 📦 **Gestión de Productos**: CRUD completo de productos
- 🛒 **Gestión de Pedidos**: Administra y actualiza pedidos
- 👥 **Gestión de Usuarios**: Control de roles y permisos
- 📈 **Estadísticas**: Visualiza métricas del negocio

## 🛠️ Stack Tecnológico

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js Server Actions, API Routes |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email, Magic Link, OAuth) |
| **UI Components** | Shadcn/ui, Radix UI |
| **Testing** | Jest, React Testing Library |
| **Documentation** | Docusaurus |

## 📁 Estructura del Proyecto

```
my-ecommerce/
├── docs/                    # Documentación (Docusaurus)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Rutas de autenticación
│   │   ├── admin/          # Panel de administración
│   │   ├── api/            # API Routes
│   │   └── ...             # Páginas públicas
│   ├── components/         # Componentes React
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── admin/          # Componentes del admin
│   │   ├── cart/           # Componentes del carrito
│   │   ├── checkout/       # Componentes de checkout
│   │   ├── products/       # Componentes de productos
│   │   └── ui/             # Componentes UI reutilizables
│   ├── lib/                # Utilidades y configuraciones
│   │   ├── supabase/       # Clientes de Supabase
│   │   └── payment-utils.ts # Utilidades de pago
│   ├── types/              # Tipos de TypeScript
│   └── __tests__/          # Pruebas unitarias
├── supabase/
│   └── migrations/         # Migraciones de base de datos
└── public/                 # Assets estáticos
```

## 🚀 Inicio Rápido

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar migraciones de base de datos
# (Consulta la sección de Base de Datos)

# Iniciar servidor de desarrollo
npm run dev
```

## 📚 Próximos Pasos

- [Guía de Inicio](/getting-started) - Configuración del proyecto
- [Arquitectura](/architecture) - Diseño del sistema
- [Autenticación](/authentication) - Implementación de auth
- [Base de Datos](/database) - Esquema y migraciones
- [Testing](/testing) - Ejecutar y escribir pruebas

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor lee nuestra guía de contribución antes de enviar un PR.

## 📝 Licencia

Este proyecto es privado y propietario.

