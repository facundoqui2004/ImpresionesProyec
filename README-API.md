# 🚀 API CRUD Impresiones - Documentación Completa

## 📋 Resumen del Proyecto

Sistema CRUD completo para gestión de impresiones desarrollado con:
- **Node.js** + **TypeScript**
- **Express.js** (Framework web)
- **MikroORM** (ORM para base de datos)
- **MySQL** (Base de datos)
- **JWT** (Autenticación)
- **bcryptjs** (Hash de contraseñas)

## 🏗️ Arquitectura

```
src/
├── app.ts                 # Configuración principal del servidor
├── config.ts             # Configuración general
├── api-test.http         # Tests generales de la API
├── auth/                 # Autenticación y usuarios
├── categoria/            # Gestión de categorías
├── cliente/              # Gestión de clientes
├── producto/             # Gestión de productos
├── pedido/               # Gestión de pedidos
├── provincia/            # Gestión de provincias
├── localidad/            # Gestión de localidades
└── shared/db/            # Configuración de base de datos
```

## 🌐 Endpoints Disponibles

### 🔐 Autenticación (`/api/usuarios`)
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `POST /logout` - Cerrar sesión
- `GET /me` - Perfil del usuario actual
- `GET /` - Listar todos los usuarios (admin)
- `GET /:id` - Obtener usuario por ID (admin)
- `PUT /:id` - Actualizar usuario (admin)
- `DELETE /:id` - Eliminar usuario (admin)

### 📁 Categorías (`/api/categorias`)
- `GET /` - Obtener todas las categorías
- `GET /:id` - Obtener categoría por ID
- `GET /search?nombre=<texto>` - Buscar categorías por nombre
- `GET /stats` - Estadísticas de categorías
- `POST /` - Crear nueva categoría
- `PUT /:id` - Actualizar categoría completa
- `PATCH /:id` - Actualizar categoría parcial
- `DELETE /:id` - Eliminar categoría

### 🛍️ Productos (`/api/productos`)
- `GET /` - Obtener todos los productos
- `GET /:id` - Obtener producto por ID
- `GET /search?nombre=<texto>` - Buscar productos por nombre
- `GET /stock-bajo?limite=<numero>` - Productos con stock bajo
- `GET /categoria/:categoriaId` - Productos por categoría
- `POST /` - Crear nuevo producto
- `PUT /:id` - Actualizar producto completo
- `PATCH /:id` - Actualizar producto parcial
- `DELETE /:id` - Eliminar producto

### 👥 Clientes (`/api/clientes`)
- `GET /` - Obtener todos los clientes
- `GET /:id` - Obtener cliente por ID
- `POST /` - Crear nuevo cliente
- `PUT /:id` - Actualizar cliente completo
- `PATCH /:id` - Actualizar cliente parcial
- `DELETE /:id` - Eliminar cliente

### 📦 Pedidos (`/api/pedidos`)
- `GET /` - Obtener todos los pedidos
- `GET /:id` - Obtener pedido por ID
- `GET /cliente/:clienteId` - Pedidos por cliente
- `GET /estado/:estado` - Pedidos por estado
- `GET /fecha?desde=<fecha>&hasta=<fecha>` - Pedidos por rango de fechas
- `POST /` - Crear nuevo pedido
- `PUT /:id` - Actualizar pedido completo
- `PATCH /:id` - Actualizar pedido parcial
- `DELETE /:id` - Eliminar pedido

### 🌍 Provincias (`/api/provincias`)
- `GET /` - Obtener todas las provincias
- `GET /:codProv` - Obtener provincia por código
- `POST /` - Crear nueva provincia
- `PUT /:codProv` - Actualizar provincia completa
- `PATCH /:codProv` - Actualizar provincia parcial
- `DELETE /:codProv` - Eliminar provincia

