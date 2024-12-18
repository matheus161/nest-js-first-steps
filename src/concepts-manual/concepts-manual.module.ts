import { Module } from '@nestjs/common';
import { ConceitosManualController } from './concepts-manual.controller';

@Module({
  controllers: [ConceitosManualController],
})
export class ConceptsManualModule {}
