import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthenticationModule } from './domains/authentication/authentication.module';
import { CartModule } from './domains/cart/cart.module';
import { CategoriesModule } from './domains/categories/categories.module';
import { CloudStorageModule } from './domains/cloud-storage/cloud-storage.module';
import { ContactApplicationModule } from './domains/contact-application/contact-application.module';
import { EmailModule } from './domains/email/email.module';
import { FavoritesModule } from './domains/favorites/favorites.module';
import { OrdersModule } from './domains/orders/orders.module';
import { PicassoModule } from './domains/picasso/picasso.module';
import { ProductBetsModule } from './domains/product-bets/product-bets.module';
import { ProductsModule } from './domains/products/products.module';
import { UsersModule } from './domains/users/users.module';
import { LogsMiddleware } from './shared/middleware/logs.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    ScheduleModule.forRoot(),
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
    CartModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
