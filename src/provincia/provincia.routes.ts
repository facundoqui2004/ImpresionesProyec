import { Router } from 'express'
import { sanitizeProvinciaInput, findAll, findOne, add, update, remove } from './provincia.controller.js'

export const provinciaRouter = Router()

provinciaRouter.get('/', findAll)
provinciaRouter.get('/:codProv', findOne)
provinciaRouter.post('/', sanitizeProvinciaInput, add)
provinciaRouter.put('/:codProv', sanitizeProvinciaInput, update)
provinciaRouter.patch('/:codProv', sanitizeProvinciaInput, update)
provinciaRouter.delete('/:codProv', remove)
