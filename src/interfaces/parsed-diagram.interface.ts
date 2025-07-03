import {SymbolChart} from '../types/symbol-chart.type';

export interface ParsedDiagram {
  id: string;
  name: string;
  mxGraphModel: {root: {object: SymbolChart[] | SymbolChart}};
}
