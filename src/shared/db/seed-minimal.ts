import { orm } from './orm.js'
import bcrypt from 'bcryptjs'

async function seedDatabase() {
  const em = orm.em.fork()
  
  try {
    // Importar entidades dinámicamente
    const { Usuario } = await import('../../auth/usuario.entity.js')
    const { Provincia } = await import('../../provincia/provincia.entity.js')
    const { Localidad } = await import('../../localidad/localidad.entity.js')

    // Verificar si ya hay datos básicos
    const existingUsuarios = await em.count(Usuario)
    if (existingUsuarios > 0) {
      console.log('✅ Los datos básicos ya están cargados en la base de datos')
      return
    }

    console.log('🌱 Iniciando seed básico de la base de datos...')

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
    const caba = em.create(Localidad, {
      codPostal: '1000',
      ciudad: 'Ciudad Autónoma de Buenos Aires',
      provincia: buenosAires
    })

    const laPlatoa = em.create(Localidad, {
      codPostal: '1900',
      ciudad: 'La Plata',
      provincia: buenosAires
    })

    const cordobaCapital = em.create(Localidad, {
      codPostal: '5000',
      ciudad: 'Córdoba Capital',
      provincia: cordoba
    })

    await em.flush()
    console.log('✅ Seed básico completado - Solo estructuras esenciales creadas')
    console.log('🔑 Usuario admin creado - usuario: admin, contraseña: admin123')
    
  } catch (error: any) {
    console.error('❌ Error al inicializar la base de datos:', error)
    throw error
  }
}

// NO ejecutar automáticamente - solo si se llama directamente
// if (import.meta.url === `file://${process.argv[1]}`) {
//   await seedDatabase()
//   await orm.close()
// }

export { seedDatabase }
