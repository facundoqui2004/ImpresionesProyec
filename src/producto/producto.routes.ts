import { Router } from 'express'
import { 
  sanitizeProductoInput, 
  findAll, 
  findOne, 
  findByCategoria, 
  findByName,
  findLowStock,
  add, 
  update, 
  remove 
} from './producto.controller.js'

export const productoRouter = Router()

// Rutas especiales (deben ir antes de las rutas con parámetros)
productoRouter.get('/search', findByName)
productoRouter.get('/stock-bajo', findLowStock)
productoRouter.get('/categoria/:categoriaId', findByCategoria)

// Rutas CRUD básicas
productoRouter.get('/', findAll)
productoRouter.get('/:id', findOne)
productoRouter.post('/', sanitizeProductoInput, add)
productoRouter.put('/:id', sanitizeProductoInput, update)
productoRouter.patch('/:id', sanitizeProductoInput, update)
productoRouter.delete('/:id', remove)
