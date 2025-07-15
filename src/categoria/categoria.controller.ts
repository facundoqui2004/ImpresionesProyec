import { Request, Response } from 'express'
import { Categoria } from './categoria.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeCategoriaInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    cantidad: req.body.cantidad,
    total: req.body.total,
    imagen: req.body.imagen,
  }

  // Remove undefined values
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const categorias = await em.find(Categoria, {}, { populate: ['productos'] })
    res.status(200).json({ 
      message: 'Categorías encontradas exitosamente', 
      data: categorias,
      count: categorias.length 
    })
  } catch (error: any) {
    console.error('Error al obtener categorías:', error)
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

    const categoria = await em.findOneOrFail(Categoria, { id }, { populate: ['productos'] })
    res.status(200).json({ 
      message: 'Categoría encontrada', 
      data: categoria 
    })
  } catch (error: any) {
    console.error('Error al obtener categoría:', error)
    if (error.name === 'NotFoundError') {
      res.status(404).json({ 
        message: 'Categoría no encontrada' 
      })
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor', 
        error: error.message 
      })
    }
  }
}

async function add(req: Request, res: Response) {
  try {
    // Validar campos requeridos
    if (!req.body.sanitizedInput.nombre) {
      return res.status(400).json({ 
        message: 'El nombre de la categoría es requerido' 
      })
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategoria = await em.findOne(Categoria, { nombre: req.body.sanitizedInput.nombre })
    if (existingCategoria) {
      return res.status(409).json({ 
        message: 'Ya existe una categoría con ese nombre' 
      })
    }

    const categoria = em.create(Categoria, req.body.sanitizedInput)
    await em.flush()
    
    res.status(201).json({ 
      message: 'Categoría creada exitosamente', 
      data: categoria 
    })
  } catch (error: any) {
    console.error('Error al crear categoría:', error)
    res.status(500).json({ 
      message: 'Error interno del servidor', 
      error: error.message 
    })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        message: 'ID inválido. Debe ser un número.' 
      })
    }

    // Verificar si existe otra categoría con el mismo nombre (si se está cambiando el nombre)
    if (req.body.sanitizedInput.nombre) {
      const existingCategoria = await em.findOne(Categoria, { 
        nombre: req.body.sanitizedInput.nombre,
        id: { $ne: id } // Excluir la categoría actual
      })
      
      if (existingCategoria) {
        return res.status(409).json({ 
          message: 'Ya existe otra categoría con ese nombre' 
        })
      }
    }

    const categoriaToUpdate = await em.findOneOrFail(Categoria, { id })
    em.assign(categoriaToUpdate, req.body.sanitizedInput)
    await em.flush()
    
    res.status(200).json({ 
      message: 'Categoría actualizada exitosamente', 
      data: categoriaToUpdate 
    })
  } catch (error: any) {
    console.error('Error al actualizar categoría:', error)
    if (error.name === 'NotFoundError') {
      res.status(404).json({ 
        message: 'Categoría no encontrada' 
      })
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor', 
        error: error.message 
      })
    }
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

    // Verificar si la categoría existe y si tiene productos asociados
    const categoria = await em.findOneOrFail(Categoria, { id }, { populate: ['productos'] })
    
    if (categoria.productos.length > 0) {
      return res.status(409).json({ 
        message: 'No se puede eliminar la categoría porque tiene productos asociados',
        productCount: categoria.productos.length
      })
    }

    await em.removeAndFlush(categoria)
    
    res.status(200).json({ 
      message: 'Categoría eliminada exitosamente' 
    })
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error)
    if (error.name === 'NotFoundError') {
      res.status(404).json({ 
        message: 'Categoría no encontrada' 
      })
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor', 
        error: error.message 
      })
    }
  }
}

// Método para buscar categorías por nombre
async function findByName(req: Request, res: Response) {
  try {
    const { nombre } = req.query
    
    if (!nombre) {
      return res.status(400).json({ 
        message: 'El parámetro "nombre" es requerido' 
      })
    }

    const categorias = await em.find(Categoria, {
      nombre: { $like: `%${nombre}%` }
    }, { populate: ['productos'] })

    res.status(200).json({
      message: 'Búsqueda completada',
      data: categorias,
      count: categorias.length
    })
  } catch (error: any) {
    console.error('Error al buscar categorías:', error)
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    })
  }
}

// Método para obtener estadísticas de categorías
async function getStats(req: Request, res: Response) {
  try {
    const totalCategorias = await em.count(Categoria)
    
    // Obtener todas las categorías con sus productos para calcular estadísticas
    const categorias = await em.find(Categoria, {}, { populate: ['productos'] })
    
    const categoriasConProductos = categorias.filter(cat => cat.productos.length > 0).length
    
    let categoriaConMasProductos = null
    if (categorias.length > 0) {
      const categoriaTop = categorias.reduce((prev, current) => 
        (prev.productos.length > current.productos.length) ? prev : current
      )
      
      if (categoriaTop.productos.length > 0) {
        categoriaConMasProductos = {
          nombre: categoriaTop.nombre,
          cantidadProductos: categoriaTop.productos.length
        }
      }
    }

    res.status(200).json({
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        totalCategorias,
        categoriasConProductos,
        categoriasSinProductos: totalCategorias - categoriasConProductos,
        categoriaConMasProductos
      }
    })
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    })
  }
}

export {
  sanitizeCategoriaInput,
  findAll,
  findOne,
  findByName,
  getStats,
  add,
  update,
  remove
}
