import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Producto extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string

  @Property({ nullable: true })
  descripcion?: string

  @Property({ nullable: false, default: 0 })
  cantidadStock!: number

  @Property({ nullable: true })
  imagen?: string

  @Property({ nullable: true })
  duracion?: string

  @Property({ nullable: false })
  precioVenta!: number

  @Property({ nullable: true })
  comprobante?: string

  @ManyToOne(() => 'Categoria', { nullable: false })
  categoria!: any

  @OneToMany(() => 'LineaPedido', 'producto')
  lineasPedido = new Collection<any>(this)

  @OneToMany(() => 'Precio', 'producto')
  precios = new Collection<any>(this)
}
