import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import appConfig from './app.config';
import { ConfigType } from '@nestjs/config';

@Controller()
export class AppController {
  /* Injeção de dependência */
  constructor(
    private readonly appService: AppService,
    // This allow me to access config variables with type
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {}

  // @Get() // Método da solicitação
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('example')
  example() {
    return this.appService.example();
  }
}
