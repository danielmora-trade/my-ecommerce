# Gestión de Pedidos - Backoffice ACEROMAX

## 🎯 Resumen

Se ha implementado el **sistema completo de gestión de pedidos** en el backoffice, permitiendo a los administradores y managers gestionar todos los aspectos de los pedidos de los clientes.

## ✅ Funcionalidades Implementadas

### 1. **Vista General de Pedidos** (`/admin/pedidos`)

#### Dashboard con Estadísticas
- ✅ **Total de pedidos**
- ✅ **Pedidos pendientes**
- ✅ **Pedidos en preparación**
- ✅ **Pedidos en reparto**
- ✅ **Pedidos entregados**

#### Tabla de Pedidos
- ✅ Lista completa de todos los pedidos
- ✅ Información mostrada:
  - Número de pedido (folio)
  - Cliente (nombre y ciudad)
  - Fecha del pedido
  - Fecha estimada de entrega (si está configurada)
  - Cantidad de items
  - Total del pedido
  - Estado actual (con badge de color)
  - Número de seguimiento (si existe)

#### Filtros de Estado
- ✅ **Todos** - Muestra todos los pedidos
- ✅ **Pendientes** - Solo pedidos pendientes
- ✅ **En Preparación** - Pedidos siendo procesados
- ✅ **En Reparto** - Pedidos enviados
- ✅ **Entregados** - Pedidos completados

#### Paginación
- ✅ 20 pedidos por página
- ✅ Navegación anterior/siguiente
- ✅ Contador de pedidos mostrados

### 2. **Edición de Pedidos** (Modal)

Al hacer click en el botón de editar (lápiz) de cualquier pedido, se abre un modal completo con las siguientes funcionalidades:

#### Cambio de Estado
- ✅ **Pendiente** (Amarillo)
- ✅ **En Preparación** (Azul)
- ✅ **En Reparto** (Morado)
- ✅ **Entregado** (Verde)
- ✅ **Cancelado** (Rojo)
- ✅ **Reembolsado** (Gris)

Los timestamps se actualizan automáticamente:
- `shipped_at` cuando cambia a "En Reparto"
- `delivered_at` cuando cambia a "Entregado"
- `cancelled_at` cuando cambia a "Cancelado"

#### Información de Envío
- ✅ **Fecha estimada de entrega**
  - Selector de fecha
  - Se muestra al cliente en su vista de pedido
- ✅ **Número de seguimiento**
  - Campo de texto para tracking number
  - Permite seguimiento del paquete

#### Gestión de Productos
- ✅ **Modificar cantidades**
  - Botones +/- para ajustar cantidad
  - Mínimo 1 unidad
  - Recalcula automáticamente los totales
- ✅ **Eliminar productos**
  - Botón de eliminación con confirmación
  - Actualiza totales del pedido
- ✅ **Ver detalles de cada item**
  - Nombre del producto
  - SKU
  - Precio unitario
  - Cantidad
  - Total por producto

#### Resumen de Costos
- ✅ Subtotal
- ✅ IVA (12%)
- ✅ Costo de envío (GRATIS en la mayoría de casos)
- ✅ **Total** (destacado)

#### Notas Internas
- ✅ Campo de texto para notas del equipo
- ✅ No visible para clientes
- ✅ Útil para coordinación interna

### 3. **Acciones Rápidas**
- ✅ **Ver pedido** (icono de ojo) - Abre vista del cliente en nueva pestaña
- ✅ **Editar pedido** (icono de lápiz) - Abre modal de edición

---

## 🗄️ Estructura de Base de Datos

### Migración Aplicada

```sql
-- Nuevo campo agregado
ALTER TABLE public.orders 
ADD COLUMN estimated_delivery_date TIMESTAMPTZ;

-- Índices para mejorar performance
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_estimated_delivery ON public.orders(estimated_delivery_date);
```

### Campos Disponibles en `orders`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `status` | text | Estado del pedido |
| `payment_status` | text | Estado del pago |
| `estimated_delivery_date` | timestamptz | **NUEVO** - Fecha estimada de entrega |
| `shipped_at` | timestamptz | Fecha de envío |
| `delivered_at` | timestamptz | Fecha de entrega |
| `cancelled_at` | timestamptz | Fecha de cancelación |
| `tracking_number` | text | Número de seguimiento |
| `notes` | text | Notas internas |
| `order_items` | relation | Items del pedido |
| `shipping_address` | relation | Dirección de envío |

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos (4)

1. **`src/app/admin/order-actions.ts`**
   - Server actions para gestión de pedidos
   - Funciones incluidas:
     - `getAllOrdersAdmin()` - Obtener todos los pedidos con filtros
     - `getOrderByIdAdmin()` - Obtener un pedido específico
     - `updateOrderStatus()` - Cambiar estado del pedido
     - `updateEstimatedDelivery()` - Actualizar fecha estimada
     - `updateTrackingNumber()` - Actualizar tracking
     - `updateOrderNotes()` - Actualizar notas internas
     - `updateOrderItem()` - Modificar cantidad de un item
     - `removeOrderItem()` - Eliminar un item del pedido
     - `getOrderStats()` - Estadísticas de pedidos
     - `searchOrdersAdmin()` - Búsqueda de pedidos

