import { Router } from 'express'
import { sanitizePedidoInput, findAll, findOne, findByCliente, add, update, remove } from './pedido.controller.js'

export const pedidoRouter = Router()

pedidoRouter.get('/', findAll)
pedidoRouter.get('/:id', findOne)
pedidoRouter.get('/cliente/:clienteId', findByCliente)
pedidoRouter.post('/', sanitizePedidoInput, add)
pedidoRouter.put('/:id', sanitizePedidoInput, update)
pedidoRouter.patch('/:id', sanitizePedidoInput, update)
pedidoRouter.delete('/:id', remove)
