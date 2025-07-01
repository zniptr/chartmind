import {ChartContext} from '../../../../src/engine/chart/context/chart-context';
import {Executable} from '../../../../src/interfaces/executable.interface';

export class AddHelloWorldAsync implements Executable {
  private readonly TWO_SECONDS_TIMEOUT = 2000;

  async execute(chartContext: ChartContext): Promise<void> {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        chartContext.setVariable('helloWorldAsync', 'Hello World Async!');
        resolve();
      }, this.TWO_SECONDS_TIMEOUT),
    );
  }
}
