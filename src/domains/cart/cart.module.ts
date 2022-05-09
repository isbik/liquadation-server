import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
