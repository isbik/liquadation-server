import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async getFavoriteLots(userId: number, query) {
    const user = await this.userRepository.findOne({ id: userId });

    const count = await user.favouriteProducts.loadCount();

    const favorites = await user.favouriteProducts.matching({
      populate: ['category', 'images'],
      fields: [
        'id',
        'name',
        'images',
        'quantity',
        'price',
        'recommendedRetailPrice',
        'createdAt',
      ],
      ...query,
    });

    return { count, items: favorites };
  }

  async addFavouriteProduct(productId: number, userId: number) {
    const user = await this.userRepository.findOne({ id: userId });
    const product = await this.productRepository.findOne({ id: productId });
    user.favouriteProducts.add(product);

    this.userRepository.persistAndFlush(user);
  }

  async getFavoriteOrganizations(userId: number, query) {
    const user = await this.userRepository.findOne({ id: userId });

    const count = await user.favouriteOrganizations.loadCount();

    const favoriteUsers = await user.favouriteOrganizations.matching({
      fields: ['id', 'organizationName'],
      populate: ['avatar'],
      ...query,
    });

    // const products = await this.productRepository.find(
    //   {
    //     id: {
    //       $in: favoriteUsers.map(({ id }) => id),
    //     },
    //   },
    //   {
    //     groupBy: ['user.id'],
    //   },
    // );

    const qb = this.em.createQueryBuilder(Product);

    const products = await qb
      .select('count(id)')
      .addSelect('owner')
      .where({ id: { $in: favoriteUsers.map(({ id }) => id) } })
      .groupBy('owner')
      .execute();

    return { count, items: favoriteUsers, products };
  }

  async addFavoriteOrganization(organizationId: number, userId: number) {
    const user = await this.userRepository.findOne({ id: userId });
    const organization = await this.userRepository.findOne({
      id: organizationId,
    });

    if (user.id === organization.id) {
      throw new HttpException('Not allow add myself', HttpStatus.BAD_REQUEST);
    }

    user.favouriteOrganizations.add(organization);

    this.userRepository.persistAndFlush(user);
  }
}
