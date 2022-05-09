import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}
  async findAll(userId: number) {
    const user = await this.usersRepository.findOne(
      { id: userId },
      {
        fields: ['cartProducts'],
      },
    );

    await user.cartProducts.init();

    const products = await user.cartProducts.loadItems({
      populate: ['images', 'owner'],
    });

    for (const product of products) {
      await product.images.init();
      await product.images.loadItems();
    }

    return products.map((product) => ({ ...product }));
  }
}
