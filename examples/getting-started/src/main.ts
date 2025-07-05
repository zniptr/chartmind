import { ChartManager, ExecutableRegistry } from 'chartmind';
import { IncrementCounter } from './increment-counter';

const chartManager = new ChartManager()
    .loadCharts('./charts')
    .validateCharts(); // Optional chart validation

ExecutableRegistry.instance
    .addExecutable('increment-counter', IncrementCounter);

start();

async function start() {
  try {
      const chartName = 'Test Chart';
      const chartContext = new Map<string, unknown>([
          ['counter', 1]
      ]);

      await chartManager.startChartInstanceByName(chartName, chartContext);

      console.log(chartContext.get('counter')); // Output: 2
  } catch(error: unknown) {
      console.log(error);
  }
}