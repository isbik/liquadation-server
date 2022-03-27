import { Controller, Get } from '@nestjs/common';
import { PicassoService } from './picasso.service';

@Controller('picasso')
export class PicassoController {
  constructor(private readonly picassoService: PicassoService) {}

  @Get()
  getPayment() {
    return this.picassoService.createPayment();
  }
}
