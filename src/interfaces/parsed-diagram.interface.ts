import {SymbolChart} from '../types/symbol-chart.type';

export interface ParsedDiagram {
  name: string;
  mxGraphModel: {root: {object: SymbolChart[] | SymbolChart}};
}
