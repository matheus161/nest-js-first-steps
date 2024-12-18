import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  /* Injeção de dependência */
  constructor(private readonly appService: AppService) {}

  @Get() // Método da solicitação
  getHello(): string {
    return this.appService.getHello();
  }
}
