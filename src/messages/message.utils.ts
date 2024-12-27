import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageUtils {
  inverteString(str: string) {
    // Luiz -> ziuL
    return str.split('').reverse().join('');
  }
}
