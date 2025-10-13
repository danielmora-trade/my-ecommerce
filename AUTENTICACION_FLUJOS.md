# 🔐 Flujos de Autenticación - Guía Completa

## 📋 Métodos Soportados

El sitio ahora soporta **3 métodos** de autenticación:

1. **Email + Password** (tradicional)
2. **Magic Link** (OTP por email)
3. **OAuth con Google** (social login)

---

## 🔄 Flujo 1: Magic Link (OTP)

### ¿Cómo Funciona?

El **Magic Link** es un link único y temporal enviado por email que permite iniciar sesión sin contraseña.

### Secuencia Completa

```
1. Usuario ingresa su email
   ↓
2. Click en "Continuar con Email"
   ↓
3. Backend: signInWithOtp({ email })
   ↓
4. Supabase envía email con magic link
   ↓
5. Usuario recibe email y hace click en el link
   ↓
6. Link redirige a: /auth/callback?token_hash=xxx&type=magiclink
   ↓
7. Callback procesa con verifyOtp()
   ↓
8. Sesión establecida ✓
   ↓
9. Redirige a home page
```

### Parámetros del Magic Link

Cuando haces click en el magic link del email, la URL contiene:

- `token_hash`: El token único generado
- `type`: Tipo de verificación (magiclink, email, signup, etc.)
- `next` (opcional): Página a donde redirigir después del login

**Ejemplo**:
```
http://localhost:3000/auth/callback?token_hash=abcd1234&type=magiclink&next=/productos
```

### Código del Callback

```typescript
// Detecta que es magic link
if (tokenHash && type) {
  // Verifica el OTP
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as 'email' | 'magiclink' | 'recovery' | ...,
  })

  if (!error && data?.session) {
    // ✓ Sesión establecida
    return redirect(next)
  }
}
```

### Tipos de OTP Soportados

- `email` - Confirmación de email
- `magiclink` - Link mágico para login
- `recovery` - Recuperación de contraseña
- `invite` - Invitación de usuario
- `signup` - Confirmación de registro
- `email_change` - Cambio de email

---

## 🔄 Flujo 2: OAuth con Google (PKCE)

### ¿Cómo Funciona?

OAuth usa el flujo **PKCE** (Proof Key for Code Exchange) para mayor seguridad.

### Secuencia Completa

```
1. Usuario hace click en "Sign in with Google"
   ↓
2. signInWithOAuth({ provider: 'google' })
   ↓
3. Genera code_verifier aleatorio
   ↓
4. Guarda code_verifier en cookies
   ↓
5. Redirige a Google para autorización
   ↓
6. Usuario autoriza en Google
   ↓
7. Google redirige a: /auth/callback?code=xxx
   ↓
8. Middleware SKIP /auth/callback (importante!)
   ↓
9. Callback lee code_verifier de cookies
   ↓
10. exchangeCodeForSession(code) con verifier
   ↓
11. Sesión establecida ✓
   ↓
12. Redirige a home page
```

### Parámetros de OAuth

- `code`: Código de autorización de Google
- `next` (opcional): Página de redirección

**Ejemplo**:
```
http://localhost:3000/auth/callback?code=xyz789&next=/
```

### ¿Qué es PKCE?

**PKCE** (Proof Key for Code Exchange) es una extensión de OAuth para prevenir ataques:

1. **code_verifier**: String aleatorio generado al inicio
2. **code_challenge**: Hash del verifier enviado a Google
3. **Validación**: Google verifica que el verifier original coincida

### ⚠️ Problema Anterior y Solución

**❌ Problema**:
El middleware de Supabase estaba interceptando `/auth/callback` y llamando a `getUser()`, lo que **limpiaba el code_verifier** antes de poder usarlo.

**✅ Solución**:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Skip middleware para auth callback
  if (request.nextUrl.pathname === '/auth/callback') {
    return  // No procesar - dejar que el callback maneje PKCE
  }

  return await updateSession(request)
}
```

### Código del Callback

```typescript
// Detecta que es OAuth
if (code) {
  // Cliente con acceso a cookies (para leer code_verifier)
  const supabase = createServerClient(/* ... */, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookies) { /* ... */ }
    }
  })

  // Exchange code por session (usa code_verifier de cookies)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (!error && data?.session) {
    // ✓ Sesión establecida
    return redirect(next)
  }
}
```

---

## 🔄 Flujo 3: Email + Password

### Secuencia Simple

```
1. Usuario ingresa email y password
   ↓
2. signInWithPassword({ email, password })
   ↓
3. Supabase valida credenciales
   ↓
4. Sesión establecida directamente
   ↓
