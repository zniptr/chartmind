import {SymbolConnection} from '../../../../interfaces/symbol-connection.interface';
import {SymbolChart} from '../../../../types/symbol-chart.type';
import {Chart} from '../../chart';
import {HasSingleSourceConnection} from './has-single-source-connection';

describe('HasSingleSourceConnection', () => {
  let validation: HasSingleSourceConnection;

  beforeEach(() => (validation = new HasSingleSourceConnection()));

  describe('validate', () => {
    it.each<{symbol: SymbolChart; chart: Chart; expectedResult: boolean}>([
      // No connections in chart
      {
        symbol: {id: '1'} as unknown as SymbolChart,
        chart: {symbols: []} as unknown as Chart,
        expectedResult: false,
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

      expect(result).toEqual('Symbol should have one source connection');
    });
  });
});
