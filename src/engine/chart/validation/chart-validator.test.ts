import {ChartValidationRule} from '../../../interfaces/chart-validation-rule.interface';
import {SymbolType} from '../../../types/symbol-type.type';
import {SymbolChart} from '../../../types/symbol-chart.type';
import {Chart} from '../chart';
import {ChartValidator} from './chart-validator';

jest.mock('./rules/has-connection-source-and-target-value', () => ({
  HasConnectionSourceAndTargetValue: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));
jest.mock('./rules/has-connection-with-condition-or-default', () => ({
  HasConnectionWithConditionOrDefault: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));
jest.mock('./rules/has-no-source-connection', () => ({
  HasNoSourceConnection: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));
jest.mock('./rules/has-single-or-multiple-source-connection', () => ({
  HasSingleOrMultipleSourceConnection: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));
jest.mock('./rules/has-single-or-multiple-target-connection', () => ({
  HasSingleOrMultipleTargetConnection: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));
jest.mock('./rules/has-single-source-connection', () => ({
  HasSingleSourceConnection: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));
jest.mock('./rules/is-single-symbol', () => ({
  IsSingleSymbol: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));

type ChartValidatorFake = {
  readonly validationRules: Map<SymbolType, ChartValidationRule[]>;
  validate(name: string, chart: Chart): void;
  validateSymbol(name: string, chart: Chart, symbol: SymbolChart): void;
  checkValidationRule(
    name: string,
    chart: Chart,
    symbol: SymbolChart,
    rule: ChartValidationRule,
  ): void;
};

describe('ChartValidator', () => {
  let chartValidator: ChartValidatorFake;

  beforeEach(
    () =>
      (chartValidator = new ChartValidator() as unknown as ChartValidatorFake),
  );

  describe('validate', () => {
    it('should not validate symbols if no symbols exist', () => {
      const validateSymbolSpy = jest
        .spyOn(chartValidator, 'validateSymbol')
        .mockImplementation(jest.fn());

      chartValidator.validate('', {name: '', symbols: []} as unknown as Chart);

      expect(validateSymbolSpy).not.toHaveBeenCalled();
    });

    it('should validate if symbols do exist', () => {
      const validateSymbolSpy = jest
        .spyOn(chartValidator, 'validateSymbol')
        .mockImplementation(jest.fn());

      chartValidator.validate('', {
        name: '',
        symbols: [{} as unknown as SymbolChart, {} as unknown as SymbolChart],
      } as unknown as Chart);

      expect(validateSymbolSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateSymbol', () => {
    it('should throw an error if no rules for symbol type were defined', () => {
      expect(() =>
        chartValidator.validateSymbol(
          '',
          {name: '', symbols: []} as unknown as Chart,
          {
            type: 'test',
          } as unknown as SymbolChart,
        ),
      ).toThrow('no validation rules defined for symbol type test');
    });

    it.each<SymbolType>(['start', 'process', 'predefined', 'decision', 'end'])(
      'should validate all rules for each symbol type',
      type => {
        const checkValidationRuleSpy = jest
          .spyOn(chartValidator, 'checkValidationRule')
          .mockImplementation(jest.fn());
        chartValidator.validateSymbol(
          '',
          {name: '', symbols: []} as unknown as Chart,
          {
            type,
          } as unknown as SymbolChart,
        );

        const ruleCount = chartValidator.validationRules.get(type)!.length;
        expect(checkValidationRuleSpy).toHaveBeenCalledTimes(ruleCount);
      },
    );
  });

  describe('checkValidationRule', () => {
    let logSpy: jest.SpyInstance;

    afterEach(() => logSpy.mockRestore());

    it('should print a message if the validation failed', () => {
      const mockRule = {
        validate: jest.fn().mockReturnValue(false),
        generateValidationMessage: jest.fn().mockReturnValue('test'),
      } as unknown as ChartValidationRule;
      logSpy = jest.spyOn(console, 'log');

      chartValidator.checkValidationRule(
        'testName',
        {name: '', symbols: []} as unknown as Chart,
        {type: 'start', label: 'testSymbol'} as unknown as SymbolChart,
        mockRule,
      );

      expect(logSpy).toHaveBeenCalledWith(
        'testName / testSymbol / start: test',
      );
    });

    it('should print nothing if the validation succeeded', () => {
      const mockRule = {
        validate: jest.fn().mockReturnValue(true),
      } as unknown as ChartValidationRule;
      logSpy = jest.spyOn(console, 'log');

      chartValidator.checkValidationRule(
        'testName',
        {name: '', symbols: []} as unknown as Chart,
        {type: 'start', label: 'testSymbol'} as unknown as SymbolChart,
        mockRule,
      );

      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
