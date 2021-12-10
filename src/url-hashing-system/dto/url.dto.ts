import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UrlDto {
  @ApiProperty()
  @IsDefined()
  @IsUrl({
    allow_underscores: true,
  })
  longUrl: string;

  @ApiProperty()
  @IsString()
  @Length(7, 7)
  @IsOptional()
  shortUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hash: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  count: number;
}
