import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

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

  @Property()
  password: string;

  @Enum({ default: UserRole.user })
  role: UserRole;
}
