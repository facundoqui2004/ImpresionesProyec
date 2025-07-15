# 🔍 Verificar Deployment y Tablas en Railway - GUÍA PASO A PASO

## 📊 **1. VERIFICAR ESTADO DEL DEPLOYMENT**

### **A. En Railway Dashboard:**
1. Ve a: https://railway.app
2. Entra a tu proyecto "ImpresionesProyec" 
3. Busca tu servicio (Node.js app)
4. Verifica el estado:
   - 🟢 **Deployed**: ¡Funcionando!
   - 🟡 **Building**: Aún compilando
   - 🔴 **Failed**: Error (revisa logs)

### **B. Ver Logs del Deployment:**
1. En tu servicio → Click **"View Logs"**
2. Busca mensajes como:
   ```
   ✅ Build successful
   ✅ MikroORM connected to MySQL
   ✅ Server running on port 3000
   ```

## 🗄️ **2. VERIFICAR VARIABLES DE ENTORNO**

### **Variables que DEBE tener tu app:**
```env
# Railway MySQL (automáticas)
MYSQL_DATABASE=railway
MYSQL_ROOT_PASSWORD=[auto-generado]
MYSQLUSER=root
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLPASSWORD=[auto-generado]

# Variables que debes AGREGAR manualmente:
NODE_ENV=production
JWT_SECRET=9296a0bdd8bba1353a022e7ac1f8352bd00c90abe5897aa1d00473a11a922c45
```

### **Cómo agregar JWT_SECRET:**
1. En tu proyecto Railway → **"Variables"**
2. Click **"New Variable"**
3. Nombre: `JWT_SECRET`
4. Valor: `9296a0bdd8bba1353a022e7ac1f8352bd00c90abe5897aa1d00473a11a922c45`
5. Click **"Add"**

## 🔗 **3. OBTENER URL DE TU APP**

### **Encontrar tu URL:**
1. En tu servicio → **"Settings"** 
2. Sección **"Environment"**
3. Busca **"Public URL"** 
4. Debería ser algo como: `https://tu-app-name.up.railway.app`

## 🧪 **4. PROBAR SI LAS TABLAS SE CREARON**

### **Método 1: Health Check**
```bash
curl https://tu-app-name.up.railway.app/health
```
**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-15T...",
  "message": "API funcionando correctamente"
}
```

### **Método 2: Test API Endpoints**
```bash
# Productos (debería devolver array vacío si no hay datos)
curl https://tu-app-name.up.railway.app/api/productos

# Categorías
curl https://tu-app-name.up.railway.app/api/categorias

# Clientes  
curl https://tu-app-name.up.railway.app/api/clientes
```

### **Respuestas posibles:**
- ✅ `[]` (array vacío) = **Tablas creadas correctamente**
- ✅ `[{...datos...}]` = **Tablas con datos**
- ❌ `Error de conexión` = **Problema de DB**
- ❌ `404 Not Found` = **App no deployed**

## 🐬 **5. VERIFICAR MYSQL DATABASE**

### **A. Ver el servicio MySQL:**
1. En Railway → Tu proyecto
2. Debería haber 2 servicios:
   - 🟦 **Node.js** (tu app)
   - 🟠 **MySQL** (base de datos)

### **B. Conectar a MySQL (opcional):**
1. Click en servicio **MySQL**
2. En **"Variables"** encontrarás:
   - Host público para conexión externa
   - Credenciales para conectar con herramientas como MySQL Workbench

## 🚨 **PROBLEMAS COMUNES Y SOLUCIONES**

### **App no inicia:**
- Verifica que `JWT_SECRET` esté configurado
- Revisa logs para errores de conexión MySQL

### **Error "Database connection failed":**
- Confirma que MySQL service esté running (🟢)
- Redeploy tu app después de agregar MySQL

### **404 en todas las rutas:**
- Verifica que el build fue exitoso
- Confirma que `npm start` esté corriendo

### **Tablas no se crean:**
- MikroORM debería crear tablas automáticamente
- Revisa logs para errores de migración

## ✅ **SIGUIENTE PASO**
Una vez que confirmes que todo funciona:
1. **Usa el archivo** `verify-railway-tables.http` 
2. **Reemplaza** "your-railway-app-url" con tu URL real
3. **Ejecuta** las pruebas desde VS Code

---

## 🎯 **TU ACCIÓN INMEDIATA:**
1. Ve a Railway Dashboard
2. Copia tu URL pública
3. Agrega JWT_SECRET como variable
4. Prueba: `https://tu-url.up.railway.app/health`
