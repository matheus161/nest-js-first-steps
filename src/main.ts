import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  /* Carrega o módulo raiz da aplicação */
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove keys that aren't defined the DTO
      forbidNonWhitelisted: true, // throw an error if a property not exist in the DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
