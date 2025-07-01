import { ChartContext, Executable } from 'chartmind';

export class IncrementCounter implements Executable {
  execute(chartContext: ChartContext): void {
    const counter = chartContext.getVariable('counter') as number;
    chartContext.setVariable('counter', counter + 1);
  }
}
