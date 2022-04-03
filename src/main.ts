import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     exceptionFactory: (validationErrors: ValidationError[] = []) => {
  //       return new BadRequestException(validationErrors);
  //     },
  //   }),
  // );

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });

  app.enableCors({
    credentials: true,
    exposedHeaders: '*',
    origin: 'http://localhost:3000',
  });

  await app.listen(4200);
}

bootstrap();
