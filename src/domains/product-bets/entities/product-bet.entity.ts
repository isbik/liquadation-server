import { Product } from '@/domains/products/entities/product.entity';
import { User } from '@/domains/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ProductBet {
  @PrimaryKey()
  id: number;

  @Property()
  createdAt = new Date();

  /* Размер ставки */
  @Property()
  bet: number;

  /* Владелец ставки */
  @ManyToOne()
  owner: User;

  /* Продукт на который была сделана ставка */
  @ManyToOne()
  product: Product;
}
