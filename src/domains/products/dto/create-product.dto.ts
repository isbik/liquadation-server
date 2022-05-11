import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Supplier } from '../entities/product-delivery.entity';
import { Condition, UnitType } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  shortDescription: string;

  @IsString()
  description: string;

  @IsPositive()
  categoryId: number;

  @IsPositive()
  subCategoryId: number;

  @IsString()
  seller: string;

  @IsEnum(Condition)
  condition: Condition;

  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsPositive()
  @Type(() => Number)
  minRate: number;

  @IsPositive()
  @Type(() => Number)
  recommendedRetailPrice: number;

  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsPositive()
  @Type(() => Number)
  totalWeight: number;

  @IsEnum(UnitType)
  unitType: UnitType;

  @IsString()
  location: string;

  @IsEnum(Supplier)
  supplier: Supplier;

  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @IsNotEmpty()
  imageIds: number[];

  @IsOptional()
  @IsPositive()
  manifestoFileId: number;
}
