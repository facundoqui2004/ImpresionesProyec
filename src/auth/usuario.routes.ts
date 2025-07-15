import express from 'express'
import { 
  register, 
  login, 
  logout, 
  me,
  authMiddleware,
  sanitizeUsuarioInput,
  findAll,
  findOne,
  update,
  remove
} from './usuario.controller.js'

const router = express.Router()

// Rutas de autenticación
router.post('/register', sanitizeUsuarioInput, register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', me)

// Rutas CRUD (requieren autenticación)
router.get('/', authMiddleware, findAll)
router.get('/:id', authMiddleware, findOne)
router.put('/:id', authMiddleware, sanitizeUsuarioInput, update)
router.delete('/:id', authMiddleware, remove)

export default router
