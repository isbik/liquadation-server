import JwtAuthenticationGuard from '@/shared/guards/jwt-authentication.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from '../authentication/request-with-user.interface';
import { CreateProductBetDto } from './dto/create-product-bet.dto';
import { ProductBetsService } from './product-bets.service';

@Controller('product-bets')
export class ProductBetsController {
  constructor(private readonly productBetsService: ProductBetsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Req() request: RequestWithUser,
    @Body() createProductBetDto: CreateProductBetDto,
  ) {
    return this.productBetsService.create(request.user, createProductBetDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.productBetsService.findAll(query);
  }
}
