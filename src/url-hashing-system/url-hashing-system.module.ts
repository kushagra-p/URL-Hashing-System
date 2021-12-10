import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './model/url.model';
import { UrlHashingSystemController } from './url-hashing-system.controller';
import { UrlHashingSystemService } from './url-hashing-system.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlHashingSystemController],
  providers: [UrlHashingSystemService],
})
export class UrlHashingSystemModule {}
