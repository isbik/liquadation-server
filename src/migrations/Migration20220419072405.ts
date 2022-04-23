import { Migration } from '@mikro-orm/migrations';

export class Migration20220419072405 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_avatar" ("user_id" int not null, "cloud_file_id" int not null);');
    this.addSql('alter table "user_avatar" add constraint "user_avatar_pkey" primary key ("user_id", "cloud_file_id");');

    this.addSql('create table "product_viewers" ("product_id" int not null, "user_id" int not null);');
    this.addSql('alter table "product_viewers" add constraint "product_viewers_pkey" primary key ("product_id", "user_id");');

    this.addSql('alter table "user_avatar" add constraint "user_avatar_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_avatar" add constraint "user_avatar_cloud_file_id_foreign" foreign key ("cloud_file_id") references "cloud_file" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product_viewers" add constraint "product_viewers_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "product_viewers" add constraint "product_viewers_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "contact_application" drop constraint if exists "contact_application_phone_check";');
    this.addSql('alter table "contact_application" alter column "phone" type varchar(255) using ("phone"::varchar(255));');
    this.addSql('alter table "contact_application" alter column "phone" drop not null;');
    this.addSql('alter table "contact_application" drop constraint if exists "contact_application_fio_check";');
    this.addSql('alter table "contact_application" alter column "fio" type varchar(255) using ("fio"::varchar(255));');
    this.addSql('alter table "contact_application" alter column "fio" drop not null;');

    this.addSql('alter table "product" drop constraint if exists "product_supplier_check";');
    this.addSql('alter table "product" alter column "supplier" type text using ("supplier"::text);');
    this.addSql('alter table "product" add constraint "product_supplier_check" check ("supplier" in (\'owner\', \'customer\'));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_avatar" cascade;');

    this.addSql('drop table if exists "product_viewers" cascade;');

    this.addSql('alter table "contact_application" drop constraint if exists "contact_application_phone_check";');
    this.addSql('alter table "contact_application" alter column "phone" type varchar(255) using ("phone"::varchar(255));');
    this.addSql('alter table "contact_application" alter column "phone" set not null;');
    this.addSql('alter table "contact_application" drop constraint if exists "contact_application_fio_check";');
    this.addSql('alter table "contact_application" alter column "fio" type varchar(255) using ("fio"::varchar(255));');
    this.addSql('alter table "contact_application" alter column "fio" set not null;');

    this.addSql('alter table "product" drop constraint if exists "product_supplier_check";');
    this.addSql('alter table "product" alter column "supplier" type text using ("supplier"::text);');
    this.addSql('alter table "product" add constraint "product_supplier_check" check ("supplier" in (\'owner\', \'tone\'));');
  }

}
