import { Request, Response } from 'express'
import { Provincia } from './provincia.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeProvinciaInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    codProv: req.body.codProv,
    nombreProv: req.body.nombreProv,
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
    const provincias = await em.find(Provincia, {}, { populate: ['localidades'] })
    res.status(200).json({ message: 'found all provincias', data: provincias })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const codProv = req.params.codProv
    const provincia = await em.findOneOrFail(Provincia, { codProv }, { populate: ['localidades'] })
    res.status(200).json({ message: 'found provincia', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const provincia = em.create(Provincia, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'provincia created', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const codProv = req.params.codProv
    const provinciaToUpdate = await em.findOneOrFail(Provincia, { codProv })
    em.assign(provinciaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'provincia updated', data: provinciaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const codProv = req.params.codProv
    const provincia = await em.findOneOrFail(Provincia, { codProv })
    await em.removeAndFlush(provincia)
    res.status(200).json({ message: 'provincia deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeProvinciaInput,
  findAll,
  findOne,
  add,
  update,
  remove
}
