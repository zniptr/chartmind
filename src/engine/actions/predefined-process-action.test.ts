import {SymbolConnection} from '../../interfaces/symbol-connection.interface';
import {SymbolChart} from '../../types/symbol-chart.type';
import {Chart} from '../chart/chart';
import {ChartContext} from '../chart/context/chart-context';
import {ChartManager} from '../chart/manager/chart-manager';
import {PredefinedProcessAction} from './predefined-process-action';

type PredefinedProcessActionFake = {
  symbol: SymbolChart;
  chart: Chart;
  chartManager: ChartManager;
  execute(chartContext: ChartContext): Promise<void>;
  getNext(): SymbolChart | undefined;
};

describe('PredefinedProcessAction', () => {
  const symbol = {name: 'test'} as unknown as SymbolChart;
  const chartManager = {
    startProcess: jest.fn(),
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
      const startProcessSpy = jest
        .spyOn(action.chartManager, 'startProcess')
        .mockResolvedValue(undefined);

      await expect(action.execute(chartContext)).resolves.not.toThrow();
      expect(startProcessSpy).toHaveBeenCalledWith(
        'test',
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
