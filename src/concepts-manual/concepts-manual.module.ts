import { Module } from '@nestjs/common';
import { ConceitosManualController } from './concepts-manual.controller';
import { ConceptsManualService } from './concepts-manual.service';

@Module({
  controllers: [ConceitosManualController],
  providers: [ConceptsManualService],
})
export class ConceptsManualModule {}
