# Backoffice ACEROMAX - Sistema de Administración

## 🎯 Resumen

Se ha implementado un **backoffice completo** para la gestión del e-commerce ACEROMAX, incluyendo:
- ✅ Sistema de roles y permisos (Admin, Manager, Customer)
- ✅ Panel de administración con sidebar
- ✅ CRUD completo de productos
- ✅ Dashboard con estadísticas
- ✅ Protección de rutas con verificación de roles
- ✅ Políticas RLS en Supabase

## 📚 Tabla de Contenidos

1. [Estructura de Roles](#estructura-de-roles)
2. [Gestión de Permisos en Supabase](#gestión-de-permisos-en-supabase)
3. [Gestión de Permisos en el Proyecto](#gestión-de-permisos-en-el-proyecto)
4. [Acceso al Backoffice](#acceso-al-backoffice)
5. [Funcionalidades Implementadas](#funcionalidades-implementadas)
6. [Arquitectura y Archivos](#arquitectura-y-archivos)

---

## 1. Estructura de Roles

### Roles Disponibles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **admin** | Administrador total | Acceso completo al backoffice, gestión de productos, usuarios y configuración |
| **manager** | Gerente/Editor | Acceso a gestión de productos y pedidos (sin configuración) |
| **customer** | Cliente | Acceso solo al sitio público (sin backoffice) |

### Asignación Automática
- **Por defecto**: Todos los usuarios nuevos reciben el rol `customer` automáticamente al registrarse.
- **Trigger de Supabase**: El rol se asigna mediante un trigger de base de datos.

---

## 2. Gestión de Permisos en Supabase

### 📋 Cómo Asignar Roles Manualmente

#### Opción 1: SQL Editor de Supabase

1. Abre **Supabase Dashboard** → Tu proyecto
2. Ve a **SQL Editor**
3. Ejecuta el siguiente query para asignar un rol de **admin**:

```sql
-- Reemplaza 'email@ejemplo.com' con el email del usuario
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT id, 'admin', id
FROM auth.users
WHERE email = 'email@ejemplo.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();
```

4. Para asignar rol de **manager**:

```sql
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT id, 'manager', id
FROM auth.users
WHERE email = 'manager@ejemplo.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'manager', updated_at = NOW();
```

#### Opción 2: Table Editor de Supabase

1. Abre **Supabase Dashboard** → **Table Editor**
2. Selecciona la tabla `user_roles`
3. Haz click en **Insert** → **Insert row**
4. Ingresa:
   - `user_id`: El UUID del usuario (cópialo desde la tabla `auth.users`)
   - `role`: `admin`, `manager` o `customer`
5. Guarda

#### Opción 3: Via Consulta

```sql
-- Ver todos los usuarios y sus emails
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Ver roles actuales
SELECT 
  ur.user_id,
  u.email,
  ur.role,
  ur.created_at
FROM public.user_roles ur
LEFT JOIN auth.users u ON u.id = ur.user_id
ORDER BY ur.created_at DESC;
```

### 🔒 Políticas RLS Implementadas

La tabla `user_roles` tiene las siguientes políticas de seguridad:

| Política | Descripción |
|----------|-------------|
| **Users can view own role** | Los usuarios pueden ver su propio rol |
| **Admins can view all roles** | Solo admins pueden ver todos los roles |
| **Admins can insert roles** | Solo admins pueden crear roles |
| **Admins can update roles** | Solo admins pueden modificar roles |
| **Admins can delete roles** | Solo admins pueden eliminar roles |

### 🛠️ Funciones Helper en Supabase

Se crearon funciones SQL para facilitar la verificación de roles:

```sql
-- Verificar si un usuario es admin
SELECT public.is_admin('user-uuid-here');

-- Verificar si un usuario tiene un rol específico
SELECT public.has_role('user-uuid-here', 'manager');
```

---

## 3. Gestión de Permisos en el Proyecto

### Server Actions para Roles

Ubicación: `src/app/admin/auth-actions.ts`

#### Funciones Disponibles

```typescript
// Verificar si el usuario actual es admin
const isUserAdmin = await isAdmin()

// Verificar si el usuario es admin o manager
const hasAccess = await isAdminOrManager()

// Verificar si el usuario tiene un rol específico
const isManager = await hasRole('manager')

// Obtener el rol del usuario actual
const role = await getCurrentUserRole()

// Asignar rol a un usuario (solo admin)
const result = await assignRole(userId, 'admin')

// Obtener todos los usuarios con roles (solo admin)
const users = await getAllUsersWithRoles()
```

#### Ejemplo de Uso en Componentes

```typescript
// En un Server Component
import { isAdminOrManager } from '@/app/admin/auth-actions'

export default async function MyPage() {
  const hasPermission = await isAdminOrManager()
  
  if (!hasPermission) {
    redirect('/')
  }
  
  // Contenido protegido...
}
```

#### Ejemplo de Uso en Server Actions

```typescript
'use server'

import { isAdmin } from '@/app/admin/auth-actions'

export async function deleteUser(userId: string) {
  const isUserAdmin = await isAdmin()
  
  if (!isUserAdmin) {
    return { success: false, error: 'No autorizado' }
  }
  
  // Lógica de eliminación...
}
```

### Protección de Rutas

El layout de admin (`src/app/admin/layout.tsx`) protege automáticamente todas las rutas bajo `/admin`:

1. **Verifica autenticación**: Redirige a login si no hay sesión
2. **Verifica rol**: Redirige a home si no es admin/manager
3. **Aplica layout**: Muestra sidebar y header solo para usuarios autorizados

---

## 4. Acceso al Backoffice

### URL de Acceso

```
https://tu-dominio.com/admin
```

### Flujo de Acceso

1. **Usuario sin sesión**: Redirigido a `/auth/signin?redirect=/admin`
2. **Usuario customer**: Redirigido a `/?error=unauthorized`
3. **Usuario admin/manager**: Acceso concedido al backoffice

### Primer Admin del Sistema

Para crear el primer administrador del sistema:

1. Regístrate normalmente en el sitio
2. Ve a Supabase Dashboard
3. Ejecuta el siguiente SQL (reemplaza con tu email):

```sql
-- Crear el primer admin
UPDATE public.user_roles
SET role = 'admin', updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com'
);

-- Si no existe el registro, créalo
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'tu-email@ejemplo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

4. Refresca la página y accede a `/admin`

---

## 5. Funcionalidades Implementadas

### 📊 Dashboard Principal

**Ruta**: `/admin`

**Características**:
- ✅ Estadísticas de productos (total, activos, bajo stock, sin stock)
- ✅ Tarjetas de accesos rápidos
- ✅ Vista general del negocio

### 📦 Gestión de Productos

**Ruta**: `/admin/productos`

**Características**:
- ✅ **Lista de productos** con tabla completa
  - Nombre, categoría, SKU, stock, precio
  - Estado activo/inactivo
  - Indicador visual de stock bajo (amarillo) y sin stock (rojo)
- ✅ **Agregar producto** (`/admin/productos/nuevo`)
  - Formulario completo con validaciones
  - Auto-generación de slug desde el nombre
  - Campos: nombre, slug, SKU, descripción, precio, descuento, stock, peso, categoría
- ✅ **Editar producto** (`/admin/productos/[id]/editar`)
  - Pre-carga datos existentes
  - Actualización en tiempo real
- ✅ **Activar/Desactivar producto**
  - Toggle directo desde la tabla
  - Sin eliminación física (soft delete)
- ✅ **Ver producto en tienda** (botón de ojo)
- ✅ **Paginación** (20 productos por página)
- ✅ **Revalidación automática** de cache tras cambios

### 🛍️ Otras Secciones

Las siguientes secciones tienen páginas placeholder (en desarrollo):

- `/admin/pedidos` - Gestión de pedidos
- `/admin/categorias` - Gestión de categorías
- `/admin/usuarios` - Gestión de usuarios y roles
- `/admin/estadisticas` - Análisis y reportes
- `/admin/configuracion` - Configuración del sistema

---

## 6. Arquitectura y Archivos

### Estructura de Directorios

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx                    # Layout protegido del admin
│       ├── page.tsx                      # Dashboard principal
│       ├── auth-actions.ts               # Server actions de roles
│       ├── product-actions.ts            # Server actions de productos
│       ├── productos/
│       │   ├── page.tsx                  # Lista de productos
│       │   ├── nuevo/
│       │   │   └── page.tsx              # Crear producto
│       │   └── [id]/
│       │       └── editar/
│       │           └── page.tsx          # Editar producto
│       ├── pedidos/
│       │   └── page.tsx
│       ├── categorias/
│       │   └── page.tsx
│       ├── usuarios/
│       │   └── page.tsx
│       ├── estadisticas/
│       │   └── page.tsx
│       └── configuracion/
│           └── page.tsx
└── components/
    └── admin/
        ├── admin-sidebar.tsx             # Sidebar de navegación
        ├── admin-header.tsx              # Header del admin
        ├── product-form.tsx              # Formulario de productos
        └── products-table.tsx            # Tabla de productos
```

### Archivos Creados (19 nuevos)

#### Migraciones de Base de Datos (1)
1. `supabase/migrations/[timestamp]_create_admin_roles_system.sql`

#### Server Actions (2)
2. `src/app/admin/auth-actions.ts`
3. `src/app/admin/product-actions.ts`

#### Layouts y Páginas Admin (12)
4. `src/app/admin/layout.tsx`
5. `src/app/admin/page.tsx`
6. `src/app/admin/productos/page.tsx`
7. `src/app/admin/productos/nuevo/page.tsx`
8. `src/app/admin/productos/[id]/editar/page.tsx`
9. `src/app/admin/pedidos/page.tsx`
10. `src/app/admin/categorias/page.tsx`
11. `src/app/admin/usuarios/page.tsx`
12. `src/app/admin/estadisticas/page.tsx`
13. `src/app/admin/configuracion/page.tsx`

#### Componentes Admin (4)
14. `src/components/admin/admin-sidebar.tsx`
15. `src/components/admin/admin-header.tsx`
16. `src/components/admin/product-form.tsx`
17. `src/components/admin/products-table.tsx`

#### Documentación (2)
18. `BACKOFFICE_IMPLEMENTADO.md` (este archivo)
19. `GUIA_GESTION_ROLES.md` (guía rápida)

---

## 🎨 Diseño del Backoffice

### Características Visuales

- ✅ **Sidebar fijo** (desktop) con navegación
- ✅ **Header sticky** con notificaciones
- ✅ **Diseño formal** y profesional
- ✅ **Responsive** (preparado para móvil)
- ✅ **Color scheme**: Gris oscuro (sidebar) + Brand colors
- ✅ **Estados visuales**: Hover, active, disabled
- ✅ **Iconos** de Lucide React
- ✅ **Feedback visual**: Toast notifications para acciones

### Paleta de Colores

| Elemento | Color |
|----------|-------|
| Sidebar | `bg-gray-900` |
| Sidebar Active | `bg-gray-800` |
| Brand Primary | `brand-600` (rojo) |
| Success | `green-600` |
| Warning | `yellow-600` |
| Danger | `red-600` |
| Text Primary | `gray-900` |
| Text Secondary | `gray-600` |

---

## 🔐 Seguridad

### Capas de Seguridad

1. **Layout Protection**: Verificación en `src/app/admin/layout.tsx`
2. **Server Actions**: Cada acción verifica permisos
3. **RLS Policies**: Supabase protege a nivel de base de datos
4. **TypeScript**: Type safety en todo el código

### Mejores Prácticas Implementadas

- ✅ Verificación de roles en cada server action
- ✅ RLS habilitado en todas las tablas sensibles
- ✅ No exponer UUIDs en URLs públicas
- ✅ Validación de datos en formularios
- ✅ Mensajes de error genéricos (sin exponer detalles de BD)
- ✅ Revalidación de cache tras mutaciones

---

## 🧪 Testing del Backoffice

### Casos de Prueba

#### 1. Acceso Sin Autenticación
```
Acción: Ir a /admin sin sesión
Resultado Esperado: Redirige a /auth/signin?redirect=/admin
```

#### 2. Acceso como Customer
```
Acción: Ir a /admin con rol customer
Resultado Esperado: Redirige a /?error=unauthorized
```

#### 3. Acceso como Admin
```
Acción: Ir a /admin con rol admin
Resultado Esperado: Muestra dashboard del backoffice
```

#### 4. Crear Producto
```
Acción: Llenar formulario y guardar
Resultado Esperado: Producto creado, toast de éxito, redirige a lista
```

#### 5. Editar Producto
```
Acción: Modificar producto existente
Resultado Esperado: Producto actualizado, cache revalidado
```

#### 6. Activar/Desactivar Producto
```
Acción: Click en botón de power
Resultado Esperado: Estado cambia, toast de confirmación
```

---

## 📖 Guía Rápida de Uso

### Para Desarrolladores

#### Asignar Rol de Admin a un Usuario

```typescript
// Opción 1: SQL directo en Supabase
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'usuario@ejemplo.com');

// Opción 2: Usando server action (desde código, requiere ser admin)
import { assignRole } from '@/app/admin/auth-actions'
await assignRole('user-uuid', 'admin')
```

#### Verificar Rol en Código

```typescript
// En Server Component
import { isAdminOrManager } from '@/app/admin/auth-actions'

const hasAccess = await isAdminOrManager()
if (!hasAccess) {
  // No autorizado
}

// En Server Action
'use server'
import { isAdmin } from '@/app/admin/auth-actions'

export async function myAction() {
  if (!await isAdmin()) {
    return { error: 'No autorizado' }
  }
  // Tu lógica aquí
}
```

### Para Administradores

#### Gestionar Productos

1. **Ver productos**: `/admin/productos`
2. **Agregar producto**: Click en "Agregar Producto"
   - Completa el formulario
   - Click en "Guardar Producto"
3. **Editar producto**: Click en icono de lápiz
4. **Desactivar producto**: Click en icono de power
5. **Ver en tienda**: Click en icono de ojo

#### Asignar Roles a Usuarios

**Actualmente**: Manual desde Supabase
**Próximamente**: Interface en `/admin/usuarios`

**Pasos actuales**:
1. Ve a Supabase Dashboard
2. Table Editor → `user_roles`
3. Busca el usuario o inserta nuevo registro
4. Cambia el `role` a `admin` o `manager`

---

## 🚀 Próximas Mejoras

### Corto Plazo
- [ ] Interfaz UI para gestión de roles en `/admin/usuarios`
- [ ] Búsqueda y filtros en tabla de productos
- [ ] Carga masiva de productos (CSV import)
- [ ] Gestión de imágenes de productos

### Mediano Plazo
- [ ] Dashboard de pedidos con filtros
- [ ] CRUD de categorías
- [ ] Sistema de notificaciones
- [ ] Logs de actividad admin

### Largo Plazo
- [ ] Reportes y exportación
- [ ] Multi-idioma en backoffice
- [ ] Roles personalizados (custom permissions)
- [ ] API para integraciones

---

## ❓ Preguntas Frecuentes

### ¿Cómo creo el primer admin?

Ver sección: [Primer Admin del Sistema](#primer-admin-del-sistema)

### ¿Puedo tener múltiples admins?

Sí, puedes asignar el rol `admin` a tantos usuarios como necesites ejecutando el SQL apropiado.

### ¿Cuál es la diferencia entre admin y manager?

- **Admin**: Acceso total al backoffice, incluyendo configuración y gestión de usuarios
- **Manager**: Acceso a productos y pedidos, pero no a configuración ni usuarios

### ¿Los customers pueden acceder al backoffice?

No, los usuarios con rol `customer` no pueden acceder a `/admin` y serán redirigidos.

### ¿Cómo elimino un producto?

No hay eliminación física. Usa el botón de "power" para desactivar productos. Esto los oculta del sitio público pero los mantiene en la base de datos.

### ¿Se puede cambiar el rol de un usuario desde la app?

Por ahora no hay interfaz, pero está planificado para `/admin/usuarios`. Actualmente se hace desde Supabase o mediante server actions programáticamente.

---

## 📞 Soporte

### Problemas Comunes

#### "No autorizado" al acceder a /admin

**Causa**: Tu usuario no tiene rol de admin o manager  
**Solución**: Asigna el rol correcto desde Supabase SQL Editor

#### No se muestran los productos en la tabla

**Causa**: No hay productos o error de permisos  
**Solución**: 
1. Verifica que existan productos en la BD
2. Confirma que las políticas RLS estén activas
3. Revisa la consola del navegador por errores

#### Error al crear/editar producto

**Causa**: Validación fallida o permisos insuficientes  
**Solución**:
1. Completa todos los campos obligatorios (*)
2. Verifica que el SKU sea único
3. Confirma que tu usuario sea admin/manager

---

## ✅ Checklist de Implementación

- [x] Sistema de roles en Supabase
- [x] Trigger de asignación automática de rol customer
- [x] Políticas RLS para user_roles
- [x] Server actions de autenticación de roles
- [x] Server actions de gestión de productos
- [x] Layout protegido del admin
- [x] Sidebar con navegación
- [x] Dashboard con estadísticas
- [x] CRUD completo de productos
- [x] Formulario de productos con validaciones
- [x] Tabla de productos con paginación
- [x] Activar/desactivar productos
- [x] Páginas placeholder para otras secciones
- [x] Documentación completa
- [x] Compilación exitosa

---

**Fecha de Implementación**: 8 de octubre de 2025  
**Status**: ✅ Backoffice Operacional  
**Versión**: 1.0.0

