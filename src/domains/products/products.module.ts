import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CloudFile } from '../cloud-storage/entities/cloud-file.entity';
import { ProductBet } from '../product-bets/entities/product-bet.entity';
import { ProductBetsService } from '../product-bets/product-bets.service';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Product, CloudFile, Category, User, ProductBet]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CloudStorageService,
    CategoriesService,
    ProductBetsService,
  ],
})
export class ProductsModule {}
