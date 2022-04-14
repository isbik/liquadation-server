import JwtAuthenticationGuard from '@/shared/guards/jwt-authentication.guard';
import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from '../authentication/request-with-user.interface';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get('lots')
  getFavoritesLots(@Req() request: RequestWithUser, @Query() query) {
    return this.favoritesService.getFavoriteLots(request.user.id, query);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put('/products/:id/add')
  addToFavourite(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.favoritesService.addFavouriteProduct(id, request.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('organizations')
  getFavoritesOrganizations(@Req() request: RequestWithUser, @Query() query) {
    return this.favoritesService.getFavoriteOrganizations(
      request.user.id,
      query,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put('/organizations/:id/add')
  addFavoriteOrganization(
    @Param('id') id: number,
    @Req() request: RequestWithUser,
  ) {
    return this.favoritesService.addFavoriteOrganization(id, request.user.id);
  }
}
