import {ChartContext} from '../chart/context/chart-context';
import {BaseAction} from './base-action';
import {SymbolProcess} from '../../interfaces/symbol-process.interface';
import {ExecutableRegistry} from '../registry/executable-registry';
import {SymbolChart} from '../../types/symbol-chart.type';
import {decode} from 'he';

export class ProcessAction extends BaseAction {
  public async execute(chartContext: ChartContext): Promise<void> {
    const processSymbol = this.symbol as SymbolProcess;

    this.addDataToContext(processSymbol.data, chartContext);

    const executableName = processSymbol.executable;
    const Executable =
      ExecutableRegistry.instance.getExecutableByName(executableName);

    if (Executable) {
      const instance = new Executable();

      const result = instance.execute(chartContext);
      if (result instanceof Promise) {
        await result;
      }
    }

    // console.log(`SymbolProcess ${this.symbol.label} executed.`);
    return;
  }

  private addDataToContext(
    data: string | undefined,
    chartContext: ChartContext,
  ): void {
    if (!data) {
      return;
    }

    const unescapedData = decode(data);
    const parsedData = JSON.parse(unescapedData);
    const keys = Object.keys(parsedData);

    for (const key of keys) {
      chartContext.setVariable(key, parsedData[key]);
    }
  }

  public getNext(): SymbolChart | undefined {
    const connection = this.chart.getConnectionBySourceId(this.symbol.id);

    if (!connection || !connection.mxCell.target) {
      return undefined;
    }

    return this.chart.getSymbolById(connection.mxCell.target);
  }
}
