import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Pedido extends BaseEntity {
  @Property({ nullable: false })
  estadoPedido!: string

  @Property({ nullable: false })
  fechaPedido!: Date

  @Property({ nullable: false })
  formaPago!: string

  @Property({ nullable: false })
  direccionEntrega!: string

  @ManyToOne(() => 'Cliente', { nullable: false })
  cliente!: any

  @OneToMany(() => 'LineaPedido', 'pedido')
  lineasPedido = new Collection<any>(this)
}
