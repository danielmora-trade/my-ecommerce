# 🚀 Guía de Configuración del Pipeline CI/CD

Esta guía te ayudará a configurar GitHub Actions y Vercel para que funcionen correctamente con el proyecto ACEROMAX E-Commerce.

## 📋 Requisitos Previos

- Cuenta de GitHub con acceso al repositorio
- Cuenta de Vercel con el proyecto conectado
- Proyecto de Supabase configurado

## 🔧 Configuración en GitHub

### 1. Secrets de GitHub

Ve a tu repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions** y agrega los siguientes secrets:

#### Secrets Obligatorios:

| Secret | Descripción | Dónde obtenerlo |
|--------|-------------|-----------------|
| `VERCEL_TOKEN` | Token de autenticación de Vercel | [Vercel Account Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | ID de tu organización/cuenta en Vercel | Ver `.vercel/project.json` o Vercel Dashboard |
| `VERCEL_PROJECT_ID` | ID del proyecto en Vercel | Ver `.vercel/project.json` o Vercel Dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | Supabase Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Supabase Project Settings → API |

#### Secrets Opcionales:

| Secret | Descripción | Dónde obtenerlo |
|--------|-------------|-----------------|
| `CODECOV_TOKEN` | Token para subir cobertura de código | [Codecov.io](https://codecov.io) (gratis para repos públicos) |

### 2. Configuración de Branch Protection (Recomendado)

Para la rama `develop`:

1. Ve a **Settings** → **Branches** → **Add branch protection rule**
2. Branch name pattern: `develop`
3. Marca las siguientes opciones:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
     - Selecciona los checks: `Code Quality & Security`, `Unit Tests`, `Build Documentation`
   - ✅ **Require branches to be up to date before merging**
   - ⚠️ **NO marques** "Require linear history" (puede causar problemas con merges)

### 3. Obtener las IDs de Vercel

#### Opción 1: Desde el archivo `.vercel/project.json`

Si ya desplegaste a Vercel, este archivo contiene las IDs:

```bash
cat .vercel/project.json
```

```json
{
  "projectId": "prj_xxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxx"
}
```

#### Opción 2: Desde Vercel Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **General**
4. Copia el **Project ID**
5. Para el **Org ID**, ve a tu perfil → **Account Settings** → copia tu **Team ID** o **User ID**

#### Opción 3: Usando Vercel CLI

```bash
npx vercel link
# Sigue las instrucciones
# Después ejecuta:
cat .vercel/project.json
```

## 🌐 Configuración en Vercel

### 1. Deshabilitar Auto-Deploy desde GitHub

Para que solo se despliegue cuando el pipeline pasa, necesitas configurar Vercel:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **Git**
3. En **Production Branch**, cambia a `main` (si quieres que solo `main` se auto-despliegue)
4. **Desactiva** "Automatic deployments on push" para la rama `develop`:
   - En **Git Integration** → **Ignored Build Step**
   - Agrega el siguiente script:

```bash
#!/bin/bash

# Solo permitir deployments desde GitHub Actions
if [[ "$VERCEL_GIT_COMMIT_REF" == "develop" ]] ; then
  # Verificar si hay una variable de entorno que indica que viene de GitHub Actions
  if [[ -z "$VERCEL_BYPASS" ]] ; then
    echo "🛑 Bloqueando deployment automático para develop"
    echo "ℹ️  El deployment debe hacerse desde GitHub Actions"
    exit 0
  fi
fi

# Permitir deployment para main o si viene de GitHub Actions
exit 1
```

### 2. Variables de Entorno en Vercel

Asegúrate de tener las siguientes variables de entorno en Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables para **Production**:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `NODE_ENV` | `production` |

### 3. Generar Token de Vercel

1. Ve a [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click en **Create**
3. Nombre: `GitHub Actions CI/CD`
4. Scope: **Full Account**
5. Expiration: **No Expiration** (o el tiempo que prefieras)
6. Copia el token y guárdalo en GitHub Secrets como `VERCEL_TOKEN`

## 🔄 Flujo de Trabajo

### Flujo Normal de Desarrollo

1. **Crear una rama de feature**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Hacer commits**:
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

3. **Crear Pull Request** hacia `develop`:
   - El pipeline se ejecutará automáticamente
   - Verás los checks en el PR:
     - ✅ Code Quality & Security
     - ✅ Unit Tests
     - ✅ Build Documentation
   - **NO** se desplegará a Vercel aún

4. **Mergear a `develop`** (cuando todos los checks pasen):
   ```bash
   # Desde GitHub UI o CLI
   gh pr merge --merge
   ```
   - El pipeline se ejecutará nuevamente
   - **SI** se desplegará a Vercel (producción)

5. **Deployment a producción**:
   - Cuando `develop` esté estable, mergear a `main`:
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```
   - Se desplegará automáticamente a producción

### Si el Pipeline Falla

1. **Code Quality & Security falla**:
   - Revisa los errores de ESLint o TypeScript
   - Corre localmente: `npm run lint` y `npm run type-check`

2. **Unit Tests falla**:
   - Revisa qué tests fallaron
   - Corre localmente: `npm run test:ci`

3. **Build Documentation falla**:
   - Revisa los errores de Docusaurus
   - Corre localmente: `npm run docs:build`

4. **Deploy falla**:
   - Revisa los logs en GitHub Actions
   - Verifica que los secrets estén correctamente configurados

## 🧪 Pruebas Locales

Antes de hacer push, puedes simular el pipeline localmente:

```bash
# 1. Lint
npm run lint

# 2. Type check
npm run type-check

# 3. Tests
npm run test:ci

# 4. Build
npm run build

# 5. Build docs
npm run docs:build
```

## 📊 Características del Pipeline

### Jobs del Pipeline

1. **Code Quality & Security** (🔍):
   - TypeScript type checking
   - ESLint linting
   - Security audit de dependencias
   - Build verification

2. **Unit Tests** (🧪):
   - Ejecuta todos los tests unitarios
   - Genera reporte de cobertura
   - Sube cobertura a Codecov (opcional)

3. **Build Documentation** (📚):
   - Compila la documentación de Docusaurus
   - Verifica que no haya errores

4. **Deploy to Vercel** (🚀):
   - Solo se ejecuta si todos los checks anteriores pasan
   - Solo para las ramas `develop` y `main`
   - Usa Vercel CLI para deployments
   - Comenta en PRs con el URL de preview

5. **Pipeline Status** (📊):
   - Reporte final del estado del pipeline

### Optimizaciones

- ✅ Cache de `node_modules` para instalar más rápido
- ✅ Jobs en paralelo cuando es posible
- ✅ Reuso de dependencias entre jobs
- ✅ Conditional execution (deploy solo cuando es necesario)

## 🚨 Solución de Problemas

### Error: "VERCEL_TOKEN not found"

**Causa**: No se configuró el secret en GitHub.

**Solución**: Ve a Settings → Secrets → Actions y agrega `VERCEL_TOKEN`.

### Error: "Cannot find module 'prism-react-renderer'"

**Causa**: Next.js intentaba compilar la carpeta `docs/`.

**Solución**: Ya está resuelto con:
- `.vercelignore` excluyendo `docs/`
- `tsconfig.json` excluyendo `docs/`
- `next.config.ts` configurado para ignorar `docs/`

### Error: "Deployment failed" en Vercel

**Causa**: Posiblemente las variables de entorno no están configuradas.

**Solución**: 
1. Verifica las variables en Vercel Dashboard → Settings → Environment Variables
2. Asegúrate de tener `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Error: "Permission denied" en GitHub Actions

**Causa**: El `GITHUB_TOKEN` no tiene permisos para comentar en PRs.

**Solución**: 
1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona "Read and write permissions"

## 📈 Monitoreo

### GitHub Actions

- Ve a la pestaña **Actions** en tu repo
- Selecciona el workflow "CI/CD Pipeline"
- Verás el historial de ejecuciones

### Vercel

- Ve a [Vercel Dashboard](https://vercel.com/dashboard)
- Selecciona tu proyecto
- Ve a la pestaña **Deployments**
- Verás todos los deployments con su estado

### Codecov (Opcional)

- Ve a [Codecov.io](https://codecov.io)
- Conecta tu repositorio
- Verás reportes de cobertura de código

## 🎯 Mejoras Futuras

- [ ] Agregar tests E2E con Playwright
- [ ] Agregar análisis de performance con Lighthouse CI
- [ ] Agregar notificaciones a Slack/Discord
- [ ] Agregar deployment a preview para cada PR
- [ ] Agregar automatic rollback en caso de fallo

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del pipeline en GitHub Actions
2. Revisa los logs de deployment en Vercel
3. Consulta esta documentación
4. Revisa la documentación oficial de [GitHub Actions](https://docs.github.com/en/actions) y [Vercel](https://vercel.com/docs)

