import { DeliveryMethod } from '@/domains/products/entities/product-delivery.entity';
import {
  ArrayMinSize,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsString()
  @IsOptional()
  apartment: string;

  @IsString()
  postalCode: string;

  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ArrayMinSize(1)
  @IsNotEmpty()
  productIds: number[];

  @IsString()
  fio: string;

  @IsEmail()
  email: string;

  @IsDefined()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Введите корректный номер',
  })
  phone: string;

  @IsOptional()
  @IsString()
  coupon: string;
}
