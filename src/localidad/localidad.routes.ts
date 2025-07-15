import { Router } from 'express'
import { sanitizeLocalidadInput, findAll, findOne, findByProvincia, add, update, remove } from './localidad.controller.js'

export const localidadRouter = Router()

localidadRouter.get('/', findAll)
localidadRouter.get('/:codPostal', findOne)
localidadRouter.get('/provincia/:codProv', findByProvincia)
localidadRouter.post('/', sanitizeLocalidadInput, add)
localidadRouter.put('/:codPostal', sanitizeLocalidadInput, update)
localidadRouter.patch('/:codPostal', sanitizeLocalidadInput, update)
localidadRouter.delete('/:codPostal', remove)
