import { Injectable } from '@nestjs/common';

/* Indicates that this class is injectable */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  example() {
    return 'Example uses the service';
  }
}
