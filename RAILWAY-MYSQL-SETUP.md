# 🐬 Railway MySQL Configuration Guide

## 🎯 **Configuración Automática de Railway**

Tu proyecto ya está configurado para usar las variables de entorno de Railway MySQL automáticamente.

### ✅ **Variables que Railway genera automáticamente:**

```env
MYSQL_DATABASE=railway
MYSQL_ROOT_PASSWORD=wCQJldwLLCNUcLRIofvofBXcWxvpUENl
MYSQLUSER=root
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLPASSWORD=wCQJldwLLCNUcLRIofvofBXcWxvpUENl
```

### 🔧 **Variables que debes agregar manualmente:**

```env
NODE_ENV=production
JWT_SECRET=9296a0bdd8bba1353a022e7ac1f8352bd00c90abe5897aa1d00473a11a922c45
```

## 📋 **Pasos para configurar en Railway:**

### 1. **Agregar MySQL Service**
1. En tu proyecto de Railway: **"Add Service"**
2. Seleccionar **"Database"** → **"MySQL"**
3. Railway generará todas las variables MYSQL_* automáticamente

### 2. **Configurar Variables Adicionales**
En tu proyecto, ir a **"Variables"** y agregar:

| Variable | Valor | Descripción |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Modo de producción |
| `JWT_SECRET` | `[clave-segura-32-chars]` | Clave para tokens JWT |

### 3. **Generar JWT_SECRET seguro:**
```bash
# Opción 1: Usar openssl
openssl rand -base64 32

# Opción 2: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 3: Online (solo para desarrollo)
# https://generate-secret.vercel.app/32
```

## 🔍 **Verificación de Configuración:**

### **Variables detectadas por MikroORM:**
- ✅ **Host**: `MYSQLHOST` → `mysql.railway.internal`
- ✅ **Puerto**: `MYSQLPORT` → `3306`
- ✅ **Base de datos**: `MYSQL_DATABASE` → `railway`
- ✅ **Usuario**: `MYSQLUSER` → `root`
- ✅ **Contraseña**: `MYSQLPASSWORD` → `[auto-generado]`

### **Orden de prioridad de variables:**
1. `MYSQL_*` (Railway nativo)
2. `MYSQL*` (Railway alternativo)
3. `DB_*` (fallback local)

## 🚀 **Deployment Final:**

1. **Push código**: ✅ Completado
2. **Conectar en Railway**: ✅ Rama `railway-production`
3. **Agregar MySQL**: Hacer en Railway dashboard
4. **Configurar JWT_SECRET**: Agregar manualmente
5. **Deploy automático**: Railway rebuildeará

## 🔧 **Troubleshooting:**

### Error: "Connection refused"
- Verificar que MySQL service esté running
- Comprobar variables MYSQL_* en dashboard

### Error: "Access denied"
- Verificar MYSQL_ROOT_PASSWORD
- Restart del servicio MySQL en Railway

### Error: "Database not found"
- Railway crea la DB automáticamente
- Verificar MYSQL_DATABASE=railway

---

## 🎉 **¡Todo Configurado!**

Tu aplicación está lista para usar la base de datos MySQL de Railway con configuración automática. Solo agrega el JWT_SECRET y ¡ya está!
