import { ApiProperty } from '@nestjs/swagger';

export class ResDto {
  @ApiProperty()
  longUrl: string;
  @ApiProperty()
  shortUrl: string;
  @ApiProperty()
  count: number;
}
