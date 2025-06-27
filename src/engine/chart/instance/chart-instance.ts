import {BaseAction} from '../../actions/base-action';
import {DecisionAction} from '../../actions/decision-action';
import {EndAction} from '../../actions/end-action';
import {ProcessAction} from '../../actions/process-action';
import {StartAction} from '../../actions/start-action';
import {ChartContext} from '../context/chart-context';
import {SymbolType} from '../../../types/symbol-type.type';
import {PredefinedProcessAction} from '../../actions/predefined-process-action';
import {ChartManager} from '../manager/chart-manager';
import {ActionContext} from '../../../interfaces/action-context.interface';
import {SymbolChart} from '../../../types/symbol-chart.type';
import {Chart} from '../chart';

export class ChartInstance {
  private readonly actions: Map<
    SymbolType,
    (context: ActionContext) => BaseAction
  > = new Map<SymbolType, (context: ActionContext) => BaseAction>([
    ['start', (context: ActionContext) => new StartAction(context)],
    ['end', (context: ActionContext) => new EndAction(context)],
    ['process', (context: ActionContext) => new ProcessAction(context)],
    [
      'predefined',
      (context: ActionContext) => new PredefinedProcessAction(context),
    ],
    ['decision', (context: ActionContext) => new DecisionAction(context)],
  ]);

  private chartContext: ChartContext;
  private chart: Chart;
  private chartManager: ChartManager;

  constructor(
    chartContext: ChartContext,
    chart: Chart,
    chartManager: ChartManager,
  ) {
    this.chartContext = chartContext;
    this.chart = chart;
    this.chartManager = chartManager;
  }

  public async run(): Promise<void> {
    let next = this.chart.getStartSymbol();

    while (next) {
      next = await this.executeSymbol(next);
    }
  }

  private async executeSymbol(
    next: SymbolChart,
  ): Promise<SymbolChart | undefined> {
    const action = this.actions.get(next.type);

    if (!action) {
      throw new Error(`no action defined for symbol type ${next.type}`);
    }

    const actionInstance = action({
      symbol: next,
      chart: this.chart,
      chartManager: this.chartManager,
    });

    await actionInstance.execute(this.chartContext);
    return actionInstance.getNext(this.chartContext);
  }
}
