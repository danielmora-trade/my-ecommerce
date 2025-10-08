# 🔧 Solución: Error de Referencia Circular en Políticas RLS

## 🐛 Problema Encontrado

Los usuarios con rol de `admin` correctamente asignado en la tabla `user_roles` **no podían acceder al backoffice** (`/admin`) y eran redirigidos al home con error "No autorizado".

### Causa Raíz

Las políticas RLS (Row Level Security) de la tabla `user_roles` tenían una **referencia circular**:

1. El código intenta verificar si el usuario es admin
2. La política RLS "Admins can view all roles" verifica si el usuario es admin
3. Para verificar esto, intenta consultar la tabla `user_roles`
4. Pero la tabla `user_roles` está protegida por RLS que necesita verificar... si es admin
5. **Ciclo infinito** → Consulta bloqueada → Usuario sin acceso

### Políticas Problemáticas (Antes)

```sql
-- Esta política causaba el problema
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles  -- ← Consulta recursiva!
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

---

## ✅ Solución Implementada

### Paso 1: Usar Función con SECURITY DEFINER

Creamos/actualizamos la función `is_admin()` con `SECURITY DEFINER`:

```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = user_uuid
  LIMIT 1;
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
```

**¿Qué hace `SECURITY DEFINER`?**
- Ejecuta la función con los permisos del **creador** de la función (superusuario)
- **Bypasea las políticas RLS** durante la ejecución
- Rompe el ciclo de referencia circular

### Paso 2: Actualizar Políticas RLS

```sql
-- Política simple para usuarios (ver su propio rol)
CREATE POLICY "Users can view own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas para admins (usan la función SECURITY DEFINER)
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin(auth.uid()));  -- ← Usa la función

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.is_admin(auth.uid()));
```

### Paso 3: Mejorar Logs en el Código

Agregamos logs detallados en `src/app/admin/auth-actions.ts` para facilitar depuración:

```typescript
export async function isAdminOrManager(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    return false
  }
  
  if (!user) {
    console.log('No user found')
    return false
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user role:', error)
    console.log('User ID:', user.id)
    return false
  }

  if (!data) {
    console.log('No role data found for user:', user.id)
    return false
  }

  console.log('User role:', data.role)
  return data.role === 'admin' || data.role === 'manager'
}
```

---

## 🧪 Verificación

### 1. Consulta Directa (Funciona)

```sql
SELECT role 
FROM public.user_roles 
WHERE user_id = '820555c8-64e7-4bc4-9265-471bfefdbcf8';
-- Resultado: "admin" ✓
```

### 2. Función is_admin (Funciona)

```sql
SELECT public.is_admin('820555c8-64e7-4bc4-9265-471bfefdbcf8');
-- Resultado: true ✓
```

### 3. Acceso al Backoffice

Ahora el usuario con email `danymorar20@gmail.com` puede:
- ✅ Acceder a `/admin`
- ✅ Ver el dashboard
- ✅ Gestionar productos
- ✅ Todas las funciones de admin

---

## 📚 Lecciones Aprendidas

### 1. Evitar Referencias Circulares en RLS

**Malo:**
```sql
-- ❌ Política que consulta la misma tabla que protege
CREATE POLICY "policy_name"
  USING (
    EXISTS (SELECT 1 FROM same_table WHERE ...)  -- ← Circular!
  );
```

**Bueno:**
```sql
-- ✓ Usar función con SECURITY DEFINER
CREATE POLICY "policy_name"
  USING (public.check_permission_function(auth.uid()));
```

### 2. SECURITY DEFINER es Poderoso pero Requiere Cuidado

**Ventajas:**
- Bypasea RLS
- Rompe ciclos de referencia
- Centraliza lógica de permisos

**Precauciones:**
- Validar inputs (SQL injection)
- Usar `SET search_path` para seguridad
- Documentar bien la función

### 3. Logs Detallados son Cruciales

Los logs agregados ayudaron a:
- Identificar dónde falla exactamente
- Ver el user_id y verificar en BD
- Depurar problemas de permisos

---

## 🔒 Consideraciones de Seguridad

### ¿Es seguro usar SECURITY DEFINER?

**Sí, cuando se hace correctamente:**

1. ✅ **Input validation**: La función solo acepta UUID
2. ✅ **Search path fijo**: `SET search_path = public, pg_temp`
3. ✅ **Lógica simple**: Solo consulta un rol
4. ✅ **Sin SQL dinámico**: No hay concatenación de strings

### Alternativas Consideradas

1. **Service Role Key en el servidor**: Menos seguro, expone más permisos
2. **auth.users metadata**: No es flexible para roles múltiples
3. **JWT custom claims**: Requiere refresh constante

**Conclusión**: `SECURITY DEFINER` es la mejor opción para este caso.

---

## 🎯 Archivos Modificados

1. **Migración**: `fix_user_roles_rls_policies.sql`
   - Elimina políticas antiguas
   - Crea políticas nuevas
   - Actualiza función `is_admin()`

2. **Server Actions**: `src/app/admin/auth-actions.ts`
   - Agrega logs detallados
   - Manejo de errores mejorado
   - Mejor feedback en consola

---

## ✅ Checklist de Verificación

- [x] Usuario puede ver su propio rol
- [x] Función `is_admin()` retorna `true` para admins
- [x] Acceso a `/admin` funciona
- [x] Dashboard se muestra correctamente
- [x] Gestión de productos funciona
- [x] Logs ayudan en depuración
- [x] Compilación exitosa
- [x] Sin errores de lint

---

## 🆘 Si el Problema Persiste

1. **Verifica el rol en Supabase**:
```sql
SELECT u.email, ur.role 
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'tu-email@ejemplo.com';
```

2. **Revisa los logs del servidor** (`npm run dev`):
   - Busca `Error getting user`
   - Busca `Error fetching user role`
   - Verifica el `User ID` y `User role`

3. **Limpia cookies y cache**:
   - Cierra sesión
   - Limpia cookies del navegador
   - Vuelve a iniciar sesión

4. **Verifica que la migración se aplicó**:
```sql
-- Verificar que la función existe
SELECT proname, prosecdef 
FROM pg_proc 
WHERE proname = 'is_admin';
-- prosecdef debe ser 'true'
```

---

**Fecha de Solución**: 8 de octubre de 2025  
**Usuario Afectado**: danymorar20@gmail.com  
**Status**: ✅ Resuelto y verificado

