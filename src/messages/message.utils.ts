import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageUtils {
  inverteString(str: string) {
    // Luiz -> ziuL
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class MessageUtilsMock {
  inverteString() {
    console.log('Passei no MOCK');
    return 'bla bla bla';
  }
}
