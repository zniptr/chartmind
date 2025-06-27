import {SymbolConnection} from '../../../../interfaces/symbol-connection.interface';
import {HasConnectionSourceAndTargetValue} from './has-connection-source-and-target-value';

describe('HasConnectionSourceAndTargetValue', () => {
  let validation: HasConnectionSourceAndTargetValue;

  beforeEach(() => (validation = new HasConnectionSourceAndTargetValue()));

  describe('validate', () => {
    it.each<{symbol: SymbolConnection; expectedResult: boolean}>([
      {symbol: {} as unknown as SymbolConnection, expectedResult: false},
      {
        symbol: {mxCell: undefined} as unknown as SymbolConnection,
        expectedResult: false,
      },
      {
        symbol: {
          mxCell: {source: undefined, target: '2'},
        } as unknown as SymbolConnection,
        expectedResult: false,
      },
      {
        symbol: {
          mxCell: {source: '1', target: undefined},
        } as unknown as SymbolConnection,
        expectedResult: false,
      },
      {
        symbol: {
          mxCell: {source: '1', target: '2'},
        } as unknown as SymbolConnection,
        expectedResult: true,
      },
    ])('should validate symbol', ({symbol, expectedResult}) => {
      const result = validation.validate(symbol);
      expect(result).toBe(expectedResult);
    });
  });

  describe('generateValidationMessage', () => {
    it('should return a validation message', () => {
      const result = validation.generateValidationMessage();

      expect(result).toEqual(
        'Connection has no target or/and source connected',
      );
    });
  });
});
