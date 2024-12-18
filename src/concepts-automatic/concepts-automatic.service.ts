import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceptsAutomaticService {
  getHome() {
    return 'concepts-automatic';
  }
}
