import { Request, Response } from 'express'
import { Usuario } from './usuario.entity.js'
import { Cliente } from '../cliente/cliente.entity.js'
import { orm } from '../shared/db/orm.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const em = orm.em
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_muy_seguro'

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

function sanitizeUsuarioInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    usuario: req.body.usuario,
    email: req.body.email,
    contraseña: req.body.contraseña,
    rol: req.body.rol || 'cliente',
    estado: req.body.estado || 'activo',
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function register(req: Request, res: Response) {
  try {
    const { usuario, email, contraseña, rol = 'cliente' } = req.body.sanitizedInput || req.body

    // Validar que los campos requeridos estén presentes
    if (!usuario || !email || !contraseña) {
      return res.status(400).json({ message: 'Usuario, email y contraseña son requeridos' })
    }

    // Validar longitud de contraseña
    if (contraseña.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    // Verificar que el nombre de usuario sea único
    const existeUsuario = await em.findOne(Usuario, { usuario })
    if (existeUsuario) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' })
    }

    // Verificar que el email sea único
    const existeEmail = await em.findOne(Usuario, { email })
    if (existeEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10)

    // Crear usuario
    const nuevoUsuario = em.create(Usuario, {
      usuario,
      email,
      contraseña: hashedPassword,
      rol,
      estado: 'activo'
    })

    await em.flush()

    // Generar token JWT
    const token = jwt.sign(
      {
        id: nuevoUsuario.id!,
        usuario: nuevoUsuario.usuario,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    })

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    })

  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function login(req: Request, res: Response) {
  try {
    const { usuario, contraseña } = req.body

    if (!usuario || !contraseña) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' })
    }

    // Buscar usuario por nombre de usuario o email
    const usuarioEncontrado = await em.findOne(Usuario, {
      $or: [{ usuario }, { email: usuario }]
    })

    if (!usuarioEncontrado) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const esContraseñaValida = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña)
    if (!esContraseñaValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Verificar si el usuario está activo
    if (usuarioEncontrado.estado !== 'activo') {
      return res.status(401).json({ message: 'Usuario desactivado' })
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuarioEncontrado.id!,
        usuario: usuarioEncontrado.usuario,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    })

    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol
      }
    })

  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function logout(req: Request, res: Response) {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logout exitoso' })
}

async function me(req: Request, res: Response) {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'No autenticado' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const usuarioActual = await em.findOne(Usuario, { id: decoded.id })

    if (!usuarioActual) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({
      user: {
        id: usuarioActual.id,
        usuario: usuarioActual.usuario,
        email: usuarioActual.email,
        rol: usuarioActual.rol
      }
    })

  } catch (error: any) {
    res.status(401).json({ message: 'Token inválido' })
  }
}

// Middleware de autenticación
function authMiddleware(req: Request, res: Response, next: Function) {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'No autenticado' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}

// CRUD functions para administración
async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {}, { populate: ['cliente'] })
    res.status(200).json({ message: 'found all usuarios', data: usuarios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuarioEncontrado = await em.findOneOrFail(Usuario, { id }, { populate: ['cliente'] })
    res.status(200).json({ message: 'found usuario', data: usuarioEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuarioToUpdate = await em.findOneOrFail(Usuario, { id })
    
    // Si se proporciona una nueva contraseña, encriptarla
    if (req.body.sanitizedInput?.contraseña) {
      req.body.sanitizedInput.contraseña = await bcrypt.hash(req.body.sanitizedInput.contraseña, 10)
    }
    
    em.assign(usuarioToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'usuario updated', data: usuarioToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuarioEncontrado = em.getReference(Usuario, id)
    await em.removeAndFlush(usuarioEncontrado)
    res.status(200).json({ message: 'usuario deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeUsuarioInput,
  register,
  login,
  logout,
  me,
  authMiddleware,
  findAll,
  findOne,
  update,
  remove
}
