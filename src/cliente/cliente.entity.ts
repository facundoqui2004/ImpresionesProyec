import {
  Entity,
  Property,
  ManyToOne,
  OneToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Cliente extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Property({ nullable: false })
  apellido!: string

  @Property({ nullable: false, unique: true })
  dni!: string

  @Property({ nullable: false })
  tipoDni!: string

  @OneToOne(() => 'Usuario', { nullable: false })
  usuario!: any

  @OneToMany(() => 'Pedido', 'cliente')
  pedidos = new Collection<any>(this)
}
