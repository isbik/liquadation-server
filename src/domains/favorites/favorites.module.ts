import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, Product])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
