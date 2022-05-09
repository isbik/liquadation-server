import JwtAuthenticationGuard from '@/shared/guards/jwt-authentication.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import RequestWithUser from '../authentication/request-with-user.interface';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll(@Req() request: RequestWithUser) {
    return this.cartService.findAll(request.user.id);
  }
}
