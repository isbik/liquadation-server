import { Test, TestingModule } from '@nestjs/testing';
import { CloudStorageController } from './cloud-storage.controller';

describe('CloudStorageController', () => {
  let controller: CloudStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudStorageController],
    }).compile();

    controller = module.get<CloudStorageController>(CloudStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
