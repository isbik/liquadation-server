import { Migration } from '@mikro-orm/migrations';

export class Migration20220403203110 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "category_image" cascade;');

    this.addSql('drop table if exists "category_parent_category" cascade;');

    this.addSql('alter table "category" add column "image_id" int null, add column "parent_category_id" int null;');
    this.addSql('alter table "category" add constraint "category_image_id_foreign" foreign key ("image_id") references "cloud_file" ("id") on update cascade on delete set null;');
    this.addSql('alter table "category" add constraint "category_parent_category_id_foreign" foreign key ("parent_category_id") references "category" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('create table "category_image" ("category_id" int not null, "cloud_file_id" int not null);');
    this.addSql('alter table "category_image" add constraint "category_image_pkey" primary key ("category_id", "cloud_file_id");');

    this.addSql('create table "category_parent_category" ("category_1_id" int not null, "category_2_id" int not null);');
    this.addSql('alter table "category_parent_category" add constraint "category_parent_category_pkey" primary key ("category_1_id", "category_2_id");');

    this.addSql('alter table "category_image" add constraint "category_image_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "category_image" add constraint "category_image_cloud_file_id_foreign" foreign key ("cloud_file_id") references "cloud_file" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "category_parent_category" add constraint "category_parent_category_category_1_id_foreign" foreign key ("category_1_id") references "category" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "category_parent_category" add constraint "category_parent_category_category_2_id_foreign" foreign key ("category_2_id") references "category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "category" drop constraint "category_image_id_foreign";');
    this.addSql('alter table "category" drop constraint "category_parent_category_id_foreign";');

    this.addSql('alter table "category" drop column "image_id";');
    this.addSql('alter table "category" drop column "parent_category_id";');
  }

}
