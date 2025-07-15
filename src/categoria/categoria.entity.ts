import {
  Entity,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Categoria extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string

  @Property({ nullable: true })
  descripcion?: string

  @Property({ nullable: false, default: 0 })
  cantidad!: number

  @Property({ nullable: false, default: 0 })
  total!: number

  @Property({ nullable: true })
  imagen?: string

  @OneToMany(() => 'Producto', 'categoria')
  productos = new Collection<any>(this)
}
