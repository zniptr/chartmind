import {SymbolMeta} from './symbol-meta.interface';
import {Symbol} from './symbol.interface';

export interface SymbolConnection extends Symbol {
  mxCell: SymbolMeta;
  condition: string;
  default: string;
}
