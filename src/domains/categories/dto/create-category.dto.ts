import { IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsPositive()
  @IsOptional()
  categoryId: number;

  @IsPositive()
  @IsOptional()
  imageId: number;
}
