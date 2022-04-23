import { Test, TestingModule } from '@nestjs/testing';
import { ProductBetsService } from './product-bets.service';

describe('ProductBetsService', () => {
  let service: ProductBetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductBetsService],
    }).compile();

    service = module.get<ProductBetsService>(ProductBetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
