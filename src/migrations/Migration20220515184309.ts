import { Migration } from '@mikro-orm/migrations';

export class Migration20220515184309 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "user_avatar" cascade;');

    this.addSql('alter table "user" add column "avatar_id" int null;');
    this.addSql('alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "cloud_file" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('create table "user_avatar" ("user_id" int not null, "cloud_file_id" int not null);');
    this.addSql('alter table "user_avatar" add constraint "user_avatar_pkey" primary key ("user_id", "cloud_file_id");');

    this.addSql('alter table "user_avatar" add constraint "user_avatar_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_avatar" add constraint "user_avatar_cloud_file_id_foreign" foreign key ("cloud_file_id") references "cloud_file" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user" drop constraint "user_avatar_id_foreign";');

    this.addSql('alter table "user" drop column "avatar_id";');
  }

}
