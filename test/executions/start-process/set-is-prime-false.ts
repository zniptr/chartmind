import {ChartContext} from '../../../src';
import {Executable} from '../../../src/interfaces/executable.interface';

export class SetIsPrimeFalse implements Executable {
  async execute(chartContext: ChartContext): Promise<void> {
    chartContext.setVariable('isPrime', false);
  }
}