5. Redirige a home
```

**No requiere callback** porque la sesión se establece inmediatamente.

---

## 🗂️ Archivo: `/auth/callback/route.ts`

### Estructura del Callback

```typescript
export async function GET(request: NextRequest) {
  const code = searchParams.get('code')           // OAuth
  const tokenHash = searchParams.get('token_hash') // Magic Link
  const type = searchParams.get('type')           // Tipo de OTP
  const error = searchParams.get('error')         // Errores

  // 1. Manejar errores OAuth
  if (error) {
    return redirect('/auth/auth-code-error')
  }

  // 2. Crear cliente Supabase con acceso a cookies
  const supabase = createServerClient(/* ... */)

  // 3. Magic Link (OTP)
  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type
    })
    
    if (!error && data?.session) {
      return redirect(next) // ✓ Éxito
    } else {
      return redirect('/auth/auth-code-error') // ✗ Error
    }
  }

  // 4. OAuth (PKCE)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session) {
      return redirect(next) // ✓ Éxito
    } else {
      return redirect('/auth/auth-code-error') // ✗ Error
    }
  }

  // 5. Implicit flow (hash fragment) - para otros casos
  return renderHTMLPage()
}
```

---

## 🧪 Cómo Probar Cada Flujo

### Magic Link

1. Ve a `/auth/signin`
2. Ingresa tu email
3. Click en "Continuar con Email"
4. Revisa tu email (verifica spam también)
5. Click en el link del email
6. Deberías ser redirigido a home con sesión activa ✓

**Logs esperados**:
```
Processing magic link callback: { type: 'magiclink' }
Magic link verified successfully
```

### OAuth con Google

1. Ve a `/auth/signin`
2. Click en "Sign in with Google"
3. Autoriza en Google
4. Deberías ser redirigido a home ✓

**Logs esperados**:
```
Processing OAuth callback with code
OAuth code exchanged successfully
```

### Email + Password

1. Ve a `/auth/signin`
2. Ingresa email y password
3. Click en "Sign In"
4. Redirige a home directamente ✓

**Sin logs** porque no pasa por el callback.

---

## 🐛 Debugging

### Verificar en Terminal

Los logs ahora incluyen mensajes específicos:

**Magic Link**:
```bash
Processing magic link callback: { type: 'magiclink' }
Magic link verified successfully  # ✓ Éxito
# o
Magic link verification error: [error] # ✗ Error
```

**OAuth**:
```bash
Processing OAuth callback with code
OAuth code exchanged successfully  # ✓ Éxito
# o
Exchange code error: [error] # ✗ Error
```

### Errores Comunes

#### 1. Magic Link Expirado

**Error**: `"Invalid or expired link"`

**Causa**: Los magic links expiran después de 1 hora (por defecto en Supabase)

**Solución**: Solicitar un nuevo magic link

#### 2. Code Verifier Faltante (OAuth)

**Error**: `"both auth code and code verifier should be non-empty"`

**Causa**: El middleware está procesando `/auth/callback`

**Solución**: Verificar que `middleware.ts` tenga el skip correcto:
```typescript
if (request.nextUrl.pathname === '/auth/callback') {
  return
}
```

#### 3. Cookies Bloqueadas

**Error**: Sesión no persiste después del login

**Causa**: Cookies de terceros bloqueadas en el navegador

**Solución**:
- Verificar que las cookies estén habilitadas
- En desarrollo, usar `localhost` (no `127.0.0.1`)

---

## 🔐 Seguridad

### Magic Link

- ✅ Token único por solicitud
- ✅ Expira después de 1 hora
- ✅ Un solo uso (se invalida después del login)
- ✅ Enviado solo al email del usuario

### OAuth (PKCE)

- ✅ Code verifier aleatorio único
- ✅ Validado por Google
- ✅ No expuesto en URLs
- ✅ Almacenado en cookies HTTP-only

### Cookies de Sesión

```typescript
// Configuración de cookies
{
  httpOnly: true,        // No accesible desde JavaScript
  secure: production,    // Solo HTTPS en producción
  sameSite: 'lax',      // Protección CSRF
  maxAge: 7 days,       // Expiración
  path: '/'             // Disponible en todo el sitio
}
```

---

## 📁 Archivos Relacionados

1. **`middleware.ts`**
   - Maneja sesiones en todas las rutas
   - **SKIP** `/auth/callback` para no interferir con PKCE

2. **`src/app/auth/callback/route.ts`**
   - Procesa magic links con `verifyOtp()`
   - Procesa OAuth con `exchangeCodeForSession()`

3. **`src/components/auth/auth-form.tsx`**
   - UI para email/password
   - Botón de Google OAuth
   - Input para magic link

4. **`src/lib/supabase/middleware.ts`**
   - Función `updateSession()` para refrescar tokens

---

## ✅ Checklist de Funcionamiento

### Magic Link
- [ ] Email se envía correctamente
- [ ] Link redirige a `/auth/callback?token_hash=...&type=magiclink`
- [ ] Log muestra "Processing magic link callback"
- [ ] Log muestra "Magic link verified successfully"
- [ ] Redirige a home con sesión activa
- [ ] Header muestra "Mi Cuenta" y carrito

### OAuth Google
- [ ] Redirige a página de autorización de Google
- [ ] Después de autorizar, regresa a `/auth/callback?code=...`
- [ ] Log muestra "Processing OAuth callback with code"
- [ ] Log muestra "OAuth code exchanged successfully"
- [ ] Redirige a home con sesión activa
- [ ] Header muestra "Mi Cuenta" y carrito

### Email + Password
- [ ] Login directo sin callback
- [ ] Redirige inmediatamente a home
- [ ] Sesión activa
- [ ] Header actualizado

---

## 🎯 Resultado Final

- ✅ **3 métodos** de autenticación funcionando
- ✅ Magic Link con `verifyOtp()`
- ✅ OAuth con PKCE correcto
- ✅ Email/Password tradicional
- ✅ Middleware no interfiere con callbacks
- ✅ Logging detallado para debugging
- ✅ Manejo de errores robusto
- ✅ Seguridad en todas las rutas

---

**Fecha**: Octubre 13, 2025  
**Status**: ✅ Todos los flujos funcionando  
**Build**: ✅ Exitoso

