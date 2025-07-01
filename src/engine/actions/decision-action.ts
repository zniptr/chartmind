import {SymbolConnection} from '../../interfaces/symbol-connection.interface';
import {SymbolChart} from '../../types/symbol-chart.type';
import {ChartContext} from '../chart/context/chart-context';
import {BaseAction} from './base-action';

export class DecisionAction extends BaseAction {
  public async execute(): Promise<void> {
    // console.log(`SymbolEnd ${this.symbol.label} executed.`);
  }

  public getNext(chartContext: ChartContext): SymbolChart | undefined {
    const connections = this.chart.getConnectionsBySourceId(this.symbol.id);

    const evaluatedConnection = this.getEvaluatedConnection(
      connections,
      chartContext,
    );
    if (evaluatedConnection && evaluatedConnection.mxCell.target) {
      return this.chart.getSymbolById(evaluatedConnection.mxCell.target);
    }

    const defaultConnection = this.getDefaultConnection(connections);
    if (defaultConnection && defaultConnection.mxCell.target) {
      return this.chart.getSymbolById(defaultConnection.mxCell.target);
    }

    return undefined;
  }

  private getEvaluatedConnection(
    connections: SymbolConnection[],
    chartContext: ChartContext,
  ): SymbolConnection | undefined {
    return connections.find(
      connection =>
        connection.default !== '1' &&
        this.evaluateCondition(connection.condition, chartContext),
    );
  }

  private evaluateCondition(
    condition: string,
    chartContext: ChartContext,
  ): boolean {
    chartContext.context.forEach(
      (value: unknown, key: String) =>
        (condition = condition.replaceAll(key.toString(), String(value))),
    );

    return eval(condition) as boolean;
  }

  private getDefaultConnection(
    connections: SymbolConnection[],
  ): SymbolConnection | undefined {
    return connections.find(connections => connections.default === '1');
  }
}
