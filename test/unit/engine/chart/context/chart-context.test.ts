import {ChartContext} from '../../../../../src/engine/chart/context/chart-context';

describe('ChartContext', () => {
  let chartContext: ChartContext;

  beforeEach(() => (chartContext = new ChartContext(new Map())));

  describe('setVariable', () => {
    it('should set a context variable', () => {
      chartContext.setVariable('test', 1);

      const result = chartContext.context.get('test');

      expect(result).toBe(1);
    });

    it('should override a context variable', () => {
      chartContext.setVariable('test', 1);
      chartContext.setVariable('test', 2);

      const result = chartContext.context.get('test');

      expect(result).toBe(2);
    });
  });

  describe('getVariable', () => {
    it('should return the value of a context variable', () => {
      chartContext.context.set('test', 1);

      const result = chartContext.getVariable('test');

      expect(result).toBe(1);
    });
  });
});
