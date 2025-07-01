import {ChartContext} from '../../../../src/engine/chart/context/chart-context';
import {Executable} from '../../../../src/interfaces/executable.interface';

export class AddHelloWorld implements Executable {
  execute(chartContext: ChartContext): void {
    chartContext.setVariable('helloWorld', 'Hello World!');
  }
}
