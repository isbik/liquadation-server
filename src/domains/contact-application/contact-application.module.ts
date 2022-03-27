import { Module } from '@nestjs/common';
import { ContactApplicationService } from './contact-application.service';
import { ContactApplicationController } from './contact-application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContactApplication,
  ContactApplicationSchema,
} from './entities/contact-application.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactApplication.name, schema: ContactApplicationSchema },
    ]),
  ],
  controllers: [ContactApplicationController],
  providers: [ContactApplicationService],
})
export class ContactApplicationModule {}
