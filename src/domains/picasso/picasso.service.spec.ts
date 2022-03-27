import { Test, TestingModule } from '@nestjs/testing';
import { PicassoService } from './picasso.service';

describe('PicassoService', () => {
  let service: PicassoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PicassoService],
    }).compile();

    service = module.get<PicassoService>(PicassoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
