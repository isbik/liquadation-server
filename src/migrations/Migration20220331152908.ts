import { Migration } from '@mikro-orm/migrations';

export class Migration20220331152908 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_images_id_foreign";');
    this.addSql('alter table "product" drop constraint "product_manifesto_id_foreign";');

    this.addSql('alter table "product" drop constraint if exists "product_currency_check";');
    this.addSql('alter table "product" alter column "currency" drop default;');
    this.addSql('alter table "product" alter column "currency" type varchar(255) using ("currency"::varchar(255));');
    this.addSql('alter table "product" drop constraint if exists "product_images_id_check";');
    this.addSql('alter table "product" alter column "images_id" type int using ("images_id"::int);');
    this.addSql('alter table "product" alter column "images_id" drop not null;');
    this.addSql('alter table "product" drop constraint if exists "product_manifesto_id_check";');
    this.addSql('alter table "product" alter column "manifesto_id" type int using ("manifesto_id"::int);');
    this.addSql('alter table "product" alter column "manifesto_id" drop not null;');
    this.addSql('alter table "product" drop constraint if exists "product_auction_type_check";');
    this.addSql('alter table "product" alter column "auction_type" drop default;');
    this.addSql('alter table "product" alter column "auction_type" type varchar(255) using ("auction_type"::varchar(255));');
    this.addSql('alter table "product" add constraint "product_images_id_foreign" foreign key ("images_id") references "cloud_file" ("id") on update cascade on delete set null;');
    this.addSql('alter table "product" add constraint "product_manifesto_id_foreign" foreign key ("manifesto_id") references "cloud_file" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_images_id_foreign";');
    this.addSql('alter table "product" drop constraint "product_manifesto_id_foreign";');

    this.addSql('alter table "product" drop constraint if exists "product_currency_check";');
    this.addSql('alter table "product" alter column "currency" type varchar(255) using ("currency"::varchar(255));');
    this.addSql('alter table "product" alter column "currency" set default \'RUB\';');
    this.addSql('alter table "product" drop constraint if exists "product_images_id_check";');
    this.addSql('alter table "product" alter column "images_id" type int using ("images_id"::int);');
    this.addSql('alter table "product" alter column "images_id" set not null;');
    this.addSql('alter table "product" drop constraint if exists "product_manifesto_id_check";');
    this.addSql('alter table "product" alter column "manifesto_id" type int using ("manifesto_id"::int);');
    this.addSql('alter table "product" alter column "manifesto_id" set not null;');
    this.addSql('alter table "product" drop constraint if exists "product_auction_type_check";');
    this.addSql('alter table "product" alter column "auction_type" type varchar(255) using ("auction_type"::varchar(255));');
    this.addSql('alter table "product" alter column "auction_type" set default \'standard\';');
    this.addSql('alter table "product" add constraint "product_images_id_foreign" foreign key ("images_id") references "cloud_file" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_manifesto_id_foreign" foreign key ("manifesto_id") references "cloud_file" ("id") on update cascade;');
  }

}
