import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly em: EntityManager,
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

    const favoriteProducts = await user.favouriteProducts.init({
      where: {
        id: { $in: products.map(({ id }) => id) },
      },
    });

    const favoriteProductIds = favoriteProducts.getIdentifiers();

    let bets: Array<Record<string, unknown>> = [];

    const connection = this.em.getConnection();

    if (products.length !== 0) {
      bets = await connection.execute(
        `select b.product_id, b.owner_id, b.bet as count
        from
        product_bet as b
        inner join (
        select product_id, max(bet) as total from product_bet 
        group by product_id
      ) as a
      on b.product_id = a.product_id and b.bet = a.total
      where b.product_id in (?)
      group by b.id
      order by b.created_at 
      `,
        [products.map(({ id }) => id)],
      );
    }

    return products.map((product) => ({
      ...product,
      bet: bets.find(({ product_id }) => product_id === product.id) || null,
      isFavorite: favoriteProductIds.includes(product.id),
    }));
  }
}
