import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CloudFile } from '../cloud-storage/entities/cloud-file.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CloudFile, Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CloudStorageService],
})
export class CategoriesModule {}
