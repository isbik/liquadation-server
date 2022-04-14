import { CloudFile } from '@/domains/cloud-storage/entities/cloud-file.entity';
import { Product } from '@/domains/products/entities/product.entity';
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

export enum UserEmailStatus {
  active = 'active',
  blocked = 'blocked',
  verification = 'verification',
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  organizationName: string;

  @Property()
  INN: string;

  @Property({ default: null })
  KPP: string;

  @Property()
  ORGN: string;

  @Property()
  city: string;

  @Property()
  factAddress: string;

  @Property()
  legalAddress: string;

  @Property()
  postalCode: string;

  @Property()
  phone: string;

  @Property()
  email: string;

  @Property()
  fio: string;

  @Property()
  position: string;

  @Property()
  directorPhone: string;

  @Property()
  directorEmail: string;

  @Enum(() => UserEmailStatus)
  emailStatus: UserEmailStatus;

  @Property({ hidden: true })
  password: string;

  @Enum({ default: UserRole.user })
  role: UserRole;

  @ManyToMany()
  favouriteProducts = new Collection<Product>(this);

  @ManyToMany()
  favouriteOrganizations = new Collection<User>(this);

  @ManyToMany({ nullable: true })
  avatar: CloudFile;
}
