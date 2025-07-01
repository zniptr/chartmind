import {Chart} from '../../../../../src/engine/chart/chart';
import {ChartManager} from '../../../../../src/engine/chart/manager/chart-manager';
import {ChartParser} from '../../../../../src/engine/chart/parser/chart-parser';
import {ChartValidator} from '../../../../../src/engine/chart/validation/chart-validator';
import {FileService} from '../../../../../src/engine/file/file-service';
import {ParsedDiagram} from '../../../../../src/interfaces/parsed-diagram.interface';

jest.mock('../../../../../src/engine/chart/context/chart-context', () => ({
  ChartContext: jest.fn(),
}));
jest.mock('../../../../../src/engine/chart/instance/chart-instance', () => ({
  ChartInstance: jest.fn().mockImplementation(() => ({
    run: jest.fn(),
  })),
}));
jest.mock('../../../../../src/engine/chart/parser/chart-parser', () => ({
  ChartParser: jest.fn().mockImplementation(() => ({
    parseDiagrams: jest.fn(),
    parseChart: jest.fn(),
  })),
}));
jest.mock('../../../../../src/engine/chart/validation/chart-validator', () => ({
  ChartValidator: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
  })),
}));
jest.mock('../../../../../src/engine/file/file-service', () => ({
  FileService: jest.fn().mockImplementation(() => ({
    getContentFromFiles: jest.fn(),
  })),
}));

type ChartManagerFake = {
  readonly charts: Map<string, Chart>;
  chartValidator: ChartValidator;
  fileService: FileService;
  chartParser: ChartParser;
  loadCharts(directory: string): ChartManager;
  createDiagrams(content: string): void;
  createChart(diagram: ParsedDiagram): void;
  validateCharts(): ChartManager;
  validateChartByName(name: string): ChartManager;
  startProcess(name: string, context: Map<String, unknown>): Promise<void>;
};

describe('ChartManager', () => {
  let chartManager: ChartManagerFake;

  beforeEach(
    () => (chartManager = new ChartManager() as unknown as ChartManagerFake),
  );

  describe('loadCharts', () => {
    it('should load no charts if no files found', () => {
      jest
        .spyOn(chartManager.fileService, 'getContentFromFiles')
        .mockReturnValue([]);
      const createDiagramsSpy = jest
        .spyOn(chartManager, 'createDiagrams')
        .mockImplementation(jest.fn());

      const result = chartManager.loadCharts('');

      expect(result).toBe(chartManager);
      expect(createDiagramsSpy).not.toHaveBeenCalled();
    });

    it('should load charts if files found', () => {
      jest
        .spyOn(chartManager.fileService, 'getContentFromFiles')
        .mockReturnValue(['', '']);
      const createDiagramsSpy = jest
        .spyOn(chartManager, 'createDiagrams')
        .mockImplementation(jest.fn());

      const result = chartManager.loadCharts('');

      expect(result).toBe(chartManager);
      expect(createDiagramsSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('createDiagrams', () => {
    it('should create no diagrams if no diagrams are parsed', () => {
      jest.spyOn(chartManager.chartParser, 'parseDiagrams').mockReturnValue([]);
      const createChartSpy = jest
        .spyOn(chartManager, 'createChart')
        .mockImplementation(jest.fn());

      chartManager.createDiagrams('');

      expect(createChartSpy).not.toHaveBeenCalled();
    });

    it('should create diagrams if diagrams are parsed', () => {
      const parsedDiagramMock: ParsedDiagram = {
        mxGraphModel: {root: {object: []}},
        name: '',
      };
      jest
        .spyOn(chartManager.chartParser, 'parseDiagrams')
        .mockReturnValue([parsedDiagramMock, parsedDiagramMock]);
      const createChartSpy = jest
        .spyOn(chartManager, 'createChart')
        .mockImplementation(jest.fn());

      chartManager.createDiagrams('');

      expect(createChartSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('createChart', () => {
    it('should not create a chart if no chart is parsed', () => {
      const parsedDiagramMock: ParsedDiagram = {
        mxGraphModel: {root: {object: []}},
        name: '',
      };
      jest
        .spyOn(chartManager.chartParser, 'parseChart')
        .mockReturnValue(undefined);

      chartManager.createChart(parsedDiagramMock);

      expect(chartManager.charts.size).toEqual(0);
    });

    it('should create a chart if a chart is parsed', () => {
      const parsedDiagramMock: ParsedDiagram = {
        mxGraphModel: {root: {object: []}},
        name: 'test',
      };
      jest
        .spyOn(chartManager.chartParser, 'parseChart')
        .mockReturnValue({name: 'test', symbols: []} as unknown as Chart);

      chartManager.createChart(parsedDiagramMock);

      expect(chartManager.charts.size).toEqual(1);
      expect(chartManager.charts.get('test')!.name).toEqual('test');
    });
  });

  describe('validateCharts', () => {
    it('should not validate if there are no charts', () => {
      const validateSpy = jest.spyOn(chartManager.chartValidator, 'validate');

      const result = chartManager.validateCharts();

      expect(result).toBe(chartManager);
      expect(validateSpy).not.toHaveBeenCalled();
    });

    it('should validate charts', () => {
      const validateSpy = jest.spyOn(chartManager.chartValidator, 'validate');
      chartManager.charts.set('test', {
        name: 'test',
        symbols: [],
      } as unknown as Chart);

      const result = chartManager.validateCharts();

      expect(result).toBe(chartManager);
      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('validateChartByName', () => {
    it('should not validate chart if it does not exist', () => {
      const validateSpy = jest.spyOn(chartManager.chartValidator, 'validate');

      const result = chartManager.validateChartByName('test');

      expect(result).toBe(chartManager);
      expect(validateSpy).not.toHaveBeenCalled();
    });

    it('should validate chart by name', () => {
      const validateSpy = jest.spyOn(chartManager.chartValidator, 'validate');
      chartManager.charts.set('test', {
        name: 'test',
        symbols: [],
      } as unknown as Chart);

      const result = chartManager.validateChartByName('test');

      expect(result).toBe(chartManager);
      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('startProcess', () => {
    it('should throw an error if the chart does not exist', async () => {
      const context = new Map();
      await expect(chartManager.startProcess('test', context)).rejects.toThrow(
        'unknown chart name test',
      );
    });

    it('should create ChartContext and ChartInstance and call run', async () => {
      const context = new Map();

      chartManager.charts.set('test', {
        name: '',
        symbols: [],
      } as unknown as Chart);

      expect(await chartManager.startProcess('test', context)).toEqual(
        undefined,
      );
    });
  });
});
