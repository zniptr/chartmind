import {SymbolPredefinedProcess} from '../../interfaces/symbol-predefined-process.interface';
import {SymbolChart} from '../../types/symbol-chart.type';
import {ChartContext} from '../chart/context/chart-context';
import {BaseAction} from './base-action';

export class PredefinedProcessAction extends BaseAction {
  public async execute(chartContext: ChartContext): Promise<void> {
    const predefinedProcess = this.symbol as SymbolPredefinedProcess;
    const linkedChart = predefinedProcess.link;
    const parts = linkedChart.split(',');

    if (parts.length === 2) {
      await this.chartManager.startChartInstanceById(
        parts[1],
        chartContext.context,
      );
    }

    // console.log(`SymbolPredefinedProcess ${this.symbol.label} executed.`);
  }

  public getNext(): SymbolChart | undefined {
    const connection = this.chart.getConnectionBySourceId(this.symbol.id);

    if (!connection || !connection.mxCell.target) {
      return undefined;
    }

    return this.chart.getSymbolById(connection.mxCell.target);
  }
}
