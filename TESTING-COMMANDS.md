# 🔑 **CREDENCIALES Y COMANDOS DE PRUEBA**

## 🔐 **Variables de Entorno para Railway**

### **Copiar y pegar exactamente:**

```env
NODE_ENV=production
JWT_SECRET=0c4fc4948df86472e7bae20709fa4023213ff77ca40b7deb3c06675a26e5903e
```

---

## 🧪 **Comandos de Prueba Post-Deployment**

### **1. Health Check:**
```bash
curl https://TU-DOMINIO-RAILWAY.up.railway.app/health
```

### **2. Login Admin:**
```bash
curl -X POST https://TU-DOMINIO-RAILWAY.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contraseña":"admin123"}'
```

### **3. Listar Categorías:**
```bash
curl https://TU-DOMINIO-RAILWAY.up.railway.app/api/categorias
```

### **4. Crear Categoría (con autenticación):**
```bash
curl -X POST https://TU-DOMINIO-RAILWAY.up.railway.app/api/categorias \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=TU_TOKEN_JWT" \
  -d '{"nombre":"Impresiones","descripcion":"Servicios de impresión"}'
```

---

## 📋 **Checklist de Deployment**

- [ ] Repositorio conectado con rama `railway-production`
- [ ] MySQL service agregado en Railway
- [ ] Variables `NODE_ENV` y `JWT_SECRET` configuradas
- [ ] Primer deployment completado sin errores
- [ ] Health check responde OK
- [ ] Login admin funciona
- [ ] API responde correctamente

---

## 🎯 **URL de tu Proyecto**

Una vez deployado, tu API estará disponible en:
```
https://[nombre-proyecto].up.railway.app
```

**¡Guarda esta URL para acceso futuro!** 🚀
