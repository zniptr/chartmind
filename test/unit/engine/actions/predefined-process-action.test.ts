import {SymbolConnection} from '../../../../src/interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../src/types/symbol-chart.type';
import {Chart} from '../../../../src/engine/chart/chart';
import {ChartContext} from '../../../../src/engine/chart/context/chart-context';
import {ChartManager} from '../../../../src/engine/chart/manager/chart-manager';
import {PredefinedProcessAction} from '../../../../src/engine/actions/predefined-process-action';

type PredefinedProcessActionFake = {
  symbol: SymbolChart;
  chart: Chart;
  chartManager: ChartManager;
  execute(chartContext: ChartContext): Promise<void>;
  getNext(): SymbolChart | undefined;
};

describe('PredefinedProcessAction', () => {
  const symbol = {link: 'data:page/id,123'} as unknown as SymbolChart;
  const chartManager = {
    startChartInstanceById: jest.fn(),
  } as unknown as ChartManager;
  const chart = {
    name: '',
    symbols: [],
    getConnectionBySourceId: jest.fn(),
    getSymbolById: jest.fn(),
  } as unknown as Chart;

  let action: PredefinedProcessActionFake;

  beforeEach(
    () =>
      (action = new PredefinedProcessAction({
        chart,
        chartManager,
        symbol,
      }) as unknown as PredefinedProcessActionFake),
  );

  describe('execute', () => {
    it('should call predefined process by name', async () => {
      const chartContext = {
        context: new Map(),
      } as unknown as ChartContext;
      const startChartInstanceByIdSpy = jest
        .spyOn(action.chartManager, 'startChartInstanceById')
        .mockResolvedValue(undefined);

      await expect(action.execute(chartContext)).resolves.not.toThrow();
      expect(startChartInstanceByIdSpy).toHaveBeenCalledWith(
        '123',
        chartContext.context,
      );
    });
  });

  describe('getNext', () => {
    it('should return undefined if no next symbol was found', () => {
      jest
        .spyOn(action.chart, 'getConnectionBySourceId')
        .mockReturnValue(undefined);

      const result = action.getNext();

      expect(result).toBeUndefined();
    });

    it('should return undefined if no connection with target was found', () => {
      jest.spyOn(action.chart, 'getConnectionBySourceId').mockReturnValue({
        mxCell: {target: undefined},
      } as unknown as SymbolConnection);

      const result = action.getNext();

      expect(result).toBeUndefined();
    });

    it('should return the next symbol if a valid connection with a target exists', () => {
      jest.spyOn(action.chart, 'getConnectionBySourceId').mockReturnValue({
        mxCell: {target: '2'},
      } as unknown as SymbolConnection);
      jest
        .spyOn(action.chart, 'getSymbolById')
        .mockReturnValue({id: 'next'} as unknown as SymbolConnection);

      const result = action.getNext();

      expect(result).toEqual({id: 'next'});
    });
  });
});
