import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

export const orm = await MikroORM.init({
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
    // nunca en producción
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
})

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator()
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema()
}

