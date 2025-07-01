import {ChartManager} from '../src/engine/chart/manager/chart-manager';

describe('ChartManager (E2E)', () => {
  let chartManager: ChartManager;

  beforeAll(
    () =>
      (chartManager = new ChartManager().loadCharts(
        './test/charts/validate-chart',
      )),
  );

  it('should print a validation message if multiple start symbols are in one chart', () => {
    const logSpy = jest.spyOn(console, 'log');

    chartManager.validateChartByName('Test1');

    expect(logSpy).toHaveBeenCalledWith(
      'Test1 / Start 1 / start: Symbol should only appear once',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Test1 / Start 2 / start: Symbol should only appear once',
    );
  });

  it('should print a validation message if symbols have multiple source connections', () => {
    const logSpy = jest.spyOn(console, 'log');

    chartManager.validateChartByName('Test2');

    expect(logSpy).toHaveBeenCalledWith(
      'Test2 / Start / start: Symbol should have one source connection',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Test2 / Predefined process / predefined: Symbol should have one source connection',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Test2 / Process / process: Symbol should have one source connection',
    );
  });

  it('should print a validation message if symbols have no target connection', () => {
    const logSpy = jest.spyOn(console, 'log');

    chartManager.validateChartByName('Test3');

    expect(logSpy).toHaveBeenCalledWith(
      'Test3 / End / end: Symbol should have at least one target connection',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Test3 / Predefined process / predefined: Symbol should have at least one target connection',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Test3 / Process / process: Symbol should have at least one target connection',
    );
    expect(logSpy).toHaveBeenCalledWith(
      'Test3 / Decision / decision: Symbol should have at least one target connection',
    );
  });

  it('should print a validation message if decision symbol does not have at least one source connection', () => {
    const logSpy = jest.spyOn(console, 'log');

    chartManager.validateChartByName('Test4');

    expect(logSpy).toHaveBeenCalledWith(
      'Test4 / Decision / decision: Symbol should have at least one source connection',
    );
  });

  it('should print a validation message if end symbol has a source connection', () => {
    const logSpy = jest.spyOn(console, 'log');

    chartManager.validateChartByName('Test5');

    expect(logSpy).toHaveBeenCalledWith(
      'Test5 / End 1 / end: Symbol should have no source connection',
    );
  });

  it('should print a validation message if decision symbol does not have a default and no condition connections', () => {
    const logSpy = jest.spyOn(console, 'log');

    chartManager.validateChartByName('Test6');

    expect(logSpy).toHaveBeenCalledWith(
      'Test6 / Decision / decision: Each connection for this symbol must have a condition, and at least one must be marked as default',
    );
  });

  it('should print a validation message if connection symbol does not have a source and/or target value', () => {
    const logSpy = jest.spyOn(console, 'log');

    chartManager.validateChartByName('Test7');

    expect(logSpy).toHaveBeenCalledWith(
      'Test7 / Connection / connection: Connection has no target or/and source connected',
    );
  });
});
