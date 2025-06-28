import {SymbolChart} from '../../../../../../src/types/symbol-chart.type';
import {Chart} from '../../../../../../src/engine/chart/chart';
import {IsSingleSymbol} from '../../../../../../src/engine/chart/validation/rules/is-single-symbol';

describe('IsSingleSymbol', () => {
  let validation: IsSingleSymbol;

  beforeEach(() => (validation = new IsSingleSymbol()));

  describe('validate', () => {
    it.each<{symbol: SymbolChart; chart: Chart; expectedResult: boolean}>([
      // No symbols in chart
      {
        symbol: {type: 'start'} as unknown as SymbolChart,
        chart: {symbols: []} as unknown as Chart,
        expectedResult: false,
      },
      // Multiple symbols of same type
      {
        symbol: {type: 'start'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'start',
            } as unknown as SymbolChart,
            {
              type: 'start',
            } as unknown as SymbolChart,
          ],
        } as unknown as Chart,
        expectedResult: false,
      },
      // Single symbol
      {
        symbol: {type: 'start'} as unknown as SymbolChart,
        chart: {
          symbols: [
            {
              type: 'start',
            } as unknown as SymbolChart,
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

      expect(result).toEqual('Symbol should only appear once');
    });
  });
});
