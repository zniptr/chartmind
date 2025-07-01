import {Chart} from '../engine/chart/chart';
import {ChartManager} from '../engine/chart/manager/chart-manager';
import {SymbolChart} from '../types/symbol-chart.type';

export interface ActionContext {
  symbol: SymbolChart;
  chart: Chart;
  chartManager: ChartManager;
}
