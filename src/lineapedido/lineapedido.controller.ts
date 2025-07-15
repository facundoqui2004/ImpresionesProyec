import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/db/orm.js'
import { LineaPedido } from './lineapedido.entity.js'

const em = orm.em

function sanitizeLineaPedidoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    pedidoId: req.body.pedidoId,
    productoId: req.body.productoId,
    cantidad: req.body.cantidad,
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
    const lineasPedido = await em.find(
      LineaPedido, 
      {}, 
      { 
        populate: ['pedido', 'producto', 'producto.categoria'],
        orderBy: { pedido: 'ASC', producto: 'ASC' }
      }
    )
    res.status(200).json({ 
      message: 'Líneas de pedido encontradas', 
      data: lineasPedido,
      count: lineasPedido.length 
    })
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error al buscar líneas de pedido', 
      error: error.message 
    })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const { pedidoId, productoId } = req.params
    const lineaPedido = await em.findOne(
      LineaPedido, 
      { 
        pedido: Number(pedidoId), 
        producto: Number(productoId) 
      },
      { populate: ['pedido', 'producto', 'producto.categoria'] }
    )
    
    if (!lineaPedido) {
      return res.status(404).json({ 
        message: 'Línea de pedido no encontrada' 
      })
    }
    
    res.status(200).json({ 
      message: 'Línea de pedido encontrada', 
      data: lineaPedido 
    })
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error al buscar línea de pedido', 
      error: error.message 
    })
  }
}

async function findByPedido(req: Request, res: Response) {
  try {
    const { pedidoId } = req.params
    const lineasPedido = await em.find(
      LineaPedido, 
      { pedido: Number(pedidoId) },
      { 
        populate: ['producto', 'producto.categoria'],
        orderBy: { producto: 'ASC' }
      }
    )
    
    res.status(200).json({ 
      message: 'Líneas del pedido encontradas', 
      data: lineasPedido,
      count: lineasPedido.length 
    })
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error al buscar líneas del pedido', 
      error: error.message 
    })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { pedidoId, productoId, cantidad } = req.body.sanitizedInput

    // Importar entidades dinámicamente
    const { Pedido } = await import('../pedido/pedido.entity.js')
    const { Producto } = await import('../producto/producto.entity.js')

    // Verificar que el pedido existe
    const pedido = await em.findOne(Pedido, pedidoId)
    if (!pedido) {
      return res.status(404).json({ 
        message: 'Pedido no encontrado' 
      })
    }

    // Verificar que el producto existe
    const producto = await em.findOne(Producto, productoId)
    if (!producto) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      })
    }

    // Verificar que no existe ya esta línea de pedido
    const lineaExistente = await em.findOne(LineaPedido, {
      pedido: pedidoId,
      producto: productoId
    })
    
    if (lineaExistente) {
      return res.status(409).json({ 
        message: 'Esta línea de pedido ya existe. Use PUT para actualizar la cantidad.' 
      })
    }

    // Verificar stock disponible
    if (producto.cantidadStock < cantidad) {
      return res.status(400).json({ 
        message: `Stock insuficiente. Disponible: ${producto.cantidadStock}, Solicitado: ${cantidad}` 
      })
    }

    const lineaPedido = em.create(LineaPedido, {
      pedido,
      producto,
      cantidad
    })

    await em.flush()
    res.status(201).json({ 
      message: 'Línea de pedido creada exitosamente', 
      data: lineaPedido 
    })
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error al crear línea de pedido', 
      error: error.message 
    })
  }
}

async function update(req: Request, res: Response) {
  try {
    const { pedidoId, productoId } = req.params
    const { cantidad } = req.body.sanitizedInput

    const lineaPedido = await em.findOne(
      LineaPedido, 
      { 
        pedido: Number(pedidoId), 
        producto: Number(productoId) 
      },
      { populate: ['producto'] }
    )
    
    if (!lineaPedido) {
      return res.status(404).json({ 
        message: 'Línea de pedido no encontrada' 
      })
    }

    // Verificar stock disponible si se aumenta la cantidad
    if (cantidad > lineaPedido.cantidad) {
      const diferencia = cantidad - lineaPedido.cantidad
      if (lineaPedido.producto.cantidadStock < diferencia) {
        return res.status(400).json({ 
          message: `Stock insuficiente. Disponible: ${lineaPedido.producto.cantidadStock}, Necesario: ${diferencia}` 
        })
      }
    }

    em.assign(lineaPedido, { cantidad })
    await em.flush()

    res.status(200).json({ 
      message: 'Línea de pedido actualizada exitosamente', 
      data: lineaPedido 
    })
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error al actualizar línea de pedido', 
      error: error.message 
    })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { pedidoId, productoId } = req.params
    const lineaPedido = await em.findOne(LineaPedido, {
      pedido: Number(pedidoId),
      producto: Number(productoId)
    })
    
    if (!lineaPedido) {
      return res.status(404).json({ 
        message: 'Línea de pedido no encontrada' 
      })
    }

    await em.removeAndFlush(lineaPedido)
    res.status(200).json({ 
      message: 'Línea de pedido eliminada exitosamente' 
    })
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error al eliminar línea de pedido', 
      error: error.message 
    })
  }
}

export { sanitizeLineaPedidoInput, findAll, findOne, findByPedido, add, update, remove }