### 🏘️ Localidades (`/api/localidades`)
- `GET /` - Obtener todas las localidades
- `GET /:codPostal` - Obtener localidad por código postal
- `GET /provincia/:codProv` - Localidades por provincia
- `POST /` - Crear nueva localidad
- `PUT /:codPostal` - Actualizar localidad completa
- `PATCH /:codPostal` - Actualizar localidad parcial
- `DELETE /:codPostal` - Eliminar localidad

## 🗂️ Entidades de Base de Datos

### Usuario
- **id**: Identificador único
- **usuario**: Nombre de usuario único
- **email**: Email único
- **contraseña**: Hash de la contraseña
- **rol**: 'admin' | 'cliente'
- **estado**: 'activo' | 'inactivo'

### Cliente
- **id**: Identificador único
- **nombre**: Nombre del cliente
- **apellido**: Apellido del cliente
- **dni**: DNI único
- **tipoDni**: Tipo de documento
- **usuario**: Relación con Usuario

### Categoria
- **id**: Identificador único
- **nombre**: Nombre único de la categoría
- **descripcion**: Descripción de la categoría
- **cantidad**: Cantidad de productos
- **total**: Total en dinero
- **imagen**: URL de la imagen

### Producto
- **id**: Identificador único
- **nombre**: Nombre del producto
- **descripcion**: Descripción del producto
- **cantidadStock**: Stock disponible
- **imagen**: URL de la imagen
- **duracion**: Duración/garantía
- **precioVenta**: Precio de venta
- **comprobante**: Tipo de comprobante
- **categoria**: Relación con Categoria

### Pedido
- **id**: Identificador único
- **estadoPedido**: Estado actual del pedido
- **fechaPedido**: Fecha del pedido
- **formaPago**: Forma de pago
- **direccionEntrega**: Dirección de entrega
- **cliente**: Relación con Cliente

### Provincia
- **codProv**: Código de provincia (PK)
- **nombreProv**: Nombre de la provincia

### Localidad
- **codPostal**: Código postal (PK)
- **ciudad**: Nombre de la ciudad
- **provincia**: Relación con Provincia

## 🔧 Funcionalidades Implementadas

### ✅ Autenticación y Autorización
- Registro de usuarios con validaciones
- Login con JWT y cookies HTTP-only
- Middleware de autenticación
- Roles de usuario (admin/cliente)

### ✅ Validaciones y Manejo de Errores
- Validación de datos de entrada
- Sanitización de inputs
- Manejo completo de errores HTTP
- Respuestas consistentes en español

### ✅ Funcionalidades Avanzadas
- Búsqueda por texto en múltiples entidades
- Filtros y consultas especiales
- Estadísticas y reportes
- Relaciones entre entidades
- Validación de integridad referencial

### ✅ Estructura de Datos Consistente
- Respuestas JSON estandarizadas
- Códigos de estado HTTP apropiados
- Paginación y conteo de resultados
- Población de relaciones

## 🚀 Scripts Disponibles

```bash
# Desarrollo con recarga automática
pnpm run start:dev

# Compilar TypeScript
pnpm run build

# Ejecutar en producción
pnpm start

# Instalar dependencias
pnpm install
```

## 🔗 URLs de Prueba

**Servidor:** http://localhost:3002

**Ejemplos de uso:**
- GET http://localhost:3002/api/categorias/
- GET http://localhost:3002/api/productos/search?nombre=Samsung
- GET http://localhost:3002/api/categorias/stats
- POST http://localhost:3002/api/usuarios/login

## 📝 Archivos HTTP de Prueba

Cada módulo incluye su archivo `.http` para pruebas:
- `src/auth/usuario.http`
- `src/categoria/categoria.http`
- `src/producto/producto.http`
- `src/cliente/cliente.http`
- `src/pedido/pedido.http`
- `src/provincia/provincia.http`
- `src/localidad/localidad.http`
- `src/api-test.http` (Pruebas generales)

## 📊 Estado del Proyecto

✅ **Completado:**
- Sistema de autenticación completo
- CRUD completo para todas las entidades
- APIs REST con validaciones
- Manejo de errores robusto
- Documentación y archivos de prueba

🎯 **Listo para usar y extender!**
