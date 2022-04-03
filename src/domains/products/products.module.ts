import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CloudFile } from '../cloud-storage/entities/cloud-file.entity';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [MikroOrmModule.forFeature([Product, CloudFile, Category])],
  controllers: [ProductsController],
  providers: [ProductsService, CloudStorageService, CategoriesService],
})
export class ProductsModule {}
