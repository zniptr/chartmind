import {ChartContext} from '../../../src/engine/chart/context/chart-context';
import {Executable} from '../../../src/interfaces/executable.interface';

export class IncrementCounter implements Executable {
  async execute(chartContext: ChartContext): Promise<void> {
    const counter = chartContext.getVariable('counter') as number;
    chartContext.setVariable('counter', counter + 1);
  }
}
