import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ContactApplication {
  @PrimaryKey()
  id: number;

  @Property()
  email: string;

  @Property({ nullable: true })
  phone: string;

  @Property({ nullable: true })
  fio: string;

  @Property()
  comment: string;

  @Property()
  createdAt = new Date();
}
