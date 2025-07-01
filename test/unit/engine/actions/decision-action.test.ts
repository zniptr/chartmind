import {SymbolConnection} from '../../../../src/interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../src/types/symbol-chart.type';
import {Chart} from '../../../../src/engine/chart/chart';
import {ChartContext} from '../../../../src/engine/chart/context/chart-context';
import {ChartManager} from '../../../../src/engine/chart/manager/chart-manager';
import {DecisionAction} from '../../../../src/engine/actions/decision-action';

type DecisionActionFake = {
  symbol: SymbolChart;
  chart: Chart;
  chartManager: ChartManager;
  execute(chartContext: ChartContext): Promise<void>;
  getNext(): SymbolChart | undefined;
  getEvaluatedConnection(
    connections: SymbolConnection[],
    chartContext: ChartContext,
  ): SymbolConnection | undefined;
  evaluateCondition(condition: string, chartContext: ChartContext): boolean;
  getDefaultConnection(
    connections: SymbolConnection[],
  ): SymbolConnection | undefined;
};

describe('DecisionAction', () => {
  const symbol = {} as unknown as SymbolChart;
  const chartManager = {
    context: Map<String, unknown>,
  } as unknown as ChartManager;
  const chart = {
    name: '',
    symbols: [],
    getConnectionBySourceId: jest.fn(),
    getConnectionsBySourceId: jest.fn(),
    getSymbolById: jest.fn(),
  } as unknown as Chart;

  let action: DecisionActionFake;

  beforeEach(
    () =>
      (action = new DecisionAction({
        chart,
        chartManager,
        symbol,
      }) as unknown as DecisionActionFake),
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
    it('should return the symbol if an evaluated connection with a target is found', () => {
      jest.spyOn(action.chart, 'getConnectionsBySourceId').mockReturnValue([]);
      jest.spyOn(action, 'getEvaluatedConnection').mockReturnValue({
        mxCell: {target: '1'},
      } as unknown as SymbolConnection);
      const getSymbolByIdSpy = jest
        .spyOn(action.chart, 'getSymbolById')
        .mockReturnValue({} as unknown as SymbolChart);

      const result = action.getNext();

      expect(result).toEqual({});
      expect(getSymbolByIdSpy).toHaveBeenCalledWith('1');
    });

    it('should return the symbol if no evaluated connection is found but a default connection exists', () => {
      jest.spyOn(action.chart, 'getConnectionsBySourceId').mockReturnValue([]);
      jest.spyOn(action, 'getEvaluatedConnection').mockReturnValue(undefined);
      jest.spyOn(action, 'getDefaultConnection').mockReturnValue({
        mxCell: {target: '1'},
      } as unknown as SymbolConnection);
      const getSymbolByIdSpy = jest
        .spyOn(action.chart, 'getSymbolById')
        .mockReturnValue({} as unknown as SymbolChart);

      const result = action.getNext();

      expect(result).toEqual({});
      expect(getSymbolByIdSpy).toHaveBeenCalledWith('1');
    });

    it('should return undefined if neither an evaluated nor a default connection is found', () => {
      jest.spyOn(action.chart, 'getConnectionsBySourceId').mockReturnValue([]);
      jest.spyOn(action, 'getEvaluatedConnection').mockReturnValue(undefined);
      jest.spyOn(action, 'getDefaultConnection').mockReturnValue(undefined);

      const result = action.getNext();

      expect(result).toBeUndefined();
    });
  });

  describe('getEvaluatedConnection', () => {
    it('should return undefined if there are no connections', () => {
      const result = action.getEvaluatedConnection([], {
        context: new Map(),
      } as unknown as ChartContext);

      expect(result).toBeUndefined();
    });

    it('should return undefined if only a default connection exists', () => {
      const result = action.getEvaluatedConnection(
        [{default: '1'} as unknown as SymbolConnection],
        {
          context: new Map(),
        } as unknown as ChartContext,
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined if neither a default nor an evaluated connection exists', () => {
      jest.spyOn(action, 'evaluateCondition').mockReturnValue(false);

      const result = action.getEvaluatedConnection(
        [{} as unknown as SymbolConnection],
        {
          context: new Map(),
        } as unknown as ChartContext,
      );

      expect(result).toBeUndefined();
    });

    it('should return a connection if it is not a default connection and the condition evaluates to true', () => {
      jest
        .spyOn(action, 'evaluateCondition')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const result = action.getEvaluatedConnection(
        [
          {id: '1'} as unknown as SymbolConnection,
          {id: '2', default: '1'} as unknown as SymbolConnection,
          {id: '3'} as unknown as SymbolConnection,
          {id: '4'} as unknown as SymbolConnection,
        ],
        {
          context: new Map(),
        } as unknown as ChartContext,
      );

      expect(result).toEqual({id: '4'});
    });
  });

  describe('evaluateCondition', () => {
    it('should throw an error if a variable is not found', () => {
      const chartContext = {
        context: new Map(),
      } as unknown as ChartContext;
      const condition = 'number === 1';

      expect(() => action.evaluateCondition(condition, chartContext)).toThrow(
        'number is not defined',
      );
    });

    it('should return false if condition is false', () => {
      const chartContext = {
        context: new Map([['number', 2]]),
      } as unknown as ChartContext;
      const condition = 'number === 1';

      const result = action.evaluateCondition(condition, chartContext);

      expect(result).toBe(false);
    });

    it('should return true if condition is true', () => {
      const chartContext = {
        context: new Map([['number', 1]]),
      } as unknown as ChartContext;
      const condition = 'number === 1';

      const result = action.evaluateCondition(condition, chartContext);

      expect(result).toBe(true);
    });
  });

  describe('getDefaultConnection', () => {
    it('should return undefined if no connections exist', () => {
      const result = action.getDefaultConnection([]);

      expect(result).toBeUndefined();
    });

    it('should return undefined if no default connection exists', () => {
      const result = action.getDefaultConnection([
        {} as unknown as SymbolConnection,
        {} as unknown as SymbolConnection,
      ]);

      expect(result).toBeUndefined();
    });

    it('should return the default connection', () => {
      const result = action.getDefaultConnection([
        {id: '1'} as unknown as SymbolConnection,
        {id: '2', default: '1'} as unknown as SymbolConnection,
        {id: '3'} as unknown as SymbolConnection,
      ]);

      expect(result).toEqual({id: '2', default: '1'});
    });
  });
});
