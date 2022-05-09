import { Migration } from '@mikro-orm/migrations';

export class Migration20220423213932 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_setting_is_send_news_check";');
    this.addSql('alter table "user" alter column "setting_is_send_news" type boolean using ("setting_is_send_news"::boolean);');
    this.addSql('alter table "user" alter column "setting_is_send_news" drop not null;');
    this.addSql('alter table "user" drop constraint if exists "user_setting_is_send_new_bets_check";');
    this.addSql('alter table "user" alter column "setting_is_send_new_bets" type boolean using ("setting_is_send_new_bets"::boolean);');
    this.addSql('alter table "user" alter column "setting_is_send_new_bets" drop not null;');
    this.addSql('alter table "user" drop constraint if exists "user_setting_is_send_new_competitor_bets_check";');
    this.addSql('alter table "user" alter column "setting_is_send_new_competitor_bets" type boolean using ("setting_is_send_new_competitor_bets"::boolean);');
    this.addSql('alter table "user" alter column "setting_is_send_new_competitor_bets" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_setting_is_send_news_check";');
    this.addSql('alter table "user" alter column "setting_is_send_news" type boolean using ("setting_is_send_news"::boolean);');
    this.addSql('alter table "user" alter column "setting_is_send_news" set not null;');
    this.addSql('alter table "user" drop constraint if exists "user_setting_is_send_new_bets_check";');
    this.addSql('alter table "user" alter column "setting_is_send_new_bets" type boolean using ("setting_is_send_new_bets"::boolean);');
    this.addSql('alter table "user" alter column "setting_is_send_new_bets" set not null;');
    this.addSql('alter table "user" drop constraint if exists "user_setting_is_send_new_competitor_bets_check";');
    this.addSql('alter table "user" alter column "setting_is_send_new_competitor_bets" type boolean using ("setting_is_send_new_competitor_bets"::boolean);');
    this.addSql('alter table "user" alter column "setting_is_send_new_competitor_bets" set not null;');
  }

}
