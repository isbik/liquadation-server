import { IS_DEV } from '@/lib';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { PicassoService } from '../picasso/picasso.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly picassoService: PicassoService,
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    private readonly em: EntityManager,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { productIds, ...data } = createOrderDto;

    const order = this.orderRepository.create({
      ...data,
      products: productIds,
    });

    //  Стоимость заказа без учета доставки

    const connection = this.em.getConnection();

    const bets: Array<Record<string, never>> = await connection.execute(
      `
      select b.product_id, b.owner_id, b.bet as count from product_bet as b
      inner join (
        select product_id, max(bet) as total from product_bet 
        group by product_id
      )  as a
      on b.product_id = a.product_id and b.bet = a.total
      where b.product_id in (?)

      group by b.id
      order by b.created_at 
    `,
      [productIds],
    );

    const amount: number = bets.reduce((acc, { count }) => acc + count, 0);

    order.amount = amount;

    await this.orderRepository.persistAndFlush(order);

    const url = IS_DEV
      ? `${process.env.FRONTEND_URL}/order/${order.id}`
      : 'https://test.com';

    const body = {
      externalId: String(order.id),
      amount,
      description: 'Оплата товара',
      currency: 'RUB',
      successUrl: url,
      failUrl: url,
    };

    const paymentData = await this.picassoService.createPayment(body);

    return paymentData;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
