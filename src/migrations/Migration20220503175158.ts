import { Migration } from '@mikro-orm/migrations';

export class Migration20220503175158 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order" ("id" serial primary key, "delivery_method" text check ("delivery_method" in (\'SDEK\', \'RUSSIA_POST\', \'PERSONAL_COURIER\', \'PICKUP\')) not null, "delivery_size" text check ("delivery_size" in (\'BOX\', \'PALLET\', \'PALLET_SMALL\', \'EUROPALLET\', \'TRUCK_1_5\', \'TRUCK_3_5\', \'TRUCK_5\', \'TRUCK_10\', \'EUROFURA\', \'CONTAINER_22\', \'CONTAINER_26\', \'CONTAINER_30\')) not null, "city" varchar(255) not null, "street" varchar(255) not null, "apartment" varchar(255) not null, "postal_code" varchar(255) not null, "fio" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null);');

    this.addSql('create table "order_products" ("order_id" int not null, "product_id" int not null);');
    this.addSql('alter table "order_products" add constraint "order_products_pkey" primary key ("order_id", "product_id");');

    this.addSql('alter table "order_products" add constraint "order_products_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "order_products" add constraint "order_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product" drop column "supplier";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order_products" drop constraint "order_products_order_id_foreign";');

    this.addSql('drop table if exists "order" cascade;');

    this.addSql('drop table if exists "order_products" cascade;');

    this.addSql('alter table "product" add column "supplier" text check ("supplier" in (\'owner\', \'customer\')) not null;');
  }

}
