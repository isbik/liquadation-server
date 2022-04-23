import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { ProductBet } from './entities/product-bet.entity';
import { ProductBetsController } from './product-bets.controller';
import { ProductBetsService } from './product-bets.service';

@Module({
  imports: [MikroOrmModule.forFeature([Product, User, ProductBet])],
  controllers: [ProductBetsController],
  providers: [ProductBetsService],
})
export class ProductBetsModule {}
