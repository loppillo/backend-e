import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
 
  app.enableCors({
         origin: ['https://olemdo.cl','http://localhost:3000', 'http://www.olemdo.cl','http://localhost:4200','https://epullay.olemdo.cl'], // Dominios permitidos
    credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'Origin'], // si usas cookies o auth
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      
    })
  );
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/templates', express.static(join(__dirname, '..', 'templates')));

await app.listen(3000, '0.0.0.0');
// No usar una función aquí
}
bootstrap();
