import {
  User,
  UserEmailStatus,
  UserRole,
} from '@/domains/users/entities/user.entity';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const admin = em.create(User, {
      organizationName: '',
      INN: '',
      ORGN: '',
      KPP: '',
      city: '',
      factAddress: '',
      legalAddress: '',
      postalCode: '',
      phone: '',
      email: 'admin@gmail.com',
      fio: '',
      position: '',
      directorPhone: '',
      directorEmail: '',
      emailStatus: UserEmailStatus.active,
      password: bcrypt.hashSync('password', 10),
      role: UserRole.admin,
    });
  }
}
