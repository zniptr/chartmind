import {SymbolConnection} from '../../../../src/interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../src/types/symbol-chart.type';
import {Chart} from '../../../../src/engine/chart/chart';
import {ChartContext} from '../../../../src/engine/chart/context/chart-context';
import {ChartManager} from '../../../../src/engine/chart/manager/chart-manager';
import {ExecutableRegistry} from '../../../../src/engine/registry/executable-registry';
import {ProcessAction} from '../../../../src/engine/actions/process-action';

jest.mock('./../../../../src/engine/registry/executable-registry', () => ({
  ExecutableRegistry: {
    instance: {
      getExecutableByName: jest.fn(),
    },
  },
}));

type ProcessActionFake = {
  symbol: SymbolChart;
  chart: Chart;
  chartManager: ChartManager;
  execute(chartContext: ChartContext): Promise<void>;
  getNext(): SymbolChart | undefined;
};

describe('ProcessAction', () => {
  const symbol = {} as unknown as SymbolChart;
  const chartManager = {} as unknown as ChartManager;
  const chart = {
    name: '',
    symbols: [],
    getConnectionBySourceId: jest.fn(),
    getSymbolById: jest.fn(),
  } as unknown as Chart;

  let action: ProcessActionFake;

  beforeEach(
    () =>
      (action = new ProcessAction({
        chart,
        chartManager,
        symbol,
      }) as unknown as ProcessActionFake),
  );

  describe('execute', () => {
    it('should not execute if executable is not found in registry', async () => {
      const chartContext = {
        context: new Map(),
      } as unknown as ChartContext;
      jest
        .spyOn(ExecutableRegistry.instance, 'getExecutableByName')
        .mockReturnValue(undefined);

      await expect(action.execute(chartContext)).resolves.not.toThrow();
    });

    it('should call and execute the async executable if found in registry', async () => {
      const chartContext = {
        context: new Map(),
      } as unknown as ChartContext;
      const mockExecutable = jest.fn().mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue(undefined),
      }));

      jest
        .spyOn(ExecutableRegistry.instance, 'getExecutableByName')
        .mockReturnValue(mockExecutable);

      await action.execute(chartContext);

      expect(mockExecutable).toHaveBeenCalled();
    });

    it('should call and execute the executable if found in registry', async () => {
      const chartContext = {
        context: new Map(),
      } as unknown as ChartContext;
      const mockExecutable = jest.fn().mockImplementation(() => ({
        execute: jest.fn().mockReturnValue(undefined),
      }));

      jest
        .spyOn(ExecutableRegistry.instance, 'getExecutableByName')
        .mockReturnValue(mockExecutable);

      await action.execute(chartContext);

      expect(mockExecutable).toHaveBeenCalled();
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
