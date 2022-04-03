import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CloudStorageController } from './cloud-storage.controller';
import { CloudStorageService } from './cloud-storage.service';
import { CloudFile } from './entities/cloud-file.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CloudFile])],
  controllers: [CloudStorageController],
  providers: [CloudStorageService],
})
export class CloudStorageModule {}
