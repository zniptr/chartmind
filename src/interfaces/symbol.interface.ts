import {SymbolType} from '../types/symbol-type.type';

export interface Symbol {
  id: string;
  label: string;
  type: SymbolType;
}
