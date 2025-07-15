import { Request, Response } from 'express'
import { Pedido } from './pedido.entity.js'
import { Cliente } from '../cliente/cliente.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizePedidoInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    estadoPedido: req.body.estadoPedido,
    fechaPedido: req.body.fechaPedido,
    formaPago: req.body.formaPago,
    direccionEntrega: req.body.direccionEntrega,
    cliente: req.body.cliente,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const pedidos = await em.find(Pedido, {}, { populate: ['cliente', 'lineasPedido'] })
    res.status(200).json({ message: 'found all pedidos', data: pedidos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const pedido = await em.findOneOrFail(Pedido, { id }, { populate: ['cliente', 'lineasPedido.producto'] })
    res.status(200).json({ message: 'found pedido', data: pedido })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findByCliente(req: Request, res: Response) {
  try {
    const clienteId = Number.parseInt(req.params.clienteId)
    const cliente = await em.findOneOrFail(Cliente, { id: clienteId })
    const pedidos = await em.find(Pedido, { cliente }, { populate: ['lineasPedido.producto'] })
    res.status(200).json({ message: 'found pedidos by cliente', data: pedidos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const clienteId = req.body.sanitizedInput.cliente
    const cliente = await em.findOneOrFail(Cliente, { id: clienteId })
    
    const pedidoData = { 
      ...req.body.sanitizedInput, 
      cliente,
      fechaPedido: new Date(req.body.sanitizedInput.fechaPedido || Date.now())
    }
    const pedido = em.create(Pedido, pedidoData)
    await em.flush()
    res.status(201).json({ message: 'pedido created', data: pedido })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const pedidoToUpdate = await em.findOneOrFail(Pedido, { id })
    
    if (req.body.sanitizedInput.cliente) {
      const cliente = await em.findOneOrFail(Cliente, { id: req.body.sanitizedInput.cliente })
      req.body.sanitizedInput.cliente = cliente
    }
    
    em.assign(pedidoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'pedido updated', data: pedidoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const pedido = em.getReference(Pedido, id)
    await em.removeAndFlush(pedido)
    res.status(200).json({ message: 'pedido deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizePedidoInput,
  findAll,
  findOne,
  findByCliente,
  add,
  update,
  remove
}
