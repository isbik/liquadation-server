import {
  EntityRepository,
  FilterQuery,
  FindOneOptions,
  FindOptions,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly cloudStorageService: CloudStorageService,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);

    if (createCategoryDto.categoryId) {
      try {
        const parentCategory = await this.categoryRepository.findOne({
          id: createCategoryDto.categoryId,
        });

        if (!parentCategory) {
          throw new HttpException(
            'Not found parent category',
            HttpStatus.NOT_FOUND,
          );
        }
        category.parentCategory = parentCategory;
      } catch (error) {
        throw new HttpException('Server error', HttpStatus.BAD_REQUEST);
      }
    }

    if (createCategoryDto.imageId) {
      const image = await this.cloudStorageService.findById(
        createCategoryDto.imageId,
      );

      category.image = image;
    }

    await this.categoryRepository.persistAndFlush(category);

    return category;
  }

  async findAll(query) {
    const { offset = 0, limit = 10 } = query || {};
    const options: FindOptions<Category, 'image' | 'parentCategory'> = {};
    const where: FilterQuery<Category> = {};

    if (query.parentCategory === 'null') {
      where.parentCategory = null;
    }

    if (query.orderBy) {
      options.orderBy = { [query.orderBy]: query.orderSort };
    }

    const [items, total] = await this.categoryRepository.findAndCount(where, {
      offset,
      limit,
      ...options,
      populate: ['parentCategory', 'image'],
    });

    return { items, total };
  }

  async findById(
    id: number,
    options: FindOneOptions<Category, any> = { populate: ['image'] },
  ) {
    const category = await this.categoryRepository.findOne({ id }, options);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  findOne(id: number) {
    return this.findById(id, {
      populate: ['parentCategory', 'image'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findById(id);

    category.name = updateCategoryDto.name;

    if (updateCategoryDto.categoryId) {
      try {
        const parentCategory = await this.categoryRepository.findOne({
          id: updateCategoryDto.categoryId,
        });

        if (!parentCategory) {
          throw new HttpException(
            'Not found parent category',
            HttpStatus.NOT_FOUND,
          );
        }
        category.parentCategory = parentCategory;
      } catch (error) {
        throw new HttpException('Server error', HttpStatus.BAD_REQUEST);
      }
    }

    if (updateCategoryDto.imageId) {
      const image = await this.cloudStorageService.findById(
        updateCategoryDto.imageId,
      );

      if (category.image === null) {
        category.image = image;
        image.active = true;
      } else if (image.id === category.image.id) {
        category.image.active = false;
        category.image = image;
      }
    } else if (category.image !== null) {
      await this.cloudStorageService.deleteById(category.image.id);
      category.image = null;
    }

    await this.categoryRepository.persistAndFlush(category);

    return {
      ...category,
      image: category.image,
      parentCategory: category.parentCategory,
    };
  }

  async remove(id: number) {
    const category = await this.findById(id);

    if (category.image) {
      console.log('category.image: ', category.image);
      try {
        await this.cloudStorageService.deleteFile(category.image.key);
      } catch (error) {
        throw new HttpException(
          "Couldn't delete image",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    await this.categoryRepository.removeAndFlush(category);

    return { deleted: category.id };
  }
}
