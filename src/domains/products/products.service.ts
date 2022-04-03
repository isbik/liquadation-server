import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { paginated } from 'src/lib/Paginated';
import { CategoriesService } from '../categories/categories.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudStorageService: CloudStorageService,
    private readonly categoriesService: CategoriesService,

    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const product = this.productRepository.create(createProductDto);

      if (createProductDto.manifestoFileId) {
        const manifesto = await this.cloudStorageService.findById(
          createProductDto.manifestoFileId,
        );
        product.manifesto = manifesto;
      }

      if (createProductDto.imageIds?.length !== 0) {
        const images = await this.cloudStorageService.findByIds(
          createProductDto.imageIds,
        );
        product.images.add(...images);
      }

      const subCategory = await this.categoriesService.findOne(
        createProductDto.subCategoryId,
      );

      const category = await this.categoriesService.findOne(
        createProductDto.categoryId,
      );

      product.category = category;
      product.subCategory = subCategory;
      product.owner = user;

      await this.productRepository.persistAndFlush(product);

      return product;
    } catch (error) {
      throw new HttpException(
        "Couldn't create product",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return paginated<Product>(this.productRepository);
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne(
        { id },
        { populate: ['category', 'subCategory', 'images', 'manifesto'] },
      );
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ id });

    try {
      if (updateProductDto.manifestoFileId) {
        const manifesto = await this.cloudStorageService.findById(
          updateProductDto.manifestoFileId,
        );
        product.manifesto = manifesto;
      }

      if (updateProductDto.imageIds?.length !== 0) {
        const images = await this.cloudStorageService.findByIds(
          updateProductDto.imageIds,
        );
        product.images.set(images);
      }

      const subCategory = await this.categoriesService.findOne(
        updateProductDto.subCategoryId,
      );

      const category = await this.categoriesService.findOne(
        updateProductDto.categoryId,
      );

      product.category = category;
      product.subCategory = subCategory;

      await this.productRepository.persistAndFlush(product);

      return product;
    } catch (error) {
      throw new HttpException(
        "Couldn't update product",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneOrFail(
      { id },
      { populate: ['images'] },
    );

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product.images.length !== 0) {
      try {
        await Promise.all(
          product.images
            .toArray()
            .map(({ key }) => this.cloudStorageService.deleteFile(key)),
        );
      } catch (error) {
        throw new HttpException(
          "Couldn't delete image",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    if (product.manifesto) {
      try {
        await this.cloudStorageService.deleteFile(product.manifesto.key);
      } catch (error) {
        throw new HttpException(
          "Couldn't delete file",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    await this.productRepository.nativeDelete({ id: product.id });

    return { deleted: product.id };
  }
}
