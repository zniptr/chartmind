import {ChartValidationRule} from '../../../interfaces/chart-validation-rule.interface';
import {SymbolType} from '../../../types/symbol-type.type';
import {HasConnectionSourceAndTargetValue} from './rules/has-connection-source-and-target-value';
import {HasConnectionWithConditionOrDefault} from './rules/has-connection-with-condition-or-default';
import {HasSingleOrMultipleSourceConnection} from './rules/has-single-or-multiple-source-connection';
import {HasNoSourceConnection} from './rules/has-no-source-connection';
import {HasSingleOrMultipleTargetConnection} from './rules/has-single-or-multiple-target-connection';
import {HasSingleSourceConnection} from './rules/has-single-source-connection';
import {IsSingleSymbol} from './rules/is-single-symbol';
import {SymbolChart} from '../../../types/symbol-chart.type';
import {Chart} from '../chart';

export class ChartValidator {
  private readonly validationRules: Map<SymbolType, ChartValidationRule[]> =
    new Map<SymbolType, ChartValidationRule[]>([
      ['start', [new IsSingleSymbol(), new HasSingleSourceConnection()]],
      [
        'end',
        [
          new HasNoSourceConnection(),
          new HasSingleOrMultipleTargetConnection(),
        ],
      ],
      ['connection', [new HasConnectionSourceAndTargetValue()]],
      [
        'process',
        [
          new HasSingleSourceConnection(),
          new HasSingleOrMultipleTargetConnection(),
        ],
      ],
      [
        'predefined',
        [
          new HasSingleSourceConnection(),
          new HasSingleOrMultipleTargetConnection(),
        ],
      ],
      [
        'decision',
        [
          new HasSingleOrMultipleSourceConnection(),
          new HasConnectionWithConditionOrDefault(),
          new HasSingleOrMultipleTargetConnection(),
        ],
      ],
    ]);

  public validate(name: string, chart: Chart): void {
    for (const symbol of chart.symbols) {
      this.validateSymbol(name, chart, symbol);
    }
  }

  private validateSymbol(
    name: string,
    chart: Chart,
    symbol: SymbolChart,
  ): void {
    const rules = this.validationRules.get(symbol.type);

    if (!rules) {
      throw new Error(
        `no validation rules defined for symbol type ${symbol.type}`,
      );
    }

    for (const rule of rules) {
      this.checkValidationRule(name, chart, symbol, rule);
    }
  }

  private checkValidationRule(
    name: string,
    chart: Chart,
    symbol: SymbolChart,
    rule: ChartValidationRule,
  ): void {
    const isValid = rule.validate(symbol, chart);

    if (!isValid) {
      console.log(
        `${name} / ${symbol.label} / ${symbol.type}: ${rule.generateValidationMessage()}`,
      );
    }
  }
}
