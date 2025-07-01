import {SymbolChart} from '../../types/symbol-chart.type';
import {BaseAction} from './base-action';

export class StartAction extends BaseAction {
  public async execute(): Promise<void> {
    // console.log(`SymbolStart ${this.symbol.label} executed.`);
  }

  public getNext(): SymbolChart | undefined {
    const connection = this.chart.getConnectionBySourceId(this.symbol.id);

    if (!connection || !connection.mxCell.target) {
      return undefined;
    }

    return this.chart.getSymbolById(connection.mxCell.target);
  }
}
