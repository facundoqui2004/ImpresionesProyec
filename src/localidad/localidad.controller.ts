import { Request, Response } from 'express'
import { Localidad } from './localidad.entity.js'
import { Provincia } from '../provincia/provincia.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeLocalidadInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    codPostal: req.body.codPostal,
    ciudad: req.body.ciudad,
    provincia: req.body.provincia,
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
    const localidades = await em.find(Localidad, {}, { populate: ['provincia'] })
    res.status(200).json({ message: 'found all localidades', data: localidades })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const codPostal = req.params.codPostal
    const localidad = await em.findOneOrFail(Localidad, { codPostal }, { populate: ['provincia'] })
    res.status(200).json({ message: 'found localidad', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findByProvincia(req: Request, res: Response) {
  try {
    const codProv = req.params.codProv
    const provincia = await em.findOneOrFail(Provincia, { codProv })
    const localidades = await em.find(Localidad, { provincia }, { populate: ['provincia'] })
    res.status(200).json({ message: 'found localidades by provincia', data: localidades })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const codProv = req.body.sanitizedInput.provincia
    const provincia = await em.findOneOrFail(Provincia, { codProv })
    
    const localidadData = { ...req.body.sanitizedInput, provincia }
    const localidad = em.create(Localidad, localidadData)
    await em.flush()
    res.status(201).json({ message: 'localidad created', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const codPostal = req.params.codPostal
    const localidadToUpdate = await em.findOneOrFail(Localidad, { codPostal })
    
    if (req.body.sanitizedInput.provincia) {
      const provincia = await em.findOneOrFail(Provincia, { codProv: req.body.sanitizedInput.provincia })
      req.body.sanitizedInput.provincia = provincia
    }
    
    em.assign(localidadToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'localidad updated', data: localidadToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const codPostal = req.params.codPostal
    const localidad = await em.findOneOrFail(Localidad, { codPostal })
    await em.removeAndFlush(localidad)
    res.status(200).json({ message: 'localidad deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeLocalidadInput,
  findAll,
  findOne,
  findByProvincia,
  add,
  update,
  remove
}
