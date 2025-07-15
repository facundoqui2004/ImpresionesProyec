import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core'

@Entity()
export class Localidad {
  @PrimaryKey()
  codPostal!: string

  @Property({ nullable: false })
  ciudad!: string

  @ManyToOne(() => 'Provincia', { nullable: false })
  provincia!: any
}