2. **`src/components/admin/orders-table.tsx`**
   - Tabla principal de pedidos
   - Muestra todos los pedidos con paginación
   - Botones de acciones (ver, editar)
   - Badges de estado con colores

3. **`src/components/admin/order-edit-modal.tsx`**
   - Modal completo de edición
   - Selector visual de estados
   - Gestión de fechas y tracking
   - Modificación de items del pedido
   - Campo de notas internas

### Archivos Modificados (2)

4. **`src/app/admin/pedidos/page.tsx`**
   - Página completa con estadísticas
   - Filtros por estado
   - Integración de tabla de pedidos
   - Suspense para carga progresiva

5. **Migración de Supabase**
   - `add_estimated_delivery_to_orders.sql`
   - Agrega campo `estimated_delivery_date`
   - Índices para performance

---

## 🎨 Interfaz de Usuario

### Paleta de Colores por Estado

| Estado | Color | Badge |
|--------|-------|-------|
| Pendiente | Amarillo | `bg-yellow-100 text-yellow-800` |
| En Preparación | Azul | `bg-blue-100 text-blue-800` |
| En Reparto | Morado | `bg-purple-100 text-purple-800` |
| Entregado | Verde | `bg-green-100 text-green-800` |
| Cancelado | Rojo | `bg-red-100 text-red-800` |
| Reembolsado | Gris | `bg-gray-100 text-gray-800` |

### Características de Diseño

- ✅ **Responsive** - Funciona en desktop y móvil
- ✅ **Modal scrollable** - Para pedidos con muchos productos
- ✅ **Feedback visual** - Toast notifications para cada acción
- ✅ **Estados visuales** - Hover, active, loading states
- ✅ **Confirmaciones** - Para acciones destructivas (eliminar items)
- ✅ **Iconos intuitivos** - Lucide React icons
- ✅ **Loading states** - Skeletons durante la carga

---

## 🔐 Seguridad y Permisos

### Verificación de Roles

Todas las funciones verifican que el usuario sea **admin o manager**:

```typescript
const hasPermission = await isAdminOrManager()
if (!hasPermission) {
  return { success: false, error: 'No tienes permisos' }
}
```

### Políticas RLS

Las políticas de Supabase protegen los datos a nivel de base de datos:
- Los admins/managers pueden ver y modificar todos los pedidos
- Los clientes solo pueden ver sus propios pedidos

### Revalidación de Cache

Después de cada modificación, se invalida el cache:

```typescript
revalidatePath('/admin/pedidos')
revalidatePath('/pedidos')
```

---

## 🧪 Guía de Uso

### Acceder a Gestión de Pedidos

1. Inicia sesión como **admin** o **manager**
2. Ve al backoffice: `http://localhost:3000/admin`
3. Click en **"Pedidos"** en el sidebar
4. O accede directamente: `http://localhost:3000/admin/pedidos`

### Ver Todos los Pedidos

En la página principal de pedidos verás:
- Dashboard con estadísticas arriba
- Filtros de estado (botones de colores)
- Tabla con todos los pedidos
- Paginación abajo si hay más de 20

### Filtrar por Estado

Click en cualquier botón de filtro:
- **Todos** - Sin filtro
- **Pendientes** - Solo status `pending`
- **En Preparación** - Solo status `processing`
- **En Reparto** - Solo status `shipped`
- **Entregados** - Solo status `delivered`

### Editar un Pedido

1. **Click en el botón de lápiz** (Edit) del pedido
2. Se abre el modal de edición
3. **Cambiar estado**:
   - Click en el botón del nuevo estado
   - Se marca visualmente
4. **Agregar fecha estimada**:
   - Click en el campo de fecha
   - Selecciona la fecha
5. **Agregar tracking**:
   - Escribe el número en el campo
6. **Modificar cantidades**:
   - Usa los botones +/- junto a cada producto
   - Mínimo 1 unidad
7. **Eliminar producto**:
   - Click en el icono de basura
   - Confirma la acción
8. **Agregar notas**:
   - Escribe en el campo de notas internas
9. **Guardar cambios**:
   - Click en "Guardar Cambios"
   - Espera la confirmación (toast verde)

### Ver Vista del Cliente

Click en el **icono de ojo** (Eye) para abrir la vista que ve el cliente en una nueva pestaña.

---

## 📊 Flujo de Estados Recomendado

### Ciclo Normal de un Pedido

```
1. PENDIENTE (pending)
   ↓ Cliente realiza el pedido
   
2. EN PREPARACIÓN (processing)
   ↓ Se prepara el pedido
   ↓ Se agrega fecha estimada
   
3. EN REPARTO (shipped)
   ↓ Se agrega número de tracking
   ↓ shipped_at se actualiza automáticamente
   
4. ENTREGADO (delivered)
   ↓ delivered_at se actualiza automáticamente
   ✓ Pedido completado
```

