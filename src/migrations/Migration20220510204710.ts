import { Migration } from '@mikro-orm/migrations';

export class Migration20220510204710 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" add column "status" text check ("status" in (\'not_paid\', \'paid\')) not null, add column "coupon" varchar(255) not null, add column "amount" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "status";');
    this.addSql('alter table "order" drop column "coupon";');
    this.addSql('alter table "order" drop column "amount";');
  }

}
