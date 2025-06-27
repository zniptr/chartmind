import {Chart} from '../engine/chart/chart';
import {SymbolChart} from '../types/symbol-chart.type';

export interface ChartValidationRule {
  validate(symbol: SymbolChart, chart: Chart): boolean;
  generateValidationMessage(): string;
}
