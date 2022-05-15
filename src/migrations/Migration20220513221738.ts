import { Migration } from '@mikro-orm/migrations';

export class Migration20220513221738 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "order" drop constraint if exists "order_status_check";');

    this.addSql('alter table "order" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "order" add constraint "order_status_check" check ("status" in (\'not_paid\', \'in_progress\', \'paid\'));');

    this.addSql('alter table "product" add column "delivery_method" text check ("delivery_method" in (\'SDEK\', \'RUSSIA_POST\', \'PERSONAL_COURIER\', \'PICKUP\')) null default null, add column "delivery_size" text check ("delivery_size" in (\'BOX\', \'PALLET\', \'PALLET_SMALL\', \'EUROPALLET\', \'TRUCK_1_5\', \'TRUCK_3_5\', \'TRUCK_5\', \'TRUCK_10\', \'EUROFURA\', \'CONTAINER_22\', \'CONTAINER_26\', \'CONTAINER_30\')) null default null, add column "delivery_supplier" text check ("delivery_supplier" in (\'owner\', \'customer\')) null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop constraint if exists "order_status_check";');

    this.addSql('alter table "order" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "order" add constraint "order_status_check" check ("status" in (\'not_paid\', \'paid\'));');

    this.addSql('alter table "product" drop column "delivery_method";');
    this.addSql('alter table "product" drop column "delivery_size";');
    this.addSql('alter table "product" drop column "delivery_supplier";');
  }

}
