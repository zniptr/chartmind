import {ChartContext} from '../../../../src/engine/chart/context/chart-context';
import {Executable} from '../../../../src/interfaces/executable.interface';

export class HasDivider implements Executable {
  execute(chartContext: ChartContext): void {
    const counter = chartContext.getVariable('counter') as number;
    let isPrime = true;

    for (let i = 3; i < counter; i = i + 2) {
      if (counter % i === 0) {
        isPrime = false;
        break;
      }
    }

    chartContext.setVariable('isPrime', isPrime);
  }
}
