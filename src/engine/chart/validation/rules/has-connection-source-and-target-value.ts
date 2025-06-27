import {ChartValidationRule} from '../../../../interfaces/chart-validation-rule.interface';
import {SymbolConnection} from '../../../../interfaces/symbol-connection.interface';

export class HasConnectionSourceAndTargetValue implements ChartValidationRule {
  public validate(symbol: SymbolConnection): boolean {
    const hasCell = symbol.mxCell !== undefined;

    if (!hasCell) {
      return false;
    }

    const hasSource =
      symbol.mxCell.source !== undefined && symbol.mxCell.source !== '';
    const hasTarget =
      symbol.mxCell.target !== undefined && symbol.mxCell.target !== '';

    return hasSource && hasTarget;
  }

  public generateValidationMessage(): string {
    return 'Connection has no target or/and source connected';
  }
}
