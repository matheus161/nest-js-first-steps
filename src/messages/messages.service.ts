import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  hello() {
    return 'Hello World!';
  }
}
