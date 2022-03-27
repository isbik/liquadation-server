import { Test, TestingModule } from '@nestjs/testing';
import { PicassoController } from './picasso.controller';

describe('PicassoController', () => {
  let controller: PicassoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PicassoController],
    }).compile();

    controller = module.get<PicassoController>(PicassoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
