import { ProductBet } from '@/domains/product-bets/entities/product-bet.entity';
import { enumValues } from '@/lib';
import {
  Collection,
  Embedded,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CloudFile } from 'src/domains/cloud-storage/entities/cloud-file.entity';
import { User } from 'src/domains/users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductDelivery } from './product-delivery.entity';

export enum Condition {
  new = 'new',
  as_new = 'as_new',
  good = 'good',
  acceptable = 'acceptable',
  bad = 'bad',
}

export enum UnitType {
  kg = 'kg',
  tone = 'tone',
}

export enum ProductStatus {
  draft = 'draft',
  active = 'active',
  finished = 'finished',
  sold = 'sold',
}

@Entity()
export class Product {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  /* Короткое описание товара */
  @Property()
  shortDescription: string;

  /* Описание товара */
  @Property()
  description: string;

  /* Категория товара */
  @ManyToOne()
  category: Category;

  /* Подкатегория товара */
  @ManyToOne()
  subCategory: Category;

  @ManyToOne()
  owner: User;

  @Property()
  seller: string;

  @Enum(() => Condition)
  condition: Condition;

  /* Цена товара */
  @Property()
  price: number;

  @Property()
  currency = 'RUB';

  /* Минимальная ставка */
  @Property()
  minRate: number;

  /* Рекомендованная розничная цена */
  @Property()
  recommendedRetailPrice: number;

  /* Количество единиц */
  @Property()
  quantity: number;

  /* Общий вес */
  @Property()
  totalWeight: number;

  /* Единицы изменения */
  @Enum(() => UnitType)
  unitType: UnitType;

  /* Расположение товара */
  @Property()
  location: string;

  /* Изображение товара, не больше 8 */
  @ManyToMany({ nullable: true })
  images = new Collection<CloudFile>(this);

  /* Манифест товара */
  @OneToOne({ nullable: true })
  manifesto: CloudFile;

  /* TODO Тип аукциона */
  @Property()
  auctionType = 'standard';

  @Property()
  createdAt = new Date();

  /* Дата завершения аукциона, по умолчанию 3 дня */
  @Property({ default: null, nullable: true })
  finishAuctionAt = new Date(Date.now() + 24 * 60 * 60 * 1000 * 3);

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToMany({ hidden: true })
  viewers = new Collection<User>(this);

  /* Статус продукта */
  @Enum({
    default: ProductStatus.active,
    items: enumValues(ProductStatus),
    nullable: true,
  })
  status = ProductStatus.active;

  @Embedded(() => ProductDelivery)
  delivery!: ProductDelivery;

  /* Ставки */
  @OneToMany({
    entity: () => ProductBet,
    mappedBy: 'product',
    orphanRemoval: true,
  })
  bets = new Collection<ProductBet>(this);
}
