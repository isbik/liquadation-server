import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CloudFile,
  CloudFileSchema,
} from '../cloud-storage/entities/cloud-file.entity';
import { Category, CategorySchema } from './entities/category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CloudFile.name, schema: CloudFileSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CloudStorageService],
})
export class CategoriesModule {}
