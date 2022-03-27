import { Test, TestingModule } from '@nestjs/testing';
import { CloudStorageService } from './cloud-storage.service';

describe('CloudStorageService', () => {
  let service: CloudStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudStorageService],
    }).compile();

    service = module.get<CloudStorageService>(CloudStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
