import { Migration } from '@mikro-orm/migrations';

export class Migration20220408191523 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_favourite_organizations" ("user_1_id" int not null, "user_2_id" int not null);');
    this.addSql('alter table "user_favourite_organizations" add constraint "user_favourite_organizations_pkey" primary key ("user_1_id", "user_2_id");');

    this.addSql('create table "user_favourite_products" ("user_id" int not null, "product_id" int not null);');
    this.addSql('alter table "user_favourite_products" add constraint "user_favourite_products_pkey" primary key ("user_id", "product_id");');

    this.addSql('alter table "user_favourite_organizations" add constraint "user_favourite_organizations_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favourite_organizations" add constraint "user_favourite_organizations_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_favourite_products" add constraint "user_favourite_products_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favourite_products" add constraint "user_favourite_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_favourite_organizations" cascade;');

    this.addSql('drop table if exists "user_favourite_products" cascade;');
  }

}
