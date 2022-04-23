import { Migration } from '@mikro-orm/migrations';

export class Migration20220422110404 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_bet" ("id" serial primary key, "created_at" timestamptz(0) not null, "bet" int not null, "owner_id" int not null, "product_id" int not null);');

    this.addSql('alter table "product_bet" add constraint "product_bet_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "product_bet" add constraint "product_bet_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "product_bet" cascade;');
  }

}
