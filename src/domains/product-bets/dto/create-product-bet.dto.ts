import { IsPositive } from 'class-validator';

export class CreateProductBetDto {
  @IsPositive()
  bet: number;

  @IsPositive()
  productId: number;
}
