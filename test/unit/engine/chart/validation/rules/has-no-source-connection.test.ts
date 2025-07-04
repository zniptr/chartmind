import {SymbolConnection} from '../../../../../../src/interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../../../src/types/symbol-chart.type';
import {Chart} from '../../../../../../src/engine/chart/chart';
import {HasNoSourceConnection} from '../../../../../../src/engine/chart/validation/rules/has-no-source-connection';

describe('HasNoSourceConnection', () => {
  let validation: HasNoSourceConnection;

  beforeEach(() => (validation = new HasNoSourceConnection()));

  describe('validate', () => {
    it.each<{symbol: SymbolChart; chart: Chart; expectedResult: boolean}>([
      // Has one connection
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'connection',
              mxCell: {source: '1'},
            } as unknown as SymbolConnection,
          ],
        } as unknown as Chart,
        expectedResult: false,
      },
      // Has multiple connections
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
      // No connections in chart
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {symbols: []} as unknown as Chart,
        expectedResult: true,
      },
      // No connections
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'connection',
              mxCell: {source: '2'},
            } as unknown as SymbolConnection,
            {
              type: 'connection',
              mxCell: {source: '3'},
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

      expect(result).toEqual('Symbol should have no source connection');
    });
  });
});
