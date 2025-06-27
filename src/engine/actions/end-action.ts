import {SymbolChart} from '../../types/symbol-chart.type';
import {BaseAction} from './base-action';

export class EndAction extends BaseAction {
  public async execute(): Promise<void> {
    // console.log(`SymbolEnd ${this.symbol.label} executed.`);
  }

  public getNext(): SymbolChart | undefined {
    return undefined;
  }
}
