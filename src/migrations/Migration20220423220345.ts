import { Migration } from '@mikro-orm/migrations';

export class Migration20220423220345 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "settings_is_send_news" boolean null default false, add column "settings_is_send_new_bets" boolean null default false, add column "settings_is_send_new_competitor_bets" boolean null default false;');
    this.addSql('alter table "user" drop column "setting_is_send_news";');
    this.addSql('alter table "user" drop column "setting_is_send_new_bets";');
    this.addSql('alter table "user" drop column "setting_is_send_new_competitor_bets";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" add column "setting_is_send_news" boolean null default false, add column "setting_is_send_new_bets" boolean null default false, add column "setting_is_send_new_competitor_bets" boolean null default false;');
    this.addSql('alter table "user" drop column "settings_is_send_news";');
    this.addSql('alter table "user" drop column "settings_is_send_new_bets";');
    this.addSql('alter table "user" drop column "settings_is_send_new_competitor_bets";');
  }

}
