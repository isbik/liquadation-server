import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { productIds, ...data } = createOrderDto;

    const order = this.orderRepository.create({
      ...data,
    });

    // const body = {
    //   externalId: 'test 2',
    //   amount: 100_000,
    //   description: 'Оплата товара',
    //   currency: 'RUB',
    //   successUrl: 'https://mysite.com/successUrl',
    //   failUrl: 'https://mysite.com/failUrl',
    // };

    // const headers = {
    //   'Content-Type': 'application/json',
    //   'X-Api-Key': process.env.PICASSO_API_KEY,
    //   'X-Sign': createHash('md5')
    //     .update(JSON.stringify(body) + process.env.PICASSO_SECRET_PHRASE)
    //     .digest('base64'),
    // };

    // const response = await fetch(this.URL, {
    //   method: 'POST',
    //   body: JSON.stringify(body),
    //   headers,
    // });

    // const data = await response.json();

    // return data;
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
