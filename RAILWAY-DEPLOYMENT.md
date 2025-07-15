# 🚀 Guía de Deployment en Railway

## ✅ **Archivos de Configuración Creados**

El proyecto ya está completamente configurado para Railway con los siguientes archivos:

### 📋 **Archivos Principales**
- `package.json` - Actualizado con scripts de build y start
- `Procfile` - Comando de ejecución para Railway
- `railway.json` - Configuración específica de Railway
- `nixpacks.toml` - Instrucciones para Nixpacks build
- `.env.example` - Plantilla de variables de entorno
- `.railwayignore` - Archivos a ignorar en deployment

## 🔧 **Pasos para Deployment**

### 1. **Subir a GitHub**
```bash
git add .
git commit -m "feat: Railway deployment configuration"
git push origin railway-deploy
```

### 2. **Configurar Railway**
1. Ir a [Railway.app](https://railway.app)
2. Conectar con GitHub
3. Seleccionar el repositorio `CRUDS_Impresion`
4. Elegir la rama `railway-deploy`

### 3. **Configurar Variables de Entorno en Railway**
En el dashboard de Railway, agregar estas variables:

```env
# Base de datos (usar Railway MySQL o externa)
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=[auto-generado por Railway]

# Configuración del servidor
PORT=3002
NODE_ENV=production

# JWT (generar una clave segura)
JWT_SECRET=tu_clave_jwt_super_secreta_aqui

# CORS (dominio de Railway)
FRONTEND_URL=https://tu-app.up.railway.app
```

### 4. **Configurar Base de Datos**
**Opción A: MySQL de Railway**
1. En Railway: Add Service → Database → MySQL
2. Conectar las variables automáticamente

**Opción B: Base de datos externa**
1. Usar las credenciales de tu MySQL existente
2. Asegurar que la IP de Railway esté en whitelist

## 🔍 **Verificación Post-Deployment**

### Endpoints a probar:
```
GET https://tu-app.up.railway.app/api/categorias
POST https://tu-app.up.railway.app/auth/login
```

### Health Check:
```bash
curl https://tu-app.up.railway.app/api/categorias
```

## 🐛 **Troubleshooting**

### Error: "Build failed"
- Verificar que `package.json` tenga script `build`
- Revisar logs de Nixpacks en Railway

### Error: "Database connection"
- Verificar variables de entorno DB_*
- Comprobar que MySQL esté corriendo

### Error: "Port binding"
- Railway asigna PORT automáticamente
- No hardcodear puerto en código

## 📊 **Monitoreo**

Railway proporciona:
- ✅ Logs en tiempo real
- ✅ Métricas de CPU/RAM
- ✅ Variables de entorno
- ✅ Reinicios automáticos

## 🎯 **Configuración Optimizada**

El proyecto incluye:
- ✅ **Build optimizado** con TypeScript
- ✅ **Variables de entorno** configurables
- ✅ **Manejo de errores** robusto
- ✅ **CORS configurado** para production
- ✅ **Health checks** automáticos

---

## 🚀 **¡Listo para Production!**

Tu API está completamente configurada para Railway. Solo necesitas:
1. Push a GitHub
2. Conectar en Railway
3. Configurar variables de entorno
4. ¡Deploy automático! 🎉
