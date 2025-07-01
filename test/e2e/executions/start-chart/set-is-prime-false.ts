import {ChartContext} from '../../../../src/engine/chart/context/chart-context';
import {Executable} from '../../../../src/interfaces/executable.interface';

export class SetIsPrimeFalse implements Executable {
  execute(chartContext: ChartContext): void {
    chartContext.setVariable('isPrime', false);
  }
}
