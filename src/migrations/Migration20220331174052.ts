import { Migration } from '@mikro-orm/migrations';

export class Migration20220331174052 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_category_id_unique";');
    this.addSql('alter table "product" drop constraint "product_sub_category_id_unique";');
    this.addSql('alter table "product" drop constraint "product_owner_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" add constraint "product_category_id_unique" unique ("category_id");');
    this.addSql('alter table "product" add constraint "product_sub_category_id_unique" unique ("sub_category_id");');
    this.addSql('alter table "product" add constraint "product_owner_id_unique" unique ("owner_id");');
  }

}
