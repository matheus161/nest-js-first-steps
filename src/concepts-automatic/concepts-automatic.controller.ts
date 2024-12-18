import { Controller, Get } from '@nestjs/common';

@Controller('concepts-automatic')
export class ConceptsAutomaticController {
  @Get()
  home(): string {
    return 'concepts-automatic';
  }
}
