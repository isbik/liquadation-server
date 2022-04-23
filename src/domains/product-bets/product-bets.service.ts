import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductBetDto } from './dto/create-product-bet.dto';
import { ProductBet } from './entities/product-bet.entity';

@Injectable()
export class ProductBetsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(ProductBet)
    private readonly productBetsRepository: EntityRepository<ProductBet>,
    private readonly em: EntityManager,
  ) {}
  async create(user: User, createProductBetDto: CreateProductBetDto) {
    const product = await this.productRepository.findOne(
      {
        id: createProductBetDto.productId,
      },
      { fields: ['id'] },
    );

    if (!product) {
      throw new HttpException('Продукт не найден', HttpStatus.NOT_FOUND);
    }

    if (new Date(product.finishAuctionAt).getTime() < Date.now()) {
      throw new HttpException(
        'Время для ставок завершено',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [foundBet] = await this.findLastMaxBet([product.id]);

    if (foundBet) {
      if (foundBet.owner.id === user.id) {
        throw new HttpException(
          'Вы уже сделали ставку',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (foundBet.bet >= createProductBetDto.bet) {
        throw new HttpException(
          'Текущая ставка меньше предыдущей',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const bet = this.productBetsRepository.create({
      bet: createProductBetDto.bet,
      product: product.id,
      owner: user.id,
    });

    await this.productBetsRepository.persistAndFlush(bet);

    return bet;
  }

  async findLastMaxBet(productIds: number[]) {
    const qb = this.em.createQueryBuilder(ProductBet);

    const bets = await qb
      .select('*')
      .where({ product: { $in: productIds } })
      .groupBy('id')
      .limit(1)
      .orderBy({ createdAt: -1 })
      .execute();

    return bets;
  }

  async findAll(query) {
    const { limit = 5, offset = 0, type = 'incoming' } = query;

    if (type === 'incoming') {
      const qb = this.em.createQueryBuilder(Product);

      const activeProductsQuery = qb
        .select('id')
        .where({
          finishAuctionAt: { $gt: new Date() },
        })
        .limit(limit)
        .offset(offset)
        .orWhere({
          status: ProductStatus.sold,
        });

      const activeProducts = await activeProductsQuery.execute();
      const total = await activeProductsQuery.getCount('id');

      const qbProductBet = this.em.createQueryBuilder(ProductBet);

      const bets = await qbProductBet
        .select('*')
        .where({ product: { $in: activeProducts.map(({ id }) => id) } })
        .groupBy('id')
        .limit(1)
        .orderBy({ createdAt: -1 })
        .getResultList();

      const users = await this.userRepository.find(
        {
          id: { $in: bets.map(({ owner }) => owner.id) },
        },
        {
          fields: ['id', 'fio'],
        },
      );

      const items = activeProducts.map((product) => {
        const bet = bets.find((bet) => Number(bet.product.id) === product.id);

        if (!bet) return product;

        return {
          ...product,
          bet: { ...bet, owner: users.find(({ id }) => id === bet.owner.id) },
        };
      });

      return { items, total };
    }
  }
}
