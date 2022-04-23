import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './domains/authentication/authentication.module';
import { CategoriesModule } from './domains/categories/categories.module';
import { CloudStorageModule } from './domains/cloud-storage/cloud-storage.module';
import { ContactApplicationModule } from './domains/contact-application/contact-application.module';
import { EmailModule } from './domains/email/email.module';
import { FavoritesModule } from './domains/favorites/favorites.module';
import { OrdersModule } from './domains/orders/orders.module';
import { PicassoModule } from './domains/picasso/picasso.module';
import { ProductsModule } from './domains/products/products.module';
import { UsersModule } from './domains/users/users.module';
import { ProductBetsModule } from './domains/product-bets/product-bets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    PicassoModule,
    ProductsModule,
    OrdersModule,
    ContactApplicationModule,
    UsersModule,
    AuthenticationModule,
    EmailModule,
    CategoriesModule,
    CloudStorageModule,
    FavoritesModule,
    ProductBetsModule,
  ],
})
export class AppModule {}
