import {Symbol} from './symbol.interface';

export interface SymbolProcess extends Symbol {
  executable: string;
  data?: string;
}
