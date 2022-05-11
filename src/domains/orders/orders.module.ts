import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PicassoService } from '../picasso/picasso.service';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [MikroOrmModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService, PicassoService],
})
export class OrdersModule {}
