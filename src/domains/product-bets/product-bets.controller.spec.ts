import { Test, TestingModule } from '@nestjs/testing';
import { ProductBetsController } from './product-bets.controller';
import { ProductBetsService } from './product-bets.service';

describe('ProductBetsController', () => {
  let controller: ProductBetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductBetsController],
      providers: [ProductBetsService],
    }).compile();

    controller = module.get<ProductBetsController>(ProductBetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
