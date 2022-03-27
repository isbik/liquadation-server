import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactApplicationService } from './contact-application.service';
import { CreateContactApplicationDto } from './dto/create-contact-application.dto';

@Controller('contact-application')
export class ContactApplicationController {
  constructor(
    private readonly contactApplicationService: ContactApplicationService,
  ) {}

  @Post()
  create(@Body() createContactApplicationDto: CreateContactApplicationDto) {
    return this.contactApplicationService.create(createContactApplicationDto);
  }

  @Get()
  findAll() {
    return this.contactApplicationService.findAll();
  }
}
