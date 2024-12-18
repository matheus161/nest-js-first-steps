import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceptsManualModule } from 'src/concepts-manual/concepts-manual.module';
import { ConceptsAutomaticModule } from 'src/concepts-automatic/concepts-automatic.module';

/* Organizar e encapsular o código */
@Module({
  imports: [ConceptsManualModule, ConceptsAutomaticModule],
  controllers: [AppController],
  providers: [AppService] /* Injetar dependencias */,
})
export class AppModule {}
