import {ChartContext} from '../chart/context/chart-context';
import {BaseAction} from './base-action';
import {SymbolProcess} from '../../interfaces/symbol-process.interface';
import {ExecutableRegistry} from '../registry/executable-registry';
import {SymbolChart} from '../../types/symbol-chart.type';

export class ProcessAction extends BaseAction {
  public async execute(chartContext: ChartContext): Promise<void> {
    const processSymbol = this.symbol as SymbolProcess;
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

  public getNext(): SymbolChart | undefined {
    const connection = this.chart.getConnectionBySourceId(this.symbol.id);

    if (!connection || !connection.mxCell.target) {
      return undefined;
    }

    return this.chart.getSymbolById(connection.mxCell.target);
  }
}
