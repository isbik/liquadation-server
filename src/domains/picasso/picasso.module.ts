import { Module } from '@nestjs/common';
import { PicassoController } from './picasso.controller';
import { PicassoService } from './picasso.service';

@Module({
  controllers: [PicassoController],
  providers: [PicassoService],
})
export class PicassoModule {}
