# Fix: Error en Query de Pedidos Admin

## 🐛 Problema

Al acceder a `/admin/pedidos`, las estadísticas mostraban correctamente 3 pedidos, pero la tabla aparecía vacía con el mensaje "No hay pedidos para mostrar".

### Error en Consola

```
Error fetching orders: {
  code: 'PGRST200',
  details: "Searched for a foreign key relationship between 'orders' and 'profiles' in the schema 'public', but no matches were found.",
  hint: "Perhaps you meant 'order_items' instead of 'profiles'.",
  message: "Could not find a relationship between 'orders' and 'profiles' in the schema cache"
}
```

## 🔍 Causa

El query de Supabase estaba intentando hacer un JOIN entre las tablas `orders` y `profiles`:

```typescript
// ❌ INCORRECTO
profiles(
  first_name,
  last_name
)
```

Pero esta relación no existe en la base de datos porque:
- La tabla `orders` tiene `user_id` que apunta a `auth.users`
- No hay foreign key directa entre `orders` y `profiles`

## ✅ Solución

### 1. Eliminar el Join con Profiles

**Antes**:
```typescript
.select(`
  id,
  order_number,
  ...
  profiles(first_name, last_name)  // ❌ Esto causaba el error
`)
```

**Después**:
```typescript
.select(`
  id,
  order_number,
  ...
  shipping_address:addresses!orders_shipping_address_id_fkey(
    full_name,
    phone,
    ...
  )
  // ✓ Usamos el nombre de la dirección de envío
`)
```

### 2. Obtener Nombre del Cliente

En lugar de buscar en `profiles`, obtenemos el nombre desde `shipping_address.full_name`:

**Antes**:
```typescript
const getCustomerName = (order: Order) => {
  if (order.profiles?.first_name || order.profiles?.last_name) {
    return `${order.profiles.first_name || ''} ${order.profiles.last_name || ''}`.trim()
  }
  return order.shipping_address?.full_name || 'Cliente'
}
```

**Después**:
```typescript
const getCustomerName = (order: Order) => {
  return order.shipping_address?.full_name || 'Cliente'
}
```

### 3. Actualizar Interface

Eliminamos la referencia a `profiles` del tipo `OrderWithDetails`:

```typescript
interface OrderWithDetails {
  // ... otros campos
  shipping_address: {
    full_name: string
    phone: string
    address_line_1: string
    city: string
    state: string
  } | null
  // ✓ Ya no incluye profiles
}
```

## 📁 Archivos Modificados

1. **`src/app/admin/order-actions.ts`**
   - Eliminado join con `profiles` en `getAllOrdersAdmin()`
   - Eliminado join con `profiles` en `searchOrdersAdmin()`
   - Actualizada interface `OrderWithDetails`

2. **`src/components/admin/orders-table.tsx`**
   - Eliminada interface `Profile`
   - Actualizada interface `Order`
   - Simplificada función `getCustomerName()`

## 🧪 Verificación

### Query Correcto en SQL

```sql
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.total,
  o.created_at,
  a.full_name as customer_name,
  a.city
FROM orders o
LEFT JOIN addresses a ON a.id = o.shipping_address_id;
```

### Resultados

- ✅ Los 3 pedidos ahora se muestran correctamente
- ✅ El nombre del cliente aparece (desde `shipping_address`)
- ✅ Sin errores en consola
- ✅ Compilación exitosa

## 💡 Lección Aprendida

**Siempre verificar las relaciones de base de datos antes de hacer joins en Supabase:**

1. Revisar foreign keys existentes
2. Usar el esquema generado (`database.types.ts`)
3. Probar queries en SQL primero si hay dudas

**Alternativas para obtener datos de usuario:**

- ✅ `shipping_address.full_name` (disponible, usado)
- ❌ `profiles.first_name` (relación no existe)
- ⚠️ Podríamos crear un JOIN manual con `auth.users` si fuera necesario

## 🎯 Resultado Final

La página `/admin/pedidos` ahora muestra:
- Estadísticas correctas (3 pedidos)
- Tabla poblada con los 3 pedidos
- Nombre del cliente desde la dirección
- Ciudad del cliente
- Toda la información necesaria

---

**Fecha de Fix**: 8 de octubre de 2025  
**Status**: ✅ Resuelto  
**Build**: ✅ Exitoso


