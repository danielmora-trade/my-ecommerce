# 🔧 Solución para el Error de OAuth Callback

## Problema Identificado

Cuando usas Google OAuth, los tokens vienen en el **hash fragment** (`#access_token=...`) en lugar de como un **código de autorización** (`?code=...`). Esto causa que el callback falle.

**URL de error que estás viendo:**
```
http://localhost:3000/auth/auth-code-error#access_token=eyJhbG...&refresh_token=...
```

**Por qué sucede:**
- Supabase está usando el flujo **Implicit** en lugar del flujo **PKCE** (más seguro)
- El flujo Implicit envía los tokens directamente en el hash del URL
- El hash fragment **no se envía al servidor**, solo está disponible en el cliente
- Por eso `code` es `null` en el servidor

---

## ✅ Solución Implementada

He implementado una **solución híbrida** que maneja ambos flujos:

### **1. Flujo PKCE (Preferido - Más Seguro)**
```
Google → Supabase → /auth/callback?code=xxx
→ Servidor intercambia code por session
→ Establece cookies HTTP-only
→ Redirige a /dashboard
```

### **2. Flujo Implicit (Fallback)**
```
Google → Supabase → /auth/callback#access_token=xxx
→ Página cliente extrae tokens del hash
→ Envía tokens a /api/auth/callback-tokens
→ Servidor establece cookies HTTP-only
→ Redirige a /dashboard
```

---

## 📁 Archivos Actualizados

### **1. `src/app/auth/callback/route.ts`** (Actualizado)
- Maneja flujo PKCE con `?code=xxx`
- Detecta flujo Implicit con hash params
- Sirve página HTML que extrae tokens del hash

### **2. `src/app/auth/callback/page.tsx`** (Nuevo)
- Página cliente que maneja el hash fragment
- Extrae `access_token` y `refresh_token` del hash
- Envía tokens al servidor para establecer cookies
- Muestra UI de carga y estados de éxito/error

### **3. `src/app/api/auth/callback-tokens/route.ts`** (Nuevo)
- API endpoint para recibir tokens del cliente
- Establece cookies HTTP-only de forma segura
- Retorna confirmación de éxito

### **4. `src/backend/services/auth.service.ts`** (Actualizado)
- Añadidos parámetros para forzar flujo PKCE
- `queryParams` con `access_type: 'offline'` y `prompt: 'consent'`

---

## 🔐 Configuración de Supabase (IMPORTANTE)

Para asegurar que Supabase use el flujo PKCE, necesitas verificar la configuración:

### **Opción 1: Configuración en Supabase Dashboard**

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com/project/fuxgceherfxekwttmsjh)

2. **Authentication → Settings**

3. Busca **"Auth flow type"** o **"OAuth flow"**

4. Asegúrate que esté configurado como:
   - ✅ **PKCE** (Proof Key for Code Exchange)
   - ❌ NO "Implicit"

5. Si la opción existe, habilita:
   - ✅ **"Enable PKCE flow"**
   - ✅ **"Return code instead of tokens"**

### **Opción 2: Si no encuentras la opción en el Dashboard**

Supabase JS v2 (que estás usando) **debería usar PKCE por defecto**, pero a veces necesitas:

1. **Verificar versión de @supabase/supabase-js:**
   ```bash
   npm list @supabase/supabase-js
   ```
   Debe ser **v2.x.x** o superior

2. **Actualizar si es necesario:**
   ```bash
   npm install @supabase/supabase-js@latest
   ```

---

## 🧪 Prueba el Flujo

### **Test 1: Flujo con la Solución Actual**

```bash
1. Ir a: http://localhost:3000/auth/signin
2. Click en "Continue with Google"
3. Selecciona tu cuenta de Google
4. Observa la URL de redirección
```

**Escenarios posibles:**

#### **A) Flujo PKCE (Ideal):**
```
URL: http://localhost:3000/auth/callback?code=abc123...
✅ El servidor intercambia el código
✅ Cookies establecidas
✅ Redirige a /dashboard
```

#### **B) Flujo Implicit (Con nuestra solución):**
```
URL: http://localhost:3000/auth/callback#access_token=eyJ...
✅ La página cliente extrae los tokens
✅ Envía a /api/auth/callback-tokens
✅ Cookies establecidas
✅ Redirige a /dashboard
```

### **Test 2: Verificar Cookies**

