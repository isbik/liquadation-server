import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '../products/entities/product.entity';
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

    if (product.owner.id === user.id) {
      throw new HttpException(
        'Вы не можете делать ставку на свой продукт',
        HttpStatus.NOT_FOUND,
      );
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

  async findAll(userId, query) {
    const { limit = 5, offset = 0, type = 'incoming' } = query;

    if (type === 'incoming') {
      const qb = this.em.createQueryBuilder(ProductBet, 'b');

      const queryBets = qb
        .select('distinct(product_id)')
        .addSelect('b.*')
        .join('b.owner', 'o')
        .addSelect('o.fio')
        .where({ owner: userId })
        .orderBy({ createdAt: -1 })
        .limit(limit)
        .offset(offset);

      const bets: { id; product: number; fio: string; bet: number }[] =
        await queryBets.execute();

      const total = await queryBets.count();

      const products = await this.productRepository.find(
        {
          id: { $in: bets.map(({ product }) => product) },
        },
        { fields: ['id', 'status'] },
      );

      const items = bets.map((bet) => {
        return {
          id: bet.id,
          buyer: bet.fio,
          count: bet.bet,
          product: products.find(({ id }) => id === bet.product),
        };
      });

      return { items, total };
    }
  }
}
