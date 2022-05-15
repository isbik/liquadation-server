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
    if (createProductBetDto.bet > 10e9) {
      throw new HttpException('Слишком большая ставка', HttpStatus.BAD_REQUEST);
    }

    const product = await this.productRepository.findOne(
      {
        id: createProductBetDto.productId,
      },
      { fields: ['id', 'owner'] },
    );

    if (!product) {
      throw new HttpException('Продукт не найден', HttpStatus.NOT_FOUND);
    }

    if (product.owner.id === user.id) {
      throw new HttpException(
        'Вы не можете делать ставку на свой продукт',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (new Date(product.finishAuctionAt).getTime() < Date.now()) {
      throw new HttpException(
        'Время для ставок завершено',
        HttpStatus.BAD_REQUEST,
      );
    }

    let foundBet;

    try {
      [foundBet] = await this.findLastMaxBet([product.id]);
    } catch (error) {
      throw new HttpException(
        'Ошибка при попытки найти ставку, попробуйте позже',
        HttpStatus.BAD_REQUEST,
      );
    }

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

    return {
      id: bet.id,
      userId: bet.owner.id,
      count: bet.bet,
    };
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

    const qb = this.em.createQueryBuilder(ProductBet, 'b');

    if (type === 'incoming') {
      const queryBets = qb
        .select('distinct(product_id)')
        .addSelect('b.*')
        .join('b.owner', 'o')
        .join('b.product', 'p')
        .addSelect('o.fio')
        .where({ 'p.owner': userId })
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
        { fields: ['id', 'status', 'name'] },
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

    if (type === 'outgoing') {
      const connection = this.em.getConnection();

      const result: Array<Record<string, unknown>> = await connection.execute(
        `
        select * from product_bet pb
        inner join (
          select product_id, max(bet) as total from product_bet 
          group by product_id
          limit ?
          offset ? 
        ) a
        on pb.product_id = a.product_id
        where owner_id = ?
      `,
        [limit, offset, userId],
      );

      const total: { count: number } = await connection.execute(
        `
        select count(*) from product_bet pb
        inner join (
          select product_id, max(bet) as total from product_bet 
          group by product_id
        ) a
        on pb.product_id = a.product_id
        where owner_id  = ?
      `,
        [userId],
      );

      const products = await this.productRepository.find(
        {
          id: { $in: result.map(({ product_id }) => Number(product_id)) },
        },
        { fields: ['id', 'finishAuctionAt', 'name'] },
      );

      const items = result.map((bet) => {
        return {
          id: bet.id,
          count: bet.bet,
          product: products.find(({ id }) => id === Number(bet.product_id)),
        };
      });

      return { items, total };
    }

    throw new HttpException('type не был передан', HttpStatus.BAD_REQUEST);
  }
}
