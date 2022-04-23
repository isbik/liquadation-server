import { Migration } from '@mikro-orm/migrations';

export class Migration20220421162651 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_views" ("user_1_id" int not null, "user_2_id" int not null);',
    );
    this.addSql(
      'alter table "user_views" add constraint "user_views_pkey" primary key ("user_1_id", "user_2_id");',
    );

    this.addSql(
      'alter table "user_views" add constraint "user_views_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_views" add constraint "user_views_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "user" add column "partner_code" varchar(255) null default null;',
    );

    this.addSql(
      'alter table "product" add column "finish_auction_at" timestamptz(0) default null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_views" cascade;');

    this.addSql('alter table "user" drop column "partner_code";');

    this.addSql('alter table "product" drop column "finish_auction_at";');
  }
}
