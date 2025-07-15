import { Request, Response } from 'express'
import { Cliente } from './cliente.entity.js'
import { Usuario } from '../auth/usuario.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeClienteInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    dni: req.body.dni,
    tipoDni: req.body.tipoDni,
    usuario: req.body.usuario,
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
    const clientes = await em.find(Cliente, {}, { populate: ['usuario', 'pedidos'] })
    res.status(200).json({ message: 'found all clientes', data: clientes })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = await em.findOneOrFail(Cliente, { id }, { populate: ['usuario', 'pedidos'] })
    res.status(200).json({ message: 'found cliente', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuarioId = req.body.sanitizedInput.usuario
    const usuario = await em.findOneOrFail(Usuario, { id: usuarioId })
    
    const clienteData = { ...req.body.sanitizedInput, usuario }
    const cliente = em.create(Cliente, clienteData)
    await em.flush()
    res.status(201).json({ message: 'cliente created', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const clienteToUpdate = await em.findOneOrFail(Cliente, { id })
    
    if (req.body.sanitizedInput.usuario) {
      const usuario = await em.findOneOrFail(Usuario, { id: req.body.sanitizedInput.usuario })
      req.body.sanitizedInput.usuario = usuario
    }
    
    em.assign(clienteToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'cliente updated', data: clienteToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = em.getReference(Cliente, id)
    await em.removeAndFlush(cliente)
    res.status(200).json({ message: 'cliente deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeClienteInput,
  findAll,
  findOne,
  add,
  update,
  remove
}
