import { Test, TestingModule } from '@nestjs/testing';
import { ContactApplicationService } from './contact-application.service';

describe('ContactApplicationService', () => {
  let service: ContactApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactApplicationService],
    }).compile();

    service = module.get<ContactApplicationService>(ContactApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
