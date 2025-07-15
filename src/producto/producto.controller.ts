import { Request, Response } from 'express'
import { Producto } from './producto.entity.js'
import { Categoria } from '../categoria/categoria.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeProductoInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    cantidadStock: req.body.cantidadStock,
    imagen: req.body.imagen,
    duracion: req.body.duracion,
    precioVenta: req.body.precioVenta,
    comprobante: req.body.comprobante,
    categoria: req.body.categoria,
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
    const productos = await em.find(Producto, {}, { populate: ['categoria'] })
    res.status(200).json({ 
      message: 'Productos encontrados exitosamente', 
      data: productos,
      count: productos.length 
    })
  } catch (error: any) {
    console.error('Error al obtener productos:', error)
    res.status(500).json({ 
      message: 'Error interno del servidor', 
      error: error.message 
    })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        message: 'ID inválido. Debe ser un número.' 
      })
    }

    const producto = await em.findOneOrFail(Producto, { id }, { populate: ['categoria', 'precios'] })
    res.status(200).json({ 
      message: 'Producto encontrado', 
      data: producto 
    })
  } catch (error: any) {
    console.error('Error al obtener producto:', error)
    if (error.name === 'NotFoundError') {
      res.status(404).json({ 
        message: 'Producto no encontrado' 
      })
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor', 
        error: error.message 
      })
    }
  }
}

async function findByCategoria(req: Request, res: Response) {
  try {
    const categoriaId = Number.parseInt(req.params.categoriaId)
    const categoria = await em.findOneOrFail(Categoria, { id: categoriaId })
    const productos = await em.find(Producto, { categoria }, { populate: ['categoria'] })
    res.status(200).json({ message: 'found productos by categoria', data: productos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const categoriaId = req.body.sanitizedInput.categoria
    const categoria = await em.findOneOrFail(Categoria, { id: categoriaId })
    
    const productoData = { ...req.body.sanitizedInput, categoria }
    const producto = em.create(Producto, productoData)
    await em.flush()
    res.status(201).json({ message: 'producto created', data: producto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const productoToUpdate = await em.findOneOrFail(Producto, { id })
    
    if (req.body.sanitizedInput.categoria) {
      const categoria = await em.findOneOrFail(Categoria, { id: req.body.sanitizedInput.categoria })
      req.body.sanitizedInput.categoria = categoria
    }
    
    em.assign(productoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'producto updated', data: productoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        message: 'ID inválido. Debe ser un número.' 
      })
    }

    const producto = await em.findOneOrFail(Producto, { id })
    await em.removeAndFlush(producto)
    
    res.status(200).json({ 
      message: 'Producto eliminado exitosamente' 
    })
  } catch (error: any) {
    console.error('Error al eliminar producto:', error)
    if (error.name === 'NotFoundError') {
      res.status(404).json({ 
        message: 'Producto no encontrado' 
      })
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor', 
        error: error.message 
      })
    }
  }
}

// Método para buscar productos por nombre
async function findByName(req: Request, res: Response) {
  try {
    const { nombre } = req.query
    
    if (!nombre) {
      return res.status(400).json({ 
        message: 'El parámetro "nombre" es requerido' 
      })
    }

    const productos = await em.find(Producto, {
      nombre: { $like: `%${nombre}%` }
    }, { populate: ['categoria'] })

    res.status(200).json({
      message: 'Búsqueda completada',
      data: productos,
      count: productos.length
    })
  } catch (error: any) {
    console.error('Error al buscar productos:', error)
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    })
  }
}

// Método para obtener productos con stock bajo
async function findLowStock(req: Request, res: Response) {
  try {
    const limite = Number(req.query.limite) || 5
    
    const productos = await em.find(Producto, {
      cantidadStock: { $lte: limite }
    }, { 
      populate: ['categoria'],
      orderBy: { cantidadStock: 'ASC' }
    })

    res.status(200).json({
      message: `Productos con stock menor o igual a ${limite}`,
      data: productos,
      count: productos.length
    })
  } catch (error: any) {
    console.error('Error al obtener productos con stock bajo:', error)
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    })
  }
}

export {
  sanitizeProductoInput,
  findAll,
  findOne,
  findByCategoria,
  findByName,
  findLowStock,
  add,
  update,
  remove
}
