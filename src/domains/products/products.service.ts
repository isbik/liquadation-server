import { EntityRepository, FilterQuery, Loaded } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { paginated } from '../../lib/Paginated';
import { CategoriesService } from '../categories/categories.service';
import { CloudStorageService } from '../cloud-storage/cloud-storage.service';
import { ProductBet } from '../product-bets/entities/product-bet.entity';
import { ProductBetsService } from '../product-bets/product-bets.service';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductStatus } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly cloudStorageService: CloudStorageService,
    private readonly categoriesService: CategoriesService,
    private readonly productBetsService: ProductBetsService,

    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(ProductBet)
    private readonly productBetRepository: EntityRepository<ProductBet>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
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

    if (!subCategory || !category) {
      throw new HttpException('Категория не найдена', HttpStatus.BAD_REQUEST);
    }

    product.category = category;
    product.subCategory = subCategory;
    product.owner = user;

    await this.productRepository.persistAndFlush(product);

    return product;
  }

  async search(query) {
    const { offset = 0, limit = 10 } = query || {};

    const options: FilterQuery<Product> = { status: ProductStatus.active };

    if (query.categoryId) options.category = query.categoryId;

    if (query.name) options.name = { $like: query.name };

    if (query.q) options.name = { $like: query.q };

    const [products, total]: [
      Loaded<Product & { bet?: unknown | null }, 'images'>[],
      number,
    ] = await this.productRepository.findAndCount(options, {
      offset,
      limit,
      populate: ['images'],
      fields: [
        'name',
        'id',
        'minRate',
        'images',
        'auctionType',
        'finishAuctionAt',
        'location',
        'owner',
      ],
    });

    const connection = this.em.getConnection();

    const bets: Array<Record<string, unknown>> = await connection.execute(
      `
      select b.product_id, b.owner_id, b.bet as count
      from
        product_bet as b
      inner join (
        select product_id, max(bet) as total from product_bet 
        group by product_id
      )  as a
      on b.product_id = a.product_id and b.bet = a.total
      where
        b.product_id in (?)

      group by
        b.id
      order by
        b.created_at 
    `,
      [products.map(({ id }) => id)],
    );

    const items = products.map((product) => {
      const bet = bets.find(({ product_id }) => product_id === product.id);
      return { ...product, bet: bet || null };
    });

    return { items, total };
  }

  findAll(user_id, query) {
    const where = {
      ...query,
      owner: user_id,
    };

    return paginated<Product>(this.productRepository, where, {
      populate: ['images'],
    });
  }

  async findSimilar(productId) {
    const product = await this.productRepository.findOne({ id: productId });

    if (!product) {
      throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
    }

    return this.productRepository.find(
      {
        category: product.category,
        id: { $nin: [product.id] },
        status: ProductStatus.active,
      },
      {
        populate: ['images'],
        limit: 4,
      },
    );
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

      const viewsCount = await product.viewers.loadCount();

      const favoritesCount = await this.userRepository.count({
        favouriteProducts: {
          id,
        },
      });

      const [bet] = await this.productBetsService.findLastMaxBet([product.id]);

      return {
        ...product,
        favoritesCount,
        viewsCount,
        bet: bet ? { userId: bet.owner, count: bet.bet } : {},
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addViews(userId: number, id: number) {
    const product = await this.productRepository.findOne({ id });
    const user = await this.userRepository.findOne({ id: userId });

    await product.viewers.init();

    if (!product.viewers.contains(user)) {
      product.viewers.add(user);
      this.productRepository.persistAndFlush(product);
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

  async addToFavourite(productId: number, userId: number) {
    const user = await this.userRepository.findOne({ id: userId });
    const product = await this.productRepository.findOne({ id: productId });
    user.favouriteProducts.add(product);

    this.userRepository.persistAndFlush(user);
  }

  /* Каждые 2 минуты обновлять все товары и если которые можно сделать завершенными */
  @Interval(1000 * 2 * 60)
  async updateExpiredAuctionProducts() {
    const products = await this.productRepository.find({
      finishAuctionAt: { $lt: new Date() },
      status: ProductStatus.active,
    });

    for (const product of products) {
      const [bet] = await this.productBetsService.findLastMaxBet([product.id]);

      if (bet && bet.owner) {
        const user = await this.userRepository.findOne({
          id: Number(bet.owner),
        });

        if (user) await user.cartProducts.add(product);
      }

      product.status = ProductStatus.finished;
    }

    await this.productRepository.persistAndFlush(products);
  }
}
