import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
} from '@mikro-orm/core'

@Entity()
export class Precio {
  @ManyToOne(() => 'Producto', { primary: true })
  producto!: any

  @PrimaryKey()
  fechaModificacion!: Date

  @Property({ nullable: false })
  precio!: number

  @Property({ nullable: true })
  precioKhw?: number

  @Property({ nullable: true })
  ganancia?: number

  [PrimaryKeyType]?: [number, Date]
}
