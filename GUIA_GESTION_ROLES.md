# Guía Rápida: Gestión de Roles y Permisos

## 🚀 Inicio Rápido

### Crear el Primer Administrador

1. **Regístrate** normalmente en el sitio
2. Abre **Supabase Dashboard** → SQL Editor
3. Ejecuta (reemplaza con tu email):

```sql
UPDATE public.user_roles
SET role = 'admin', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com');
```

4. Refresca y ve a `/admin`

---

## 📝 Asignar Roles

### Método 1: SQL Editor (Recomendado)

```sql
-- Admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@ejemplo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Manager
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'manager'
FROM auth.users
WHERE email = 'manager@ejemplo.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'manager';
```

### Método 2: Table Editor

1. **Table Editor** → `user_roles`
2. **Insert row**
3. Ingresa:
   - `user_id`: UUID del usuario
   - `role`: `admin`, `manager` o `customer`

---

## 🔍 Consultar Roles

```sql
-- Ver usuarios y sus roles
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;

-- Buscar por email
SELECT 
  u.id,
  u.email,
  ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'usuario@ejemplo.com';
```

---

## 🔐 Roles Disponibles

| Rol | Acceso |
|-----|--------|
| `admin` | Backoffice completo |
| `manager` | Productos y pedidos |
| `customer` | Solo sitio público (por defecto) |

---

## 💻 Uso en Código

### Verificar Roles

```typescript
import { isAdmin, isAdminOrManager } from '@/app/admin/auth-actions'

// En Server Component
const canAccess = await isAdminOrManager()

// En Server Action
export async function myAction() {
  if (!await isAdmin()) {
    return { error: 'No autorizado' }
  }
  // Tu código aquí
}
```

### Proteger Páginas

```typescript
import { isAdminOrManager } from '@/app/admin/auth-actions'
import { redirect } from 'next/navigation'

export default async function MyPage() {
  if (!await isAdminOrManager()) {
    redirect('/')
  }
  
  return <div>Contenido protegido</div>
}
```

---

## 🛠️ Comandos Útiles

### Cambiar Rol de un Usuario

```sql
-- De customer a admin
UPDATE public.user_roles
SET role = 'admin', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'usuario@ejemplo.com');
```

### Revocar Permisos de Admin

```sql
-- De admin a customer
UPDATE public.user_roles
SET role = 'customer', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ex-admin@ejemplo.com');
```

### Ver Todos los Admins

```sql
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at;
```

---

## ✅ Checklist

- [ ] Crear primer admin
- [ ] Probar acceso a `/admin`
- [ ] Asignar roles adicionales si es necesario
- [ ] Verificar que customers no accedan al backoffice

---

## 📚 Más Información

Ver documentación completa en `BACKOFFICE_IMPLEMENTADO.md`

