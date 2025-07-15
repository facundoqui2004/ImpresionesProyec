import { Router } from 'express'
import { 
  sanitizeLineaPedidoInput, 
  findAll, 
  findOne, 
  findByPedido,
  add, 
  update, 
  remove 
} from './lineapedido.controller.js'

export const lineaPedidoRouter = Router()

// Rutas principales
lineaPedidoRouter.get('/', findAll)
lineaPedidoRouter.get('/pedido/:pedidoId', findByPedido)
lineaPedidoRouter.get('/:pedidoId/:productoId', findOne)
lineaPedidoRouter.post('/', sanitizeLineaPedidoInput, add)
lineaPedidoRouter.put('/:pedidoId/:productoId', sanitizeLineaPedidoInput, update)
lineaPedidoRouter.patch('/:pedidoId/:productoId', sanitizeLineaPedidoInput, update)
lineaPedidoRouter.delete('/:pedidoId/:productoId', remove)
