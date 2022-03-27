import { Test, TestingModule } from '@nestjs/testing';
import { ContactApplicationController } from './contact-application.controller';
import { ContactApplicationService } from './contact-application.service';

describe('ContactApplicationController', () => {
  let controller: ContactApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactApplicationController],
      providers: [ContactApplicationService],
    }).compile();

    controller = module.get<ContactApplicationController>(ContactApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
