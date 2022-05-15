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

  async searchUserFavoriteProductIds(ids: number[], user?: User) {
    if (ids.length === 0 || !user) return [];

    const favoriteProducts = await user.favouriteProducts.init({
      where: { id: { $in: ids } },
    });

    return favoriteProducts.getIdentifiers();
  }

  async getFavoriteLots(userId: number, query) {
    const user = await this.userRepository.findOne({ id: userId });

    await user.favouriteProducts.init();

    const count = await user.favouriteProducts.loadCount();

    const favorites = await user.favouriteProducts.getItems({
      fields: ['id'],

      ...(query.productIds
        ? {
            where: {
              id: {
                $in: query.productIds.split(','),
              },
            },
          }
        : {}),
      ...query,
    });

    const items = await this.productRepository.find(
      {
        id: { $in: favorites.map(({ id }) => id) },
      },
      {
        populate: ['images'],
        fields: [
          'id',
          'name',
          'quantity',
          'price',
          'recommendedRetailPrice',
          'createdAt',
          'price',
        ],
      },
    );

    return {
      count,
      items,
    };
  }

  async addFavouriteProduct(productId: number, userId: number) {
    const user = await this.userRepository.findOne({ id: userId });
    const product = await this.productRepository.findOne({ id: productId });

    user.favouriteProducts.add(product);

    this.userRepository.persistAndFlush(user);
  }

  async removeFavouriteProduct(productId: number, userId: number) {
    const user = await this.userRepository.findOne({ id: userId });
    const product = await this.productRepository.findOne({ id: productId });

    await user.favouriteProducts.init();

    user.favouriteProducts.remove(product);

    this.userRepository.persistAndFlush(user);
  }

  async getFavoriteOrganizations(userId: number, query) {
    const user = await this.userRepository.findOne({ id: userId });

    const count = await user.favouriteOrganizations.loadCount();

    const favoriteUsers = await user.favouriteOrganizations.matching({
      fields: ['id', 'organizationName', 'avatar'],
      populate: ['avatar'],
      ...query,
    });

    const qb = this.em.createQueryBuilder(Product);

    const countOrganizations = await qb
      .select('count(id)')
      .addSelect('owner')
      .where({ id: { $in: favoriteUsers.map(({ id }) => id) } })
      .groupBy('owner')
      .execute();

    const items = favoriteUsers.reduce((acc, organization) => {
      acc.push({
        organizationName: organization.organizationName,
        avatar: organization.avatar,
        countLots:
          countOrganizations.find(
            (count) => organization.id === count.owner.id,
          ) || 0,
      });
      return acc;
    }, []);

    return { count, items };
  }

  async addFavoriteOrganization(organizationId: number, userId: number) {
    const user = await this.userRepository.findOne({ id: userId });

    const organization = await this.userRepository.findOne({
      id: organizationId,
    });

    if (!organization) {
      throw new HttpException(
        'Организация не была найдена',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userId === organization.id) {
      throw new HttpException('Not allow add myself', HttpStatus.BAD_REQUEST);
    }

    user.favouriteOrganizations.add(organization);

    this.userRepository.persistAndFlush(user);
  }
}
