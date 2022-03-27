import { IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsPositive()
  price: number;

  @IsString()
  @MinLength(10)
  description: string;
}
