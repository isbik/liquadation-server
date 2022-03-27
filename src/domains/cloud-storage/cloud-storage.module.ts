import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudStorageService } from './cloud-storage.service';
import { CloudFile, CloudFileSchema } from './entities/cloud-file.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CloudFile.name, schema: CloudFileSchema },
    ]),
  ],
  providers: [CloudStorageService],
})
export class CloudStorageModule {}
