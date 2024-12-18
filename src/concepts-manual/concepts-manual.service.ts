import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceptsManualService {
  home(): string {
    return 'Home do Conceitos Manual Solucionada.';
  }
}
