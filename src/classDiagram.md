```mermaid
classDiagram

class Usuario {
    +int id
    +string usuario
    +string email
    +string contraseña
    +string rol
    +string estado
}

class Cliente {
    +int id
    +string nombre
    +string apellido
    +string dni
    +string tipoDni
    +int usuarioId
}

class Categoria {
    +int id
    +string nombre
    +string descripcion
    +int cantidad
    +int total
    +string imagen
}

class Producto {
    +int id
    +string nombre
    +string descripcion
    +int cantidadStock
    +string imagen
    +string duracion
    +int precioVenta
    +string comprobante
    +int categoriaId
}

class Pedido {
    +int id
    +string estadoPedido
    +datetime fechaPedido
    +string formaPago
    +string direccionEntrega
    +int clienteId
}

class LineaPedido {
    +int pedidoId
    +int productoId
    +int cantidad
}

class Precio {
    +int productoId
    +datetime fechaModificacion
    +int precio
    +int precioKhw
    +int ganancia
}

class Provincia {
    +string codProv
    +string nombreProv
}

class Localidad {
    +string codPostal
    +string ciudad
    +string provinciaCodProv
}

%% Relaciones
Usuario ||--o{ Cliente : tiene
Cliente ||--o{ Pedido : realiza
Categoria ||--o{ Producto : contiene
Producto ||--o{ LineaPedido : se_vende_en
Pedido ||--o{ LineaPedido : incluye
Producto ||--o{ Precio : tiene_precio
Provincia ||--o{ Localidad : contiene
```