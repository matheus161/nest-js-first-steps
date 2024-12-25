import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number) // Convert to Number
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number) // Convert to Number
  offset: number;
}
