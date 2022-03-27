import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContactApplicationDto } from './dto/create-contact-application.dto';
import {
  ContactApplication,
  ContactApplicationDocument,
} from './entities/contact-application.entity';
import { Model } from 'mongoose';

@Injectable()
export class ContactApplicationService {
  constructor(
    @InjectModel(ContactApplication.name)
    private contactApplicationModel: Model<ContactApplicationDocument>,
  ) {}

  create(createContactApplicationDto: CreateContactApplicationDto) {
    return this.contactApplicationModel.create(createContactApplicationDto);
  }

  findAll() {
    return this.contactApplicationModel.find();
  }
}
