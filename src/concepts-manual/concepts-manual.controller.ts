import { Controller, Get } from '@nestjs/common';

@Controller('concepts-manual')
export class ConceitosManualController {
  @Get()
  home(): string {
    return 'concepts-manual';
  }
}
