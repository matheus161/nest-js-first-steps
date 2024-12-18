import { Controller, Get } from '@nestjs/common';
import { ConceptsManualService } from './concepts-manual.service';

@Controller('concepts-manual')
export class ConceitosManualController {
  constructor(private readonly conceptsManualService: ConceptsManualService) {}

  @Get()
  home(): string {
    return this.conceptsManualService.home();
  }
}
