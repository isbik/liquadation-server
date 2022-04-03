import { Migration } from '@mikro-orm/migrations';

export class Migration20220331123258 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "cloud_file" drop constraint "cloud_file_owner_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cloud_file" add constraint "cloud_file_owner_id_unique" unique ("owner_id");');
  }

}
