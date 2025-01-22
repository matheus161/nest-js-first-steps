import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  /* Carrega o módulo raiz da aplicação */
  const app = await NestFactory.create(AppModule);

  appConfig(app);

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Recados API')
    .setDescription('Envie recados para seus amigos e familiares')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
