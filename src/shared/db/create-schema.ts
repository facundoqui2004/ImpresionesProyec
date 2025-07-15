import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

async function createSchema() {
  console.log('🗄️ Creando esquema de base de datos...')
  
  try {
    const orm = await MikroORM.init({
      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      dbName: process.env.DB_NAME || 'impresionesquinio',
      password: process.env.DB_PASSWORD || 'facu',
      user: process.env.DB_USER || 'facu',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3309,
      type: 'mysql',
      highlighter: new SqlHighlighter(),
      debug: true,
      schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
      },
    })

    const generator = orm.getSchemaGenerator()
    
    // Crear las tablas
    console.log('📋 Generando esquema de base de datos...')
    await generator.createSchema()
    
    console.log('✅ ¡Esquema creado exitosamente!')
    
    // Verificar las tablas creadas
    console.log('\n📊 Verificando tablas creadas...')
    const em = orm.em.fork()
    const result = await em.getConnection().execute('SHOW TABLES')
    const tables = Array.isArray(result) ? result[0] : result
    
    console.log('Tablas en la base de datos:')
    if (Array.isArray(tables)) {
      tables.forEach((table: any) => {
        console.log(`   - ${Object.values(table)[0]}`)
      })
    }
    
    await orm.close()
    
    console.log('\n🎉 ¡Base de datos lista para el seeding!')
    
  } catch (error) {
    console.error('❌ Error creando el esquema:', error)
    process.exit(1)
  }
}

// Ejecutar la creación del esquema
createSchema()
