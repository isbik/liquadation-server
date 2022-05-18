import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { CategoriesSeeder } from './CategoriesSeeder';
import { UsersSeeder } from './UsersSeeder';

export class DatabaseSeeder extends Seeder {
  run(em: EntityManager): Promise<void> {
    return this.call(em, [CategoriesSeeder, UsersSeeder]);
  }
}
