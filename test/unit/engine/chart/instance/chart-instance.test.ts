import {Chart} from '../../../../../src/engine/chart/chart';
import {ChartContext} from '../../../../../src/engine/chart/context/chart-context';
import {ChartInstance} from '../../../../../src/engine/chart/instance/chart-instance';
import {ChartManager} from '../../../../../src/engine/chart/manager/chart-manager';
import {SymbolEnd} from '../../../../../src/interfaces/symbol-end.interface';
import {SymbolProcess} from '../../../../../src/interfaces/symbol-process.interface';
import {SymbolStart} from '../../../../../src/interfaces/symbol-start.interface';
import {SymbolChart} from '../../../../../src/types/symbol-chart.type';
import {SymbolType} from '../../../../../src/types/symbol-type.type';

const actionMock = {
  execute: jest.fn().mockResolvedValue(undefined),
  getNext: jest.fn().mockReturnValue(undefined),
};

jest.mock('../../../../../src/engine/actions/start-action', () => ({
  StartAction: jest.fn().mockImplementation(() => actionMock),
}));
jest.mock('../../../../../src/engine/actions/process-action', () => ({
  ProcessAction: jest.fn().mockImplementation(() => actionMock),
}));
jest.mock(
  '../../../../../src/engine/actions/predefined-process-action',
  () => ({
    PredefinedProcessAction: jest.fn().mockImplementation(() => actionMock),
  }),
);
jest.mock('../../../../../src/engine/actions/decision-action', () => ({
  DecisionAction: jest.fn().mockImplementation(() => actionMock),
}));
jest.mock('../../../../../src/engine/actions/end-action', () => ({
  EndAction: jest.fn().mockImplementation(() => actionMock),
}));

type ChartInstanceFake = {
  chartContext: ChartContext;
  chart: Chart;
  chartManager: ChartManager;
  getStartSymbol: () => SymbolStart | undefined;
  executeSymbol: (symbol: unknown) => Promise<SymbolChart | undefined>;
  run(): Promise<void>;
};

describe('ChartInstance', () => {
  describe('run', () => {
    let chartInstance: ChartInstanceFake;

    beforeEach(
      () =>
        (chartInstance = new ChartInstance(
          {
            context: new Map(),
          } as unknown as ChartContext,
          {
            name: '',
            symbols: [],
            getStartSymbol: jest.fn(),
          } as unknown as Chart,
          {} as unknown as ChartManager,
        ) as unknown as ChartInstanceFake),
    );

    it('should do nothing if there is no start symbol', async () => {
      jest
        .spyOn(chartInstance.chart, 'getStartSymbol')
        .mockReturnValue(undefined);
      const executeSymbolSpy = jest.spyOn(chartInstance, 'executeSymbol');

      await chartInstance.run();

      expect(executeSymbolSpy).not.toHaveBeenCalled();
    });

    it('should enter the while loop if a start symbol is found', async () => {
      jest
        .spyOn(chartInstance.chart, 'getStartSymbol')
        .mockReturnValue({type: 'start', id: '', label: ''});
      const executeSymbolSpy = jest.spyOn(chartInstance, 'executeSymbol');
      executeSymbolSpy.mockReturnValue(Promise.resolve(undefined));

      await chartInstance.run();

      expect(executeSymbolSpy).toHaveBeenCalled();
    });

    it('should remain in the while loop if there are multiple symbols', async () => {
      jest
        .spyOn(chartInstance.chart, 'getStartSymbol')
        .mockReturnValue({type: 'start', id: '', label: ''});
      const executeSymbolSpy = jest.spyOn(chartInstance, 'executeSymbol');
      executeSymbolSpy
        .mockReturnValueOnce(
          Promise.resolve({
            type: 'process',
            id: '',
            label: '',
            executable: '',
          } as SymbolProcess),
        )
        .mockReturnValueOnce(
          Promise.resolve({type: 'end', id: '', label: ''} as SymbolEnd),
        )
        .mockReturnValueOnce(Promise.resolve(undefined));

      await chartInstance.run();

      expect(executeSymbolSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('executeSymbol', () => {
    let chartInstance: ChartInstanceFake;

    beforeEach(
      () =>
        (chartInstance = new ChartInstance(
          {
            context: new Map(),
          } as unknown as ChartContext,
          {name: '', symbols: []} as unknown as Chart,
          {} as unknown as ChartManager,
        ) as unknown as ChartInstanceFake),
    );

    it('should throw an error for a symbol with an unknown type', async () => {
      const fakeSymbolType = 'test' as unknown as SymbolType;

      await expect(
        chartInstance.executeSymbol({
          type: fakeSymbolType,
          id: '',
          label: '',
        }),
      ).rejects.toThrow('no action defined for symbol type test');
    });

    it.each<SymbolType>(['start', 'process', 'predefined', 'decision', 'end'])(
      'should execute each available symbol',
      async type => {
        const result = await chartInstance.executeSymbol({
          type,
          id: '',
          label: '',
        });

        expect(result).toBeUndefined();
      },
    );
  });
});
