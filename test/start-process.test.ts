import {ChartManager} from '../src/engine/chart/manager/chart-manager';
import {ExecutableRegistry} from '../src/engine/registry/executable-registry';
import {HasDivider} from './executions/start-process/has-divider';
import {IncrementCounter} from './executions/start-process/increment-counter';
import {SetIsPrimeFalse} from './executions/start-process/set-is-prime-false';

describe('ChartManager (E2E)', () => {
  let chartManager: ChartManager;

  beforeAll(() => {
    chartManager = new ChartManager().loadCharts('./test/charts/start-process');

    ExecutableRegistry.instance
      .addExecutable('increment-counter', IncrementCounter)
      .addExecutable('set-is-prime-false', SetIsPrimeFalse)
      .addExecutable('has-divider', HasDivider);
  });

  it('should throw an error if the chart does not exist', async () => {
    await expect(() =>
      chartManager.startProcess('Test 0', new Map()),
    ).rejects.toThrow('unknown chart name Test 0');
  });

  it('should throw an error if chart is empty', async () => {
    await expect(() =>
      chartManager.startProcess('Test 1', new Map()),
    ).rejects.toThrow('unknown chart name Test 1');
  });

  it.each<{
    chartName: string;
    actualContext: Map<string, unknown>;
    expectedContext: Map<string, unknown>;
  }>([
    {chartName: 'Test2', actualContext: new Map(), expectedContext: new Map()},
    {
      chartName: 'Test3',
      actualContext: new Map([['counter', 1]]),
      expectedContext: new Map([['counter', 2]]),
    },
    {
      chartName: 'Test4',
      actualContext: new Map([['counter', 1]]),
      expectedContext: new Map([['counter', 2]]),
    },
    {
      chartName: 'Test4',
      actualContext: new Map([['counter', 3]]),
      expectedContext: new Map([['counter', 5]]),
    },
    {
      chartName: 'Test5',
      actualContext: new Map<string, unknown>([['counter', 10]]),
      expectedContext: new Map<string, unknown>([
        ['counter', 10],
        ['isPrime', false],
      ]),
    },
    {
      chartName: 'Test5',
      actualContext: new Map<string, unknown>([['counter', 25]]),
      expectedContext: new Map<string, unknown>([
        ['counter', 25],
        ['isPrime', false],
      ]),
    },
    {
      chartName: 'Test5',
      actualContext: new Map<string, unknown>([['counter', 7]]),
      expectedContext: new Map<string, unknown>([
        ['counter', 8],
        ['isPrime', true],
      ]),
    },
    {
      chartName: 'Test5',
      actualContext: new Map<string, unknown>([['counter', 23]]),
      expectedContext: new Map<string, unknown>([
        ['counter', 24],
        ['isPrime', true],
      ]),
    },
  ])(
    'should execute the chart without validation messages and errors',
    async ({chartName, actualContext, expectedContext}) => {
      const logSpy = jest.spyOn(console, 'log');

      chartManager.validateChartByName(chartName);
      await expect(
        chartManager.startProcess(chartName, actualContext),
      ).resolves.not.toThrow();
      expect(actualContext).toEqual(expectedContext);
      expect(logSpy).not.toHaveBeenCalled();
    },
  );
});
