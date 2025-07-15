import { Router } from 'express'
import { 
  sanitizeCategoriaInput, 
  findAll, 
  findOne, 
  findByName,
  getStats,
  add, 
  update, 
  remove 
} from './categoria.controller.js'

export const categoriaRouter = Router()

// Rutas especiales (deben ir antes de las rutas con parámetros)
categoriaRouter.get('/search', findByName)
categoriaRouter.get('/stats', getStats)

// Rutas CRUD básicas
categoriaRouter.get('/', findAll)
categoriaRouter.get('/:id', findOne)
categoriaRouter.post('/', sanitizeCategoriaInput, add)
categoriaRouter.put('/:id', sanitizeCategoriaInput, update)
categoriaRouter.patch('/:id', sanitizeCategoriaInput, update)
categoriaRouter.delete('/:id', remove)
