import {ChartValidationRule} from '../../../../interfaces/chart-validation-rule.interface';
import {SymbolConnection} from '../../../../interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../types/symbol-chart.type';
import {Chart} from '../../chart';

export class HasSingleSourceConnection implements ChartValidationRule {
  public validate(symbol: SymbolChart, chart: Chart): boolean {
    const id = symbol.id;
    const sourceConnections = chart.symbols
      .filter(symbol => symbol.type === 'connection')
      .map(symbol => symbol as SymbolConnection)
      .filter(
        symbol => symbol.mxCell !== undefined && symbol.mxCell.source === id,
      );

    return sourceConnections.length === 1;
  }

  public generateValidationMessage(): string {
    return 'Symbol should have one source connection';
  }
}
