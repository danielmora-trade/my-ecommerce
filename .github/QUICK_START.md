# ⚡ Inicio Rápido del Pipeline CI/CD

Guía rápida para configurar el pipeline de GitHub Actions con Vercel.

## 🚀 Configuración en 5 Pasos

### 1️⃣ Obtener Token de Vercel

```bash
# Visita: https://vercel.com/account/tokens
# Crear token con scope "Full Account"
# Copiar el token generado
```

### 2️⃣ Obtener IDs de Vercel

**Opción A: Desde CLI**
```bash
npx vercel link
cat .vercel/project.json
```

**Opción B: Manualmente**
- Ve a https://vercel.com/dashboard
- Selecciona tu proyecto → Settings → General
- Copia el **Project ID**
- En tu cuenta → Settings → copia el **Team/User ID**

### 3️⃣ Configurar Secrets en GitHub

Ve a tu repositorio en GitHub:
```
Settings → Secrets and variables → Actions → New repository secret
```

Agrega estos secrets:

| Secret | Valor |
|--------|-------|
| `VERCEL_TOKEN` | El token que obtuviste en el paso 1 |
| `VERCEL_ORG_ID` | El `orgId` de `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | El `projectId` de `.vercel/project.json` |
| `NEXT_PUBLIC_SUPABASE_URL` | Tu URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu clave anónima de Supabase |

### 4️⃣ Configurar Permisos en GitHub

```
Settings → Actions → General → Workflow permissions
```

Selecciona:
- ✅ **Read and write permissions**

### 5️⃣ Deshabilitar Auto-Deploy en Vercel (Opcional)

Para que solo se despliegue cuando el pipeline pasa:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Git** → **Ignored Build Step**
3. Agrega este script:

```bash
#!/bin/bash
if [[ "$VERCEL_GIT_COMMIT_REF" == "develop" ]] ; then
  if [[ -z "$VERCEL_BYPASS" ]] ; then
    echo "🛑 Deployment bloqueado - usar GitHub Actions"
    exit 0
  fi
fi
exit 1
```

## ✅ Verificación

Haz un commit y push a `develop`:

```bash
git add .
git commit -m "test: verificar pipeline"
git push origin develop
```

Ve a la pestaña **Actions** en GitHub y verifica que:
- ✅ El workflow "CI/CD Pipeline" se ejecute
- ✅ Todos los jobs pasen
- ✅ Se despliegue a Vercel

## 🔍 Archivos Creados

- `.github/workflows/ci-cd.yml` - Pipeline principal
- `.vercelignore` - Archivos excluidos del deployment
- `tsconfig.json` - Configurado para excluir `/docs`
- `next.config.ts` - Configurado para ignorar `/docs`

## 🚨 Solución Rápida de Problemas

### "VERCEL_TOKEN not found"
→ Verifica que agregaste el secret en GitHub (Settings → Secrets)

### "Cannot find module 'prism-react-renderer'"
→ Ya está solucionado con los cambios en `tsconfig.json` y `.vercelignore`

### "Permission denied"
→ Verifica los permisos del workflow en Settings → Actions → General

### Tests fallan
→ Ejecuta localmente: `npm run test:ci`

### Build falla
→ Ejecuta localmente: `npm run build`

## 📊 Flujo del Pipeline

```
Push a develop/main
    ↓
🔍 Code Quality (lint, type-check, security)
    ↓
🧪 Unit Tests (con cobertura)
    ↓
📚 Build Docs (verificación)
    ↓
🚀 Deploy to Vercel (solo si todo pasa)
    ↓
✅ Pipeline Status (reporte final)
```

## 📝 Comandos Útiles

```bash
# Verificar pipeline localmente
npm run lint && npm run type-check && npm run test:ci && npm run build

# Ver logs del workflow
gh run list
gh run view <run-id>

# Re-ejecutar workflow fallido
gh run rerun <run-id>
```

## 🔗 Enlaces Útiles

- [Documentación Completa](.github/PIPELINE_SETUP.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

## 🎯 Próximos Pasos

1. ✅ Configura el pipeline (siguiendo esta guía)
2. 📝 Haz tu primer commit
3. 🔍 Verifica que todo funcione
4. 🚀 Desarrolla con confianza sabiendo que cada cambio pasa por CI/CD

