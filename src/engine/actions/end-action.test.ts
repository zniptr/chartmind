import {SymbolChart} from '../../types/symbol-chart.type';
import {Chart} from '../chart/chart';
import {ChartContext} from '../chart/context/chart-context';
import {ChartManager} from '../chart/manager/chart-manager';
import {EndAction} from './end-action';

type EndActionFake = {
  symbol: SymbolChart;
  chart: Chart;
  chartManager: ChartManager;
  execute(chartContext: ChartContext): Promise<void>;
  getNext(): SymbolChart | undefined;
};

describe('EndAction', () => {
  const symbol = {} as unknown as SymbolChart;
  const chartManager = {} as unknown as ChartManager;
  const chart = {
    name: '',
    symbols: [],
  } as unknown as Chart;

  let action: EndActionFake;

  beforeEach(
    () =>
      (action = new EndAction({
        chart,
        chartManager,
        symbol,
      }) as unknown as EndActionFake),
  );

  describe('execute', () => {
    it('should do nothing', async () => {
      const chartContext = {
        context: new Map(),
      } as unknown as ChartContext;
      await action.execute(chartContext);
    });
  });

  describe('getNext', () => {
    it('should return undefined', () => {
      const result = action.getNext();

      expect(result).toBeUndefined();
    });
  });
});
