import {SymbolConnection} from '../interfaces/symbol-connection.interface';
import {SymbolEnd} from '../interfaces/symbol-end.interface';
import {SymbolPredefinedProcess} from '../interfaces/symbol-predefined-process.interface';
import {SymbolProcess} from '../interfaces/symbol-process.interface';
import {SymbolStart} from '../interfaces/symbol-start.interface';

export type SymbolChart =
  | SymbolStart
  | SymbolEnd
  | SymbolConnection
  | SymbolProcess
  | SymbolPredefinedProcess;
