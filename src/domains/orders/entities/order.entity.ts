import {
  DeliveryMethod,
  DeliverySize,
} from '@/domains/products/entities/product-delivery.entity';
import { Product } from '@/domains/products/entities/product.entity';
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

export enum OrderStatus {
  not_paid = 'not_paid',
  paid = 'paid',
}
@Entity()
export class Order {
  @PrimaryKey()
  id: number;

  @Enum(() => OrderStatus)
  status = OrderStatus.not_paid;

  @Enum(() => DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @Enum(() => DeliverySize)
  deliverySize: DeliverySize;

  @Property()
  city: string;

  @Property()
  street: string;

  @Property()
  apartment: string;

  @Property()
  postalCode: string;

  @Property()
  fio: string;

  @Property()
  email: string;

  @Property()
  phone: string;

  @ManyToMany()
  products = new Collection<Product>(this);

  @Property()
  coupon: string;
}
