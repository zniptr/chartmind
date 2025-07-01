import {X2jOptions, XMLParser} from 'fast-xml-parser';
import {Chart} from '../../../../../src/engine/chart/chart';
import {ChartParser} from '../../../../../src/engine/chart/parser/chart-parser';
import {ParsedChart} from '../../../../../src/interfaces/parsed-chart.interface';
import {ParsedDiagram} from '../../../../../src/interfaces/parsed-diagram.interface';

jest.mock('../../../../../src/engine/chart/chart', () => ({
  Chart: jest.fn(),
}));
jest.mock('../../../../../src/engine/file/file-service', () => ({
  XMLParser: jest.fn().mockImplementation(() => ({
    parse: jest.fn(),
  })),
}));

type ChartParserFake = {
  readonly xmlParserConfig: X2jOptions;
  parser: XMLParser;
  parseDiagrams(content: string): ParsedDiagram[];
  extractDiagrams(parsedChart: ParsedChart): ParsedDiagram[];
  isValidChart(parsedChart: ParsedChart): boolean;
  parseChart(diagram: ParsedDiagram): Chart | undefined;
  isValidDiagram(diagram: ParsedDiagram): boolean;
};

describe('ChartParser', () => {
  let chartParser: ChartParserFake;

  beforeEach(
    () => (chartParser = new ChartParser() as unknown as ChartParserFake),
  );

  describe('parseDiagrams', () => {
    it('should parse diagrams', () => {
      const parsedDiagramsMock: ParsedDiagram[] = [
        {
          mxGraphModel: {root: {object: []}},
          name: 'test',
        },
      ];
      jest.spyOn(chartParser.parser, 'parse').mockReturnValue('');
      const extractDiagramsSpy = jest
        .spyOn(chartParser, 'extractDiagrams')
        .mockReturnValue(parsedDiagramsMock);

      const result = chartParser.parseDiagrams('');

      expect(extractDiagramsSpy).toHaveBeenCalled();
      expect(result).toBe(parsedDiagramsMock);
    });
  });

  describe('extractDiagrams', () => {
    it('should return an empty list if the parsed chart is not valid', () => {
      const parsedChartMock: ParsedChart = {
        mxfile: {
          diagram: [],
        },
      };
      jest.spyOn(chartParser, 'isValidChart').mockReturnValue(false);

      const result = chartParser.extractDiagrams(parsedChartMock);

      expect(result).toEqual([]);
    });

    it('should return a list of parsed diagrams when parsing a single diagram', () => {
      const parsedChartMock: ParsedChart = {
        mxfile: {
          diagram: {},
        },
      };
      jest.spyOn(chartParser, 'isValidChart').mockReturnValue(true);

      const result = chartParser.extractDiagrams(parsedChartMock);

      expect(result).toEqual([{}]);
    });

    it('should return a list of parsed diagrams when parsing multiple diagrams', () => {
      const parsedChartMock: ParsedChart = {
        mxfile: {
          diagram: [{}],
        },
      };
      jest.spyOn(chartParser, 'isValidChart').mockReturnValue(true);

      const result = chartParser.extractDiagrams(parsedChartMock);

      expect(result).toEqual([{}]);
    });
  });

  describe('isValidChart', () => {
    it.each<{chart: ParsedChart; expectedResult: boolean}>([
      {chart: null as unknown as ParsedChart, expectedResult: false},
      {chart: undefined as unknown as ParsedChart, expectedResult: false},
      {chart: {} as unknown as ParsedChart, expectedResult: false},
      {chart: {mxfile: {}} as unknown as ParsedChart, expectedResult: false},
      {chart: {mxfile: {diagram: {}}}, expectedResult: true},
    ])('should validate the chart', ({chart, expectedResult}) => {
      const result = chartParser.isValidChart(chart);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('parseChart', () => {
    it('should return undefined if the parsed diagram is not valid', () => {
      const parsedDiagramMock: ParsedDiagram = {
        mxGraphModel: {root: {object: []}},
        name: '',
      };
      jest.spyOn(chartParser, 'isValidDiagram').mockReturnValue(false);

      const result = chartParser.parseChart(parsedDiagramMock);

      expect(result).toBeUndefined();
    });

    it('should return a chart if the parsed diagram is valid', () => {
      const parsedDiagramMock: ParsedDiagram = {
        mxGraphModel: {root: {object: []}},
        name: 'test',
      };
      jest.spyOn(chartParser, 'isValidDiagram').mockReturnValue(true);

      const result = chartParser.parseChart(parsedDiagramMock);

      expect(result).not.toBeUndefined();
    });
  });

  describe('isValidDiagram', () => {
    it.each<{
      diagram: ParsedDiagram;
      expectedResult: boolean;
    }>([
      {
        diagram: null as unknown as ParsedDiagram,
        expectedResult: false,
      },
      {
        diagram: undefined as unknown as ParsedDiagram,
        expectedResult: false,
      },
      {
        diagram: {
          mxGraphModel: {root: {object: []}},
        } as unknown as ParsedDiagram,
        expectedResult: false,
      },
      {
        diagram: {name: 'test'} as unknown as ParsedDiagram,
        expectedResult: false,
      },
      {
        diagram: {
          name: 'test',
          mxGraphModel: undefined,
        } as unknown as ParsedDiagram,
        expectedResult: false,
      },
      {
        diagram: {
          name: 'test',
          mxGraphModel: {root: undefined},
        } as unknown as ParsedDiagram,
        expectedResult: false,
      },
      {
        diagram: {
          name: 'test',
          mxGraphModel: {root: {object: undefined}},
        } as unknown as ParsedDiagram,
        expectedResult: false,
      },
      {
        diagram: {name: 'test', mxGraphModel: {root: {object: []}}},
        expectedResult: true,
      },
    ])('should validate the diagram', ({diagram, expectedResult}) => {
      const result = chartParser.isValidDiagram(diagram);

      expect(result).toEqual(expectedResult);
    });
  });
});
