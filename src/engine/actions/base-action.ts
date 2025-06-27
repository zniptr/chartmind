import {ChartContext} from '../chart/context/chart-context';
import {ActionContext} from '../../interfaces/action-context.interface';
import {ChartManager} from '../chart/manager/chart-manager';
import {SymbolChart} from '../../types/symbol-chart.type';
import {Chart} from '../chart/chart';

export abstract class BaseAction {
  protected symbol: SymbolChart;
  protected chart: Chart;
  protected chartManager: ChartManager;

  constructor(context: ActionContext) {
    this.symbol = context.symbol;
    this.chart = context.chart;
    this.chartManager = context.chartManager;
  }

  public abstract execute(chartContext: ChartContext): Promise<void>;

  public abstract getNext(chartContext: ChartContext): SymbolChart | undefined;
}
