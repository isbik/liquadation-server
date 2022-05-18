import { Migration } from '@mikro-orm/migrations';

export class Migration20220518090836 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order" ("id" serial primary key, "status" text check ("status" in (\'not_paid\', \'in_progress\', \'paid\')) not null, "delivery_method" text check ("delivery_method" in (\'SDEK\', \'RUSSIA_POST\', \'PERSONAL_COURIER\', \'PICKUP\')) not null, "delivery_size" text check ("delivery_size" in (\'BOX\', \'PALLET\', \'PALLET_SMALL\', \'EUROPALLET\', \'TRUCK_1_5\', \'TRUCK_3_5\', \'TRUCK_5\', \'TRUCK_10\', \'EUROFURA\', \'CONTAINER_22\', \'CONTAINER_26\', \'CONTAINER_30\')) not null, "city" varchar(255) not null, "street" varchar(255) not null, "apartment" varchar(255) not null, "postal_code" varchar(255) not null, "fio" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "coupon" varchar(255) not null, "amount" int not null);');

    this.addSql('create table "contact_application" ("id" serial primary key, "email" varchar(255) not null, "phone" varchar(255) null, "fio" varchar(255) null, "comment" varchar(255) not null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "user" ("id" serial primary key, "organization_name" varchar(255) not null, "inn" varchar(255) not null, "kpp" varchar(255) not null default null, "orgn" varchar(255) not null, "city" varchar(255) not null, "fact_address" varchar(255) not null, "legal_address" varchar(255) not null, "postal_code" varchar(255) not null, "phone" varchar(255) not null, "email" varchar(255) not null, "fio" varchar(255) not null, "position" varchar(255) not null, "director_phone" varchar(255) not null, "director_email" varchar(255) not null, "email_status" text check ("email_status" in (\'active\', \'blocked\', \'verification\')) not null, "password" varchar(255) not null, "role" text check ("role" in (\'user\', \'admin\')) not null default \'user\', "avatar_id" int null, "partner_code" varchar(255) null default null, "settings_is_send_news" boolean null default false, "settings_is_send_new_bets" boolean null default false, "settings_is_send_new_competitor_bets" boolean null default false);');

    this.addSql('create table "cloud_file" ("id" serial primary key, "filename" varchar(255) not null, "url" varchar(255) not null, "mimetype" varchar(255) not null, "key" varchar(255) not null, "owner_id" int not null, "active" boolean not null default false);');

    this.addSql('create table "user_favourite_organizations" ("user_1_id" int not null, "user_2_id" int not null);');
    this.addSql('alter table "user_favourite_organizations" add constraint "user_favourite_organizations_pkey" primary key ("user_1_id", "user_2_id");');

    this.addSql('create table "user_views" ("user_1_id" int not null, "user_2_id" int not null);');
    this.addSql('alter table "user_views" add constraint "user_views_pkey" primary key ("user_1_id", "user_2_id");');

    this.addSql('create table "category" ("id" serial primary key, "name" varchar(255) not null, "image_id" int null, "parent_category_id" int null);');

    this.addSql('create table "product" ("id" serial primary key, "name" varchar(255) not null, "short_description" varchar(255) not null, "description" varchar(255) not null, "category_id" int not null, "sub_category_id" int not null, "owner_id" int not null, "seller" varchar(255) not null, "condition" text check ("condition" in (\'new\', \'as_new\', \'good\', \'acceptable\', \'bad\')) not null, "price" int not null, "currency" varchar(255) not null, "min_rate" int not null, "recommended_retail_price" int not null, "quantity" int not null, "total_weight" int not null, "unit_type" text check ("unit_type" in (\'kg\', \'tone\')) not null, "location" varchar(255) not null, "manifesto_id" int null, "auction_type" varchar(255) not null, "created_at" timestamptz(0) not null, "finish_auction_at" timestamptz(0) null default null, "updated_at" timestamptz(0) not null, "status" text check ("status" in (\'draft\', \'active\', \'finished\', \'sold\')) null default \'active\', "delivery_method" text check ("delivery_method" in (\'SDEK\', \'RUSSIA_POST\', \'PERSONAL_COURIER\', \'PICKUP\')) null default null, "delivery_size" text check ("delivery_size" in (\'BOX\', \'PALLET\', \'PALLET_SMALL\', \'EUROPALLET\', \'TRUCK_1_5\', \'TRUCK_3_5\', \'TRUCK_5\', \'TRUCK_10\', \'EUROFURA\', \'CONTAINER_22\', \'CONTAINER_26\', \'CONTAINER_30\')) null default null, "delivery_supplier" text check ("delivery_supplier" in (\'owner\', \'customer\')) null default null);');
    this.addSql('alter table "product" add constraint "product_manifesto_id_unique" unique ("manifesto_id");');

    this.addSql('create table "product_bet" ("id" serial primary key, "created_at" timestamptz(0) not null, "bet" int not null, "owner_id" int not null, "product_id" int not null);');

    this.addSql('create table "order_products" ("order_id" int not null, "product_id" int not null);');
    this.addSql('alter table "order_products" add constraint "order_products_pkey" primary key ("order_id", "product_id");');

    this.addSql('create table "product_images" ("product_id" int not null, "cloud_file_id" int not null);');
    this.addSql('alter table "product_images" add constraint "product_images_pkey" primary key ("product_id", "cloud_file_id");');

    this.addSql('create table "product_viewers" ("product_id" int not null, "user_id" int not null);');
    this.addSql('alter table "product_viewers" add constraint "product_viewers_pkey" primary key ("product_id", "user_id");');

    this.addSql('create table "user_favourite_products" ("user_id" int not null, "product_id" int not null);');
    this.addSql('alter table "user_favourite_products" add constraint "user_favourite_products_pkey" primary key ("user_id", "product_id");');

    this.addSql('create table "user_cart_products" ("user_id" int not null, "product_id" int not null);');
    this.addSql('alter table "user_cart_products" add constraint "user_cart_products_pkey" primary key ("user_id", "product_id");');

    this.addSql('alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "cloud_file" ("id") on update cascade on delete set null;');

    this.addSql('alter table "cloud_file" add constraint "cloud_file_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_favourite_organizations" add constraint "user_favourite_organizations_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favourite_organizations" add constraint "user_favourite_organizations_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_views" add constraint "user_views_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_views" add constraint "user_views_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "category" add constraint "category_image_id_foreign" foreign key ("image_id") references "cloud_file" ("id") on update cascade on delete set null;');
    this.addSql('alter table "category" add constraint "category_parent_category_id_foreign" foreign key ("parent_category_id") references "category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product" add constraint "product_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_sub_category_id_foreign" foreign key ("sub_category_id") references "category" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_manifesto_id_foreign" foreign key ("manifesto_id") references "cloud_file" ("id") on update cascade on delete set null;');

    this.addSql('alter table "product_bet" add constraint "product_bet_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "product_bet" add constraint "product_bet_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('alter table "order_products" add constraint "order_products_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "order_products" add constraint "order_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "product_images" add constraint "product_images_cloud_file_id_foreign" foreign key ("cloud_file_id") references "cloud_file" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product_viewers" add constraint "product_viewers_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "product_viewers" add constraint "product_viewers_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_favourite_products" add constraint "user_favourite_products_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favourite_products" add constraint "user_favourite_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_cart_products" add constraint "user_cart_products_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_cart_products" add constraint "user_cart_products_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
  }

}
