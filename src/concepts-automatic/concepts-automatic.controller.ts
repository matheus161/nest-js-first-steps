import { Controller, Get } from '@nestjs/common';
import { ConceptsAutomaticService } from './concepts-automatic.service';

@Controller('concepts-automatic')
export class ConceptsAutomaticController {
  constructor(
    private readonly conceitosAutomaticoService: ConceptsAutomaticService,
  ) {}

  @Get()
  home(): string {
    return this.conceitosAutomaticoService.getHome();
  }
}
