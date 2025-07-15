import {
  Entity,
  Property,
  OneToOne,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Usuario extends BaseEntity {
  @Property({ unique: true, nullable: false })
  usuario!: string

  @Property({ unique: true, nullable: false })
  email!: string

  @Property({ nullable: false })
  contraseña!: string

  @Property({ nullable: false })
  rol!: string

  @Property({ default: 'activo' })
  estado!: string

  @OneToOne(() => 'Cliente', 'usuario', { nullable: true })
  cliente?: any
}