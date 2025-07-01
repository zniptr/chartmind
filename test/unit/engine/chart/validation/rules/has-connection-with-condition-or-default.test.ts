import {SymbolConnection} from '../../../../../../src/interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../../../src/types/symbol-chart.type';
import {Chart} from '../../../../../../src/engine/chart/chart';
import {HasConnectionWithConditionOrDefault} from '../../../../../../src/engine/chart/validation/rules/has-connection-with-condition-or-default';

describe('HasConnectionWithConditionOrDefault', () => {
  let validation: HasConnectionWithConditionOrDefault;

  beforeEach(() => (validation = new HasConnectionWithConditionOrDefault()));

  describe('validate', () => {
    it.each<{symbol: SymbolChart; chart: Chart; expectedResult: boolean}>([
      // No connections in chart
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {symbols: []} as unknown as Chart,
        expectedResult: true,
      },
      // Multiple default connections
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'connection',
              mxCell: {source: '1'},
              default: 1,
            } as unknown as SymbolConnection,
            {
              type: 'connection',
              mxCell: {source: '1'},
              default: 1,
            } as unknown as SymbolConnection,
          ],
        } as unknown as Chart,
        expectedResult: false,
      },
      // Multiple connections with condition, but no default
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'connection',
              mxCell: {source: '1'},
              condition: 'counter === 1',
            } as unknown as SymbolConnection,
            {
              type: 'connection',
              mxCell: {source: '1'},
              condition: 'counter === 1',
            } as unknown as SymbolConnection,
          ],
        } as unknown as Chart,
        expectedResult: false,
      },
      // Multiple connections with no condition and no default
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'connection',
              mxCell: {source: '1'},
            } as unknown as SymbolConnection,
            {
              type: 'connection',
              mxCell: {source: '1'},
            } as unknown as SymbolConnection,
          ],
        } as unknown as Chart,
        expectedResult: false,
      },
      // One connection with default
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'connection',
              mxCell: {source: '1'},
              default: '1',
            } as unknown as SymbolConnection,
          ],
        } as unknown as Chart,
        expectedResult: true,
      },
      // Multiple connections with one default and rest with condition
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'connection',
              mxCell: {source: '1'},
              default: '1',
            } as unknown as SymbolConnection,
            {
              type: 'connection',
              mxCell: {source: '1'},
              condition: 'counter === 1',
            } as unknown as SymbolConnection,
            {
              type: 'connection',
              mxCell: {source: '1'},
              condition: 'counter === 1',
            } as unknown as SymbolConnection,
          ],
        } as unknown as Chart,
        expectedResult: true,
      },
    ])('should validate symbol', ({symbol, chart, expectedResult}) => {
      const result = validation.validate(symbol, chart);
      expect(result).toBe(expectedResult);
    });
  });

  describe('generateValidationMessage', () => {
    it('should return a validation message', () => {
      const result = validation.generateValidationMessage();

      expect(result).toEqual(
        'Each connection for this symbol must have a condition, and at least one must be marked as default',
      );
    });
  });
});
