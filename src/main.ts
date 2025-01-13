import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';

async function bootstrap() {
  /* Carrega o módulo raiz da aplicação */
  const app = await NestFactory.create(AppModule);

  appConfig(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
