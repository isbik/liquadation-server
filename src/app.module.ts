import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PicassoModule } from './domains/picasso/picasso.module';
import { ProductsModule } from './domains/products/products.module';
import { OrdersModule } from './domains/orders/orders.module';
import { UsersModule } from './domains/users/users.module';
import { AuthenticationModule } from './domains/authentication/authentication.module';
import { EmailModule } from './domains/email/email.module';
import { ContactApplicationModule } from './domains/contact-application/contact-application.module';
import { CategoriesModule } from './domains/categories/categories.module';
import { CloudStorageModule } from './domains/cloud-storage/cloud-storage.module';

//
@Module({
  imports: [
    ConfigModule.forRoot(),
    PicassoModule,
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_INITDB_HOST}:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`,
        };
      },
    }),
    ProductsModule,
    OrdersModule,
    UsersModule,
    AuthenticationModule,
    EmailModule,
    ContactApplicationModule,
    CategoriesModule,
    CloudStorageModule,
  ],
})
export class AppModule {}
