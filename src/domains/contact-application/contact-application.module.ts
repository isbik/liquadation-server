import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ContactApplicationController } from './contact-application.controller';
import { ContactApplicationService } from './contact-application.service';
import { ContactApplication } from './entities/contact-application.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ContactApplication])],
  controllers: [ContactApplicationController],
  providers: [ContactApplicationService],
})
export class ContactApplicationModule {}