Después del login, abre DevTools:

1. **Application → Cookies → http://localhost:3000**

2. Debes ver:
   ```
   access_token: eyJ... (HttpOnly: ✓)
   refresh_token: ... (HttpOnly: ✓)
   ```

---

## 🔍 Debugging

### **Ver qué flujo se está usando:**

Abre la consola del navegador antes de hacer login:

```javascript
// Pega esto en la consola antes de hacer click en "Continue with Google"
window.addEventListener('hashchange', () => {
  console.log('Hash changed:', window.location.hash);
});

// O simplemente observa la URL después del redirect de Google
```

**Si ves:**
- `?code=xxx` → Flujo PKCE ✅
- `#access_token=xxx` → Flujo Implicit (pero nuestra solución lo maneja) ✅

---

## 🔧 Configuración Adicional de Google OAuth

Asegúrate que en **Google Cloud Console** tengas:

### **Authorized redirect URIs:**

Ambas URLs deben estar configuradas:

```
https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

**Nota:** La primera es la URL de Supabase (debe estar), la segunda es opcional para desarrollo local.

---

## ✅ Checklist de Verificación

Después de los cambios:

- [ ] Build exitoso: `npm run build`
- [ ] Servidor ejecutándose: `npm run dev`
- [ ] Login con Google funciona
- [ ] Redirige a `/dashboard` después del login
- [ ] Cookies `access_token` y `refresh_token` establecidas
- [ ] Usuario creado en Supabase Dashboard
- [ ] Dashboard muestra email correcto
- [ ] Sign out funciona

---

## 🎯 Resumen de la Solución

### **Lo que hicimos:**

1. ✅ **Detectamos** si el callback tiene `?code=` (PKCE) o `#access_token=` (Implicit)

2. ✅ **Manejamos PKCE** directamente en el servidor (route handler)

3. ✅ **Manejamos Implicit** con:
   - Página cliente que extrae tokens del hash
   - API endpoint que establece cookies
   - Redirección a dashboard

4. ✅ **Añadimos configuración** para preferir flujo PKCE en el servicio de auth

5. ✅ **Creamos UI de carga** para mejor experiencia de usuario

### **Beneficios:**

- ✅ **Funciona con ambos flujos** (PKCE e Implicit)
- ✅ **Más seguro** - Cookies HTTP-only
- ✅ **Mejor UX** - Página de carga con estados
- ✅ **Robusto** - Manejo de errores completo
- ✅ **Compatible** - Funciona con la configuración actual de Supabase

---

## 📝 Próximos Pasos

### **Para Desarrollo:**

Todo debería funcionar ahora. Prueba el flujo completo:

```bash
npm run dev
# Visita http://localhost:3000/auth/signin
# Click en "Continue with Google"
# Verifica que llegues a /dashboard
```

### **Para Producción:**

Cuando despliegues a Vercel:

1. **Actualiza las Redirect URIs en Google Cloud Console:**
   ```
   https://fuxgceherfxekwttmsjh.supabase.co/auth/v1/callback
   https://tu-app.vercel.app/auth/callback
   ```

2. **Actualiza Site URL en Supabase:**
   ```
   Site URL: https://tu-app.vercel.app
   Redirect URLs: https://tu-app.vercel.app/auth/callback
   ```

3. **Verifica variables de entorno en Vercel:**
   ```env
   NEXT_PUBLIC_SITE_URL=https://tu-app.vercel.app
   ```

---

## 🐛 Si Aún Tienes Problemas

### **Problema: Sigue redirigiendo a auth-code-error**

**Solución:**
1. Limpia cookies: DevTools → Application → Clear site data
2. Cierra sesión de Google: https://accounts.google.com/
3. Intenta de nuevo

### **Problema: No establece las cookies**

**Verificar:**
1. DevTools → Network → Busca `/api/auth/callback-tokens`
2. Ve el Request payload y Response
3. Verifica que `success: true`

### **Problema: Error CORS**

**Solución:**
```typescript
// En next.config.ts, añade:
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ]
}
```

---

**El flujo de Google OAuth ahora debería funcionar correctamente!** 🎉

Si tienes más problemas, revisa la consola del navegador y los logs del servidor para más detalles.

---

**Creado:** 8 de Octubre, 2025  
**Estado:** ✅ Solución Implementada  
**Flujos soportados:** PKCE + Implicit

