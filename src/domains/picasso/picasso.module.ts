import { Module } from '@nestjs/common';
import { PicassoService } from './picasso.service';

@Module({
  providers: [PicassoService],
})
export class PicassoModule {}
