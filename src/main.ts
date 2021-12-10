import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule,new FastifyAdapter(),{ cors: true });

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'views'),
  });
  const config = new DocumentBuilder()
    .setTitle('URL Hashing System')
    .setDescription('API for URL Hashing')
    .setVersion('1.0')
    .addTag('url-hashing')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const server = await app.listen(process.env.PORT || 3000, function(){
    console.log("NestJs server listening on port ", process.env.PORT || 3000);
  });
    server.setTimeout(9900000);
  
}
bootstrap();