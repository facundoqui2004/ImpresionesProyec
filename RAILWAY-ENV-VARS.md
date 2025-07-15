# 🔧 VARIABLES DE ENTORNO PARA RAILWAY

## ✅ **VARIABLES OBLIGATORIAS A CONFIGURAR**

### 1. **Variables de aplicación (AGREGAR MANUALMENTE):**
```env
NODE_ENV=production
JWT_SECRET=0c4fc4948df86472e7bae20709fa4023213ff77ca40b7deb3c06675a26e5903e
```

### 2. **Variables MySQL (SE GENERAN AUTOMÁTICAMENTE):**
```env
# Estas se crean cuando agregas MySQL service en Railway
MYSQL_DATABASE=railway
MYSQL_ROOT_PASSWORD=wCQJldwLLCNUcLRIofvofBXcWxvpUENl
MYSQLUSER=root
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLPASSWORD=wCQJldwLLCNUcLRIofvofBXcWxvpUENl
```

### 3. **Variables opcionales:**
```env
# Railway asigna PORT automáticamente
PORT=3000

# Para CORS (opcional)
FRONTEND_URL=https://tu-frontend-domain.com
```

---

## 📋 **PASOS EXACTOS EN RAILWAY:**

### Paso 1: **Agregar las 2 variables obligatorias**
En Railway Dashboard → Variables → Add Variable:

| Variable | Valor |
|----------|--------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `0c4fc4948df86472e7bae20709fa4023213ff77ca40b7deb3c06675a26e5903e` |

### Paso 2: **Agregar MySQL Service**
1. Add Service → Database → MySQL
2. Railway generará automáticamente todas las `MYSQL_*` variables

---

## 🎯 **RESUMEN: SOLO NECESITAS AGREGAR 2 VARIABLES**

✅ **NODE_ENV** = `production`
✅ **JWT_SECRET** = `0c4fc4948df86472e7bae20709fa4023213ff77ca40b7deb3c06675a26e5903e`

**¡El resto se genera automáticamente!** 🚀
