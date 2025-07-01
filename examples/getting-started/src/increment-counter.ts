import { ChartContext, Executable } from 'chartmind';

export class IncrementCounter implements Executable {
  async execute(chartContext: ChartContext): Promise<void> {
    const counter = chartContext.getVariable('counter') as number;
    chartContext.setVariable('counter', counter + 1);
  }
}