### Casos Especiales

```
CANCELADO (cancelled)
  - Cliente cancela antes del envío
  - Problema con el pedido
  - cancelled_at se actualiza

REEMBOLSADO (refunded)
  - Después de cancelación
  - Producto devuelto
```

---

## 🔄 Recalculo Automático de Totales

Cuando modificas items del pedido:

1. **Cambiar cantidad**: 
   - Se recalcula `total` del item
   - Se recalcula `subtotal` del pedido
   - Se recalcula `tax` (12% del subtotal)
   - Se recalcula `total` del pedido

2. **Eliminar item**:
   - Se elimina el item
   - Se recalculan todos los totales
   - Si no quedan items, considera cancelar el pedido

---

## 💡 Mejores Prácticas

### Cambio de Estado

1. **Pendiente → En Preparación**:
   - Cuando confirmes que el pedido es válido
   - Verifica stock de productos
   - Agrega fecha estimada de entrega

2. **En Preparación → En Reparto**:
   - Cuando el pedido salga de bodega
   - **Obligatorio**: Agregar número de tracking
   - Verifica dirección de envío

3. **En Reparto → Entregado**:
   - Cuando confirmes la entrega
   - Opcional: Agregar nota de confirmación

### Gestión de Fechas

- **Fecha estimada**: Agrega 2-5 días hábiles desde que envías
- **Tracking**: Agrégalo apenas lo tengas disponible
- **Notas**: Documenta cualquier situación especial

### Modificación de Items

- **Evita eliminar todos los items**: Mejor cancela el pedido
- **Stock**: Verifica disponibilidad antes de aumentar cantidad
- **Comunicación**: Si modificas el pedido, contacta al cliente

---

## 🆘 Solución de Problemas

### No veo los pedidos

**Posibles causas**:
- No hay pedidos en el sistema
- Filtro activo sin resultados
- Problema de permisos (debes ser admin/manager)

**Solución**:
1. Click en "Todos" para quitar filtros
2. Verifica tu rol en Supabase
3. Realiza un pedido de prueba desde el sitio

### No puedo editar un pedido

**Causa**: No tienes permisos de admin/manager

**Solución**:
1. Verifica tu rol: `SELECT role FROM user_roles WHERE user_id = 'tu-uuid'`
2. Debe ser `admin` o `manager`

### Los totales no se actualizan

**Causa**: Error en el recalculo automático

**Solución**:
1. Refresca la página
2. Si persiste, verifica logs del servidor
3. Revisa la función `recalculateOrderTotals()`

### Error al guardar cambios

**Posibles causas**:
- Conexión a Supabase perdida
- Permisos insuficientes
- Validación fallida

**Solución**:
1. Verifica tu conexión
2. Revisa los logs del navegador (F12 → Console)
3. Intenta de nuevo

---

## 📈 Estadísticas Disponibles

En el dashboard de pedidos verás:

- **Total Pedidos**: Todos los pedidos históricos
- **Pendientes**: Requieren atención inmediata
- **En Preparación**: En proceso activo
- **En Reparto**: Enviados y en camino
- **Entregados**: Completados exitosamente

Usa estas métricas para:
- Identificar cuellos de botella
- Priorizar trabajo
- Medir rendimiento del equipo

---

## ✅ Checklist de Funcionalidades

- [x] Ver lista de pedidos
- [x] Filtrar por estado
- [x] Paginación
- [x] Estadísticas en tiempo real
- [x] Cambiar estado de pedido
- [x] Agregar fecha estimada de entrega
- [x] Agregar número de seguimiento
- [x] Modificar cantidades de productos
- [x] Eliminar productos del pedido
- [x] Agregar notas internas
- [x] Ver vista del cliente
- [x] Recalculo automático de totales
- [x] Toast notifications
- [x] Confirmaciones para acciones destructivas
- [x] Loading states
- [x] Responsive design
- [x] Protección con roles
- [x] RLS en Supabase
- [x] Compilación exitosa

---

## 🚀 Próximas Mejoras Sugeridas

### Corto Plazo
- [ ] Búsqueda por número de pedido
- [ ] Búsqueda por nombre de cliente
- [ ] Exportar pedidos a CSV/Excel
- [ ] Imprimir orden de envío
- [ ] Notificaciones por email al cambiar estado

### Mediano Plazo
- [ ] Historial de cambios del pedido
- [ ] Asignar pedido a un empleado específico
- [ ] Etiquetas personalizadas
- [ ] Filtro por rango de fechas
- [ ] Gráficas de tendencias

### Largo Plazo
- [ ] Integración con APIs de mensajería (tracking automático)
- [ ] Sistema de devoluciones
- [ ] Generación automática de facturas
- [ ] Dashboard de métricas avanzadas
- [ ] Alertas automáticas por pedidos retrasados

---

**Fecha de Implementación**: 8 de octubre de 2025  
**Status**: ✅ Completamente Funcional  
**Compilación**: ✅ Exitosa  
**Versión**: 1.0.0


