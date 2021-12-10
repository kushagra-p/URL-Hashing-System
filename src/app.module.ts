import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlHashingSystemModule } from './url-hashing-system/url-hashing-system.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlHashingSystemService } from './url-hashing-system/url-hashing-system.service';

let url= process.env.MONGOURI || 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
@Module({
  imports: [
    UrlHashingSystemModule,
    MongooseModule.forRoot(
      url
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
