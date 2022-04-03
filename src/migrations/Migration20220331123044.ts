import { Migration } from '@mikro-orm/migrations';

export class Migration20220331123044 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "cloud_file" add column "owner_id" int not null, add column "active" boolean not null default false;');
    this.addSql('alter table "cloud_file" add constraint "cloud_file_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "cloud_file" add constraint "cloud_file_owner_id_unique" unique ("owner_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cloud_file" drop constraint "cloud_file_owner_id_foreign";');

    this.addSql('alter table "cloud_file" drop constraint "cloud_file_owner_id_unique";');
    this.addSql('alter table "cloud_file" drop column "owner_id";');
    this.addSql('alter table "cloud_file" drop column "active";');
  }

}
