import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  Category,
  CategoryDocument,
  CategorySchema,
} from './entities/category.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly cloudStorageService: CloudStorageService,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const category = new this.categoryModel(createCategoryDto);

    if (createCategoryDto.categoryId) {
      try {
        const parentCategory = await this.categoryModel.findById(
          createCategoryDto.categoryId,
        );

        if (!parentCategory) {
          throw new HttpException(
            'Not found parent category',
            HttpStatus.NOT_FOUND,
          );
        }
        category.parentCategory = parentCategory.id;
      } catch (error) {
        throw new HttpException('Server error', HttpStatus.BAD_REQUEST);
      }
    }

    if (image) {
      const uploaded = await this.cloudStorageService.uploadImage(image);
      category.image = uploaded;
    }

    await category.save();

    return category;
  }

  findAll(parentCategoryId?: string) {
    return this.categoryModel
      .find({
        parentCategory: parentCategoryId || null,
      })
      .populate('parentCategory', '', Category.name);
  }

  async findOne(id: string) {
    const category = await this.categoryModel
      .findById(id)
      .populate('parentCategory', '', Category.name);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    category.name = updateCategoryDto.name;

    if (updateCategoryDto.categoryId) {
      try {
        const parentCategory = await this.categoryModel.findById(
          updateCategoryDto.categoryId,
        );

        if (!parentCategory) {
          throw new HttpException(
            'Not found parent category',
            HttpStatus.NOT_FOUND,
          );
        }
        category.parentCategory = parentCategory.id;
      } catch (error) {
        throw new HttpException('Server error', HttpStatus.BAD_REQUEST);
      }
    }

    if (image) {
      const uploaded = await this.cloudStorageService.uploadImage(image);
      category.image = uploaded;
    }

    await category.save();

    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    if (category.image) {
      try {
        await this.cloudStorageService.deleteFile(category.image.key);
      } catch (error) {
        throw new HttpException(
          "Couldn't delete image",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    await category.delete();

    return { deleted: category.id };
  }
}
