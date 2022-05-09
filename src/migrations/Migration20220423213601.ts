import { Migration } from '@mikro-orm/migrations';

export class Migration20220423213601 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "setting_is_send_news" boolean not null default false, add column "setting_is_send_new_bets" boolean not null default false, add column "setting_is_send_new_competitor_bets" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "setting_is_send_news";');
    this.addSql('alter table "user" drop column "setting_is_send_new_bets";');
    this.addSql('alter table "user" drop column "setting_is_send_new_competitor_bets";');
  }

}
