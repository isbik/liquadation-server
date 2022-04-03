import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
@Entity()
export class CloudFile {
  @PrimaryKey()
  id: number;

  @Property()
  filename: string;

  @Property()
  url: string;

  @Property()
  mimetype: string;

  @Property()
  key: string;

  @ManyToOne()
  owner: User;

  @Property({ default: false })
  active: boolean;
}
