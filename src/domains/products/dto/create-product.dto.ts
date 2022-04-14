import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Condition, Supplier, UnitType } from '../entities/product.entity';

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
  price: number;

  @IsPositive()
  minRate: number;

  @IsPositive()
  recommendedRetailPrice: number;

  @IsPositive()
  quantity: number;

  @IsPositive()
  totalWeight: number;

  @IsEnum(UnitType)
  unitType: UnitType;

  @IsString()
  location: string;

  @IsEnum(Supplier)
  supplier: Supplier;

  @MaxLength(8, { each: true })
  imageIds: number[];

  @IsOptional()
  @IsPositive()
  manifestoFileId: number;
}
