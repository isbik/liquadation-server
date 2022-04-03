import { paginated } from '@/lib/Paginated';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateContactApplicationDto } from './dto/create-contact-application.dto';
import { ContactApplication } from './entities/contact-application.entity';

@Injectable()
export class ContactApplicationService {
  constructor(
    @InjectRepository(ContactApplication)
    private readonly contactApplicationRepository: EntityRepository<ContactApplication>,
  ) {}

  async create(createContactApplicationDto: CreateContactApplicationDto) {
    try {
      const contactApplication = this.contactApplicationRepository.create(
        createContactApplicationDto,
      );

      await this.contactApplicationRepository.persistAndFlush(
        contactApplication,
      );
    } catch (error) {
      console.log('error: ', error);
      throw new HttpException(
        "cound'n t create application",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return 'Ok';
  }

  delete(id: number) {
    const contractApplication = this.contactApplicationRepository.find({ id });
    this.contactApplicationRepository.remove(contractApplication);
  }

  findAll() {
    return paginated(this.contactApplicationRepository);
  }
}
