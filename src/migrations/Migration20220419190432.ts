import { Migration } from '@mikro-orm/migrations';

export class Migration20220419190432 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" add column "status" text check ("status" in (\'draft\', \'active\', \'waiting\', \'sold\')) null default \'active\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop column "status";');
  }

}
