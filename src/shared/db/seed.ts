import { orm } from './orm.js'
import bcrypt from 'bcryptjs'

async function seedBasicData() {
  const em = orm.em.fork()
  
  try {
    // Importar entidades dinámicamente
    const { Usuario } = await import('../../auth/usuario.entity.js')
    const { Provincia } = await import('../../provincia/provincia.entity.js')
    const { Localidad } = await import('../../localidad/localidad.entity.js')

    console.log('🌱 Creando datos básicos esenciales...')

    // Solo crear un usuario admin básico
    console.log('👤 Creando usuario administrador...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    const adminUser = em.create(Usuario, {
      usuario: 'admin',
      email: 'admin@empresa.com',
      contraseña: adminPassword,
      rol: 'admin',
      estado: 'activo'
    })

    // Crear algunas provincias básicas
    console.log('🗺️ Creando provincias básicas...')
    const buenosAires = em.create(Provincia, {
      codProv: 'BA',
      nombreProv: 'Buenos Aires'
    })

    const cordoba = em.create(Provincia, {
      codProv: 'CB',
      nombreProv: 'Córdoba'
    })

    // Crear algunas localidades básicas
    console.log('🏙️ Creando localidades básicas...')
    em.create(Localidad, {
      codPostal: '1000',
      ciudad: 'Ciudad Autónoma de Buenos Aires',
      provincia: buenosAires
    })

    em.create(Localidad, {
      codPostal: '1900',
      ciudad: 'La Plata',
      provincia: buenosAires
    })

    em.create(Localidad, {
      codPostal: '5000',
      ciudad: 'Córdoba Capital',
      provincia: cordoba
    })

    await em.flush()
    console.log('✅ Datos básicos creados exitosamente')
    console.log('🔑 Usuario admin: admin / admin123')
    
  } catch (error: any) {
    console.error('❌ Error al crear datos básicos:', error)
    throw error
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedBasicData()
  await orm.close()
}

export { seedBasicData }