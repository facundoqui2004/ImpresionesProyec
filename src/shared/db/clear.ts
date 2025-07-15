import { orm } from './orm.js'

async function clearDatabase() {
  const em = orm.em.fork()
  
  try {
    console.log('🧹 Limpiando base de datos...')
    
    // Importar todas las entidades dinámicamente
    const { LineaPedido } = await import('../../lineapedido/lineapedido.entity.js')
    const { Pedido } = await import('../../pedido/pedido.entity.js')
    const { Precio } = await import('../../precio/precio.entity.js')
    const { Producto } = await import('../../producto/producto.entity.js')
    const { Categoria } = await import('../../categoria/categoria.entity.js')
    const { Cliente } = await import('../../cliente/cliente.entity.js')
    const { Usuario } = await import('../../auth/usuario.entity.js')
    const { Localidad } = await import('../../localidad/localidad.entity.js')
    const { Provincia } = await import('../../provincia/provincia.entity.js')

    // Eliminar en orden correcto (respetando las foreign keys)
    console.log('🗑️ Eliminando líneas de pedido...')
    await em.nativeDelete(LineaPedido, {})
    
    console.log('🗑️ Eliminando precios...')
    await em.nativeDelete(Precio, {})
    
    console.log('🗑️ Eliminando pedidos...')
    await em.nativeDelete(Pedido, {})
    
    console.log('🗑️ Eliminando productos...')
    await em.nativeDelete(Producto, {})
    
    console.log('🗑️ Eliminando categorías...')
    await em.nativeDelete(Categoria, {})
    
    console.log('🗑️ Eliminando clientes...')
    await em.nativeDelete(Cliente, {})
    
    console.log('🗑️ Eliminando usuarios...')
    await em.nativeDelete(Usuario, {})
    
    console.log('🗑️ Eliminando localidades...')
    await em.nativeDelete(Localidad, {})
    
    console.log('🗑️ Eliminando provincias...')
    await em.nativeDelete(Provincia, {})

    await em.flush()
    
    console.log('✅ Base de datos limpiada exitosamente')
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error)
    throw error
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  await clearDatabase()
  await orm.close()
}

export { clearDatabase }
