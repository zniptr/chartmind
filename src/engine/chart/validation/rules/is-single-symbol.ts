import {ChartValidationRule} from '../../../../interfaces/chart-validation-rule.interface';
import {SymbolChart} from '../../../../types/symbol-chart.type';
import {Chart} from '../../chart';

export class IsSingleSymbol implements ChartValidationRule {
  public validate(symbol: SymbolChart, chart: Chart): boolean {
    const type = symbol.type;
    const symbols = chart.symbols.filter(symbol => symbol.type === type);

    return symbols.length === 1;
  }

  public generateValidationMessage(): string {
    return 'Symbol should only appear once';
  }
}
