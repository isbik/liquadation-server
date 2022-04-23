import { PartialType } from '@nestjs/mapped-types';
import { CreateProductBetDto } from './create-product-bet.dto';

export class UpdateProductBetDto extends PartialType(CreateProductBetDto) {}
