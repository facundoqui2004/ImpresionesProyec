import {
  Entity,
  Property,
  OneToMany,
  Collection,
  PrimaryKey,
} from '@mikro-orm/core'

@Entity()
export class Provincia {
  @PrimaryKey()
  codProv!: string

  @Property({ nullable: false })
  nombreProv!: string

  @OneToMany(() => 'Localidad', 'provincia')
  localidades = new Collection<any>(this)
}
