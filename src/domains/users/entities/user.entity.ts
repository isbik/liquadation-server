import { CloudFile } from '@/domains/cloud-storage/entities/cloud-file.entity';
import { Product } from '@/domains/products/entities/product.entity';
import {
  Collection,
  Embedded,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserSettings } from './user-settings.entity';

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

  @ManyToOne({ nullable: true })
  avatar: CloudFile;

  @Property({ nullable: true, default: null })
  partnerCode: string;

  @ManyToMany()
  views = new Collection<User>(this);

  @Embedded({ nullable: true })
  settings: UserSettings;

  @ManyToMany()
  cartProducts = new Collection<Product>(this);
}
