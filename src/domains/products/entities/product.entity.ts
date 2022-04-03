import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CloudFile } from 'src/domains/cloud-storage/entities/cloud-file.entity';
import { User } from 'src/domains/users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

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

export enum Supplier {
  owner = 'owner',
  tone = 'tone',
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

  /* Кто осуществляет доставку */
  @Enum(() => Supplier)
  supplier: Supplier;

  /* TODO Тип аукциона */
  @Property()
  auctionType = 'standard';

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
