import JwtAuthenticationGuard from '@/shared/guards/jwt-authentication.guard';
import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from '../authentication/request-with-user.interface';
import { CloudStorageService } from './cloud-storage.service';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

@Controller('upload')
export class CloudStorageController {
  constructor(private readonly cloudStorageService: CloudStorageService) {}

  @Post('image')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Req() request: RequestWithUser,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!IMAGE_TYPES.includes(image.mimetype)) {
      throw new HttpException(
        'Неверное расширение изображение',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { owner, ...responseImage } =
      await this.cloudStorageService.uploadImage(image, request.user);

    return responseImage;
  }

  @Post('file')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cloudStorageService.uploadFile(file, request.user);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthenticationGuard)
  deleteById(@Param('id') id: number) {
    return this.cloudStorageService.deleteById(id);
  }
}
