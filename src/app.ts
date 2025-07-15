import 'reflect-metadata'
import express from 'express'
import { RequestContext } from '@mikro-orm/core'
import { orm, syncSchema } from './shared/db/orm.js'

// Importar rutas de autenticación
import usuarioRoutes from './auth/usuario.routes.js'

// Importar nuevas rutas del e-commerce
import { categoriaRouter } from './categoria/categoria.routes.js'
import { productoRouter } from './producto/producto.routes.js'
import { clienteRouter } from './cliente/cliente.routes.js'
import { pedidoRouter } from './pedido/pedido.routes.js'
import { provinciaRouter } from './provincia/provincia.routes.js'
import { localidadRouter } from './localidad/localidad.routes.js'
import { lineaPedidoRouter } from './lineapedido/lineapedido.routes.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Servir archivos estáticos
app.use(express.static('public'))

// Contexto de EntityManager por request
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

// Health check endpoint para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CRUDS Impresion API',
    version: '1.0.0'
  })
})

// Rutas de autenticación
app.use('/api/usuarios', usuarioRoutes)

// Rutas del e-commerce
app.use('/api/categorias', categoriaRouter)
app.use('/api/productos', productoRouter)
app.use('/api/clientes', clienteRouter)
app.use('/api/pedidos', pedidoRouter)
app.use('/api/provincias', provinciaRouter)
app.use('/api/localidades', localidadRouter)
app.use('/api/lineas-pedido', lineaPedidoRouter)

// 404 handler
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

export default app

// Solo iniciar el servidor si este archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  // Sincronizar base de datos (dev only)
  await syncSchema()

  const PORT = process.env.PORT || 3002
  console.log(`🚀 Starting server on port ${PORT}...`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}/`)
    console.log(`🌐 Health check: http://0.0.0.0:${PORT}/health`)
  })
}
