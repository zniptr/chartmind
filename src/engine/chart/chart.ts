import {SymbolConnection} from '../../interfaces/symbol-connection.interface';
import {SymbolStart} from '../../interfaces/symbol-start.interface';
import {SymbolChart} from '../../types/symbol-chart.type';

export class Chart {
  private _name: string;
  private _symbols: SymbolChart[];

  constructor(name: string, symbols: SymbolChart[]) {
    this._name = name;
    this._symbols = symbols;
  }

  public get name(): string {
    return this._name;
  }

  public get symbols(): SymbolChart[] {
    return this._symbols;
  }

  public getStartSymbol(): SymbolStart | undefined {
    return this.symbols.find(symbol => symbol.type === 'start');
  }

  public getSymbolById(id: string): SymbolChart | undefined {
    return this.symbols.find(symbol => symbol.id === id);
  }

  public getConnectionsBySourceId(id: string): SymbolConnection[] {
    return this.symbols
      .filter(symbol => symbol.type === 'connection')
      .map(symbol => symbol as SymbolConnection)
      .filter(symbol => symbol.mxCell.source === id);
  }

  public getConnectionByTargetId(id: string): SymbolConnection | undefined {
    return this.symbols
      .filter(symbol => symbol.type === 'connection')
      .map(symbol => symbol as SymbolConnection)
      .find(symbol => symbol.mxCell.target === id);
  }

  public getConnectionBySourceId(id: string): SymbolConnection | undefined {
    return this.symbols
      .filter(symbol => symbol.type === 'connection')
      .map(symbol => symbol as SymbolConnection)
      .find(symbol => symbol.mxCell.source === id);
  }
}
