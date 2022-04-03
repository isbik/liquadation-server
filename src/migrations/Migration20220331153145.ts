import { Migration } from '@mikro-orm/migrations';

export class Migration20220331153145 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_images" ("product_id" int not null, "cloud_file_id" int not null);');
    this.addSql('alter table "product_images" add constraint "product_images_pkey" primary key ("product_id", "cloud_file_id");');

    this.addSql('alter table "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "product_images" add constraint "product_images_cloud_file_id_foreign" foreign key ("cloud_file_id") references "cloud_file" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product" drop constraint "product_images_id_foreign";');

    this.addSql('alter table "product" drop column "images_id";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "product_images" cascade;');

    this.addSql('alter table "product" add column "images_id" int null;');
    this.addSql('alter table "product" add constraint "product_images_id_foreign" foreign key ("images_id") references "cloud_file" ("id") on update cascade on delete set null;');
  }

}
