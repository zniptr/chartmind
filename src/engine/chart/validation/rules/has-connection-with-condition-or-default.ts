import {ChartValidationRule} from '../../../../interfaces/chart-validation-rule.interface';
import {SymbolConnection} from '../../../../interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../types/symbol-chart.type';
import {Chart} from '../../chart';

export class HasConnectionWithConditionOrDefault
  implements ChartValidationRule
{
  public validate(symbol: SymbolChart, chart: Chart): boolean {
    const id = symbol.id;
    const sourceConnections = chart.symbols
      .filter(symbol => symbol.type === 'connection')
      .map(symbol => symbol as SymbolConnection)
      .filter(
        symbol => symbol.mxCell !== undefined && symbol.mxCell.source === id,
      );

    if (sourceConnections.length === 0) {
      return true;
    }

    const connectionsWithDefaultValue = sourceConnections.filter(
      symbol => symbol.default !== undefined && symbol.default === '1',
    );

    const connectionsWithConditionValue = sourceConnections.filter(
      symbol => symbol.condition !== undefined && symbol.condition !== '',
    );

    return (
      connectionsWithDefaultValue.length === 1 &&
      connectionsWithConditionValue.length === sourceConnections.length - 1
    );
  }

  public generateValidationMessage(): string {
    return 'Each connection for this symbol must have a condition, and at least one must be marked as default';
  }
}
