import { Migration } from '@mikro-orm/migrations';

export class Migration20220407174044 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "organization_name" varchar(255) not null, "inn" varchar(255) not null, "kpp" varchar(255) not null default null, "orgn" varchar(255) not null, "city" varchar(255) not null, "fact_address" varchar(255) not null, "legal_address" varchar(255) not null, "postal_code" varchar(255) not null, "phone" varchar(255) not null, "email" varchar(255) not null, "fio" varchar(255) not null, "position" varchar(255) not null, "director_phone" varchar(255) not null, "director_email" varchar(255) not null, "email_status" text check ("email_status" in (\'active\', \'blocked\', \'verification\')) not null, "password" varchar(255) not null, "role" text check ("role" in (\'user\', \'admin\')) not null default \'user\');');

    this.addSql('create table "contact_application" ("id" serial primary key, "email" varchar(255) not null, "phone" varchar(255) not null, "fio" varchar(255) not null, "comment" varchar(255) not null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "cloud_file" ("id" serial primary key, "filename" varchar(255) not null, "url" varchar(255) not null, "mimetype" varchar(255) not null, "key" varchar(255) not null, "owner_id" int not null, "active" boolean not null default false);');

    this.addSql('create table "category" ("id" serial primary key, "name" varchar(255) not null, "image_id" int null, "parent_category_id" int null);');

    this.addSql('create table "product" ("id" serial primary key, "name" varchar(255) not null, "short_description" varchar(255) not null, "description" varchar(255) not null, "category_id" int not null, "sub_category_id" int not null, "owner_id" int not null, "seller" varchar(255) not null, "condition" text check ("condition" in (\'new\', \'as_new\', \'good\', \'acceptable\', \'bad\')) not null, "price" int not null, "currency" varchar(255) not null, "min_rate" int not null, "recommended_retail_price" int not null, "quantity" int not null, "total_weight" int not null, "unit_type" text check ("unit_type" in (\'kg\', \'tone\')) not null, "location" varchar(255) not null, "manifesto_id" int null, "supplier" text check ("supplier" in (\'owner\', \'tone\')) not null, "auction_type" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "product" add constraint "product_manifesto_id_unique" unique ("manifesto_id");');

    this.addSql('create table "product_images" ("product_id" int not null, "cloud_file_id" int not null);');
    this.addSql('alter table "product_images" add constraint "product_images_pkey" primary key ("product_id", "cloud_file_id");');

    this.addSql('alter table "cloud_file" add constraint "cloud_file_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "category" add constraint "category_image_id_foreign" foreign key ("image_id") references "cloud_file" ("id") on update cascade on delete set null;');
    this.addSql('alter table "category" add constraint "category_parent_category_id_foreign" foreign key ("parent_category_id") references "category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product" add constraint "product_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_sub_category_id_foreign" foreign key ("sub_category_id") references "category" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_manifesto_id_foreign" foreign key ("manifesto_id") references "cloud_file" ("id") on update cascade on delete set null;');

    this.addSql('alter table "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "product_images" add constraint "product_images_cloud_file_id_foreign" foreign key ("cloud_file_id") references "cloud_file" ("id") on update cascade on delete cascade;');
  }

}