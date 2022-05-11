import JwtAuthenticationGuard from '@/shared/guards/jwt-authentication.guard';
import { OptionalJwtAuthGuard } from '@/shared/guards/optional-jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from '../authentication/request-with-user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Req() request: RequestWithUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, request.user);
  }

  @Get('/search')
  search(@Query() query) {
    return this.productsService.search(query);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(@Req() request: RequestWithUser, @Query() query) {
    return this.productsService.findAll(request.user.id, query);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Req() request: RequestWithUser, @Param('id') id: number) {
    if (request.user.id) this.productsService.addViews(request.user.id, id);
    return this.productsService.findOne(id, request?.user?.id);
  }

  @Get(':id/similar')
  findSimilar(@Param('id') id: number) {
    return this.productsService.findSimilar(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
