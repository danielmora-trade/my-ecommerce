# 🚀 Setup del Primer Administrador

## ⚠️ IMPORTANTE - LEE ESTO PRIMERO

Para acceder al backoffice por primera vez, necesitas crear el primer usuario administrador. Sigue estos pasos:

---

## Paso 1: Registrar un Usuario

1. Ve a tu sitio: `http://localhost:3000`
2. Haz click en **"Iniciar Sesión"** → **"Crear cuenta"**
3. Regístrate con tu email y contraseña
4. Confirma tu cuenta si es necesario (revisa tu email)

---

## Paso 2: Asignar Rol de Admin en Supabase

### Opción A: SQL Editor (Recomendada)

1. Abre **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto **ACEROMAX**
3. Ve a **SQL Editor** (icono de base de datos en la barra lateral)
4. Ejecuta el siguiente SQL (reemplaza con tu email):

```sql
-- Asignar rol de admin al usuario
UPDATE public.user_roles
SET role = 'admin', updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'TU-EMAIL@ejemplo.com'
);

-- Si no existe el registro, créalo
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'TU-EMAIL@ejemplo.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();
```

5. Click en **"Run"** o presiona `Ctrl + Enter`

### Opción B: Table Editor

1. Abre **Supabase Dashboard**
2. Ve a **Table Editor**
3. Selecciona la tabla `user_roles`
4. Si ya existe un registro para tu usuario:
   - Haz click en él
   - Cambia el campo `role` de `customer` a `admin`
   - Guarda
5. Si NO existe un registro:
   - Click en **"Insert row"**
   - Busca el `user_id` en la tabla `auth.users` (copia el UUID)
   - Pega el UUID en `user_id`
   - En `role` escribe: `admin`
   - Guarda

---

## Paso 3: Acceder al Backoffice

1. Refresca la página de tu navegador (`F5`)
2. Ve a: `http://localhost:3000/admin`
3. Deberías ver el **Dashboard del Backoffice** 🎉

---

## Verificación Rápida

Para verificar que el rol se asignó correctamente:

```sql
-- Ver usuarios con sus roles
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
```

Deberías ver tu email con `role = admin`.

---

## ❌ Solución de Problemas

### No puedo acceder a /admin (redirige a login)
- Asegúrate de haber iniciado sesión
- Limpia cookies del navegador
- Intenta en ventana de incógnito

### Me dice "No autorizado"
- Verifica que el rol esté en `admin` (no `customer`)
- Refresca la página después de cambiar el rol
- Cierra sesión y vuelve a iniciar

### El SQL no funciona
- Verifica que el email sea exactamente el mismo (case-sensitive)
- Asegúrate de estar ejecutando en el proyecto correcto de Supabase
- Revisa que la tabla `user_roles` exista

---

## 🎯 Próximos Pasos

Una vez que tengas acceso al backoffice:

1. **Explora el Dashboard**: `/admin`
2. **Agrega Productos**: `/admin/productos` → "Agregar Producto"
3. **Gestiona Usuarios**: Puedes asignar más admins/managers siguiendo el mismo proceso

---

## 📚 Documentación Adicional

- **Guía Completa**: `BACKOFFICE_IMPLEMENTADO.md`
- **Gestión de Roles**: `GUIA_GESTION_ROLES.md`

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los archivos de documentación
2. Verifica los logs de Supabase
3. Asegúrate de que las migraciones se aplicaron correctamente

**¡Listo! Ya tienes tu backoffice funcionando** 🚀

