# 📋 Líneas de Pedido - Relación Muchos a Muchos

## ✅ **IMPLEMENTACIÓN COMPLETADA**

Se ha configurado exitosamente la entidad `LineaPedido` como tabla intermedia para la relación **muchos a muchos** entre `Producto` y `Pedido`.

## 🔑 **Características de la Clave Principal Compuesta**

### Estructura de la Tabla `linea_pedido`:
- **pedido_id** (FK → tabla pedidos)
- **producto_id** (FK → tabla productos)  
- **cantidad** (atributo adicional)
- **Clave Principal**: `(pedido_id, producto_id)`

### Configuración en TypeScript:
```typescript
@Entity()
export class LineaPedido {
  @ManyToOne(() => 'Pedido', { primary: true })
  pedido!: any

  @ManyToOne(() => 'Producto', { primary: true })
  producto!: any

  @Property({ nullable: false })
  cantidad!: number

  [PrimaryKeyType]?: [number, number]
}
```

## 🌐 **Endpoints Disponibles**

### Rutas base: `/api/lineas-pedido`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Listar todas las líneas de pedido |
| `GET` | `/pedido/:pedidoId` | Líneas de un pedido específico |
| `GET` | `/:pedidoId/:productoId` | Línea específica (clave compuesta) |
| `POST` | `/` | Crear nueva línea de pedido |
| `PUT/PATCH` | `/:pedidoId/:productoId` | Actualizar cantidad |
| `DELETE` | `/:pedidoId/:productoId` | Eliminar línea específica |

## 🧪 **Testing Rápido**

### 1. Autenticarse:
```http
POST http://localhost:3002/auth/login
Content-Type: application/json

{
  "usuario": "admin",
  "contraseña": "admin123"
}
```

### 2. Crear línea de pedido:
```http
POST http://localhost:3002/api/lineas-pedido
Content-Type: application/json

{
  "pedidoId": 1,
  "productoId": 1,
  "cantidad": 5
}
```

### 3. Listar líneas de pedido:
```http
GET http://localhost:3002/api/lineas-pedido
```

## ✨ **Funcionalidades Implementadas**

### ✅ **Validaciones de Negocio**
- ✅ Verificación de existencia de pedido y producto
- ✅ Control de stock disponible
- ✅ Prevención de líneas duplicadas
- ✅ Validación de cantidad al actualizar

### ✅ **Características Avanzadas**
- ✅ Clave principal compuesta `(pedido_id, producto_id)`
- ✅ Relaciones bidireccionales con poblado automático
- ✅ Manejo de errores específicos en español
- ✅ Códigos de estado HTTP apropiados
- ✅ Endpoint para obtener líneas por pedido

### ✅ **Integración Completa**
- ✅ Entidad registrada en MikroORM
- ✅ Rutas configuradas en Express
- ✅ Controlador con todas las operaciones CRUD
- ✅ Archivo de pruebas HTTP completo

## 🎯 **Estado del Servidor**
- **✅ Funcionando**: `http://localhost:3002/`
- **✅ Base de datos**: Conectada y actualizada
- **✅ Entidades**: 10 entidades detectadas correctamente
- **✅ Tabla**: `linea_pedido` creada con clave compuesta

## 📝 **Próximos Pasos Sugeridos**

1. **Crear datos de prueba** usando los endpoints existentes
2. **Probar todas las operaciones** con el archivo `.http`
3. **Implementar lógica de negocio adicional** (ej: calcular totales)
4. **Agregar endpoints de estadísticas** (ventas por producto, etc.)

---
**🎉 ¡La implementación de la relación muchos a muchos está completa y funcional!**
