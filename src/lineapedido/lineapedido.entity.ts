import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKeyType,
} from '@mikro-orm/core'

@Entity()
export class LineaPedido {
  @ManyToOne(() => 'Pedido', { primary: true })
  pedido!: any

  @ManyToOne(() => 'Producto', { primary: true })
  producto!: any

  @Property({ nullable: false })
  cantidad!: number

  [PrimaryKeyType]?: [number, number]
}
