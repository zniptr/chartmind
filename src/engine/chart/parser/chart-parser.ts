import {X2jOptions, XMLParser} from 'fast-xml-parser';
import {SymbolChart} from '../../../types/symbol-chart.type';
import {ParsedDiagram} from '../../../interfaces/parsed-diagram.interface';
import {ParsedChart} from '../../../interfaces/parsed-chart.interface';
import {Chart} from '../chart';

export class ChartParser {
  private readonly xmlParserConfig: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '',
  };

  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser(this.xmlParserConfig);
  }

  public parseDiagrams(content: string): ParsedDiagram[] {
    const parsedChart = this.parser.parse(content);

    return this.extractDiagrams(parsedChart);
  }

  private extractDiagrams(parsedChart: ParsedChart): ParsedDiagram[] {
    if (!this.isValidChart(parsedChart)) {
      return [];
    }
    const diagrams = parsedChart.mxfile.diagram;
    if (Array.isArray(diagrams)) {
      return diagrams as ParsedDiagram[];
    } else {
      return [diagrams as ParsedDiagram];
    }
  }

  private isValidChart(parsedChart: ParsedChart): boolean {
    return (
      parsedChart !== undefined &&
      parsedChart !== null &&
      parsedChart.mxfile !== undefined &&
      parsedChart.mxfile.diagram !== undefined
    );
  }

  public parseChart(diagram: ParsedDiagram): Chart | undefined {
    if (!this.isValidDiagram(diagram)) {
      return;
    }

    const name: string = diagram.name;
    const symbols = diagram.mxGraphModel.root.object;
    const parsedSymbols: SymbolChart[] = Array.isArray(symbols)
      ? symbols
      : [symbols];

    return new Chart(name, parsedSymbols);
  }

  private isValidDiagram(diagram: ParsedDiagram): boolean {
    return (
      diagram !== undefined &&
      diagram !== null &&
      diagram.name !== undefined &&
      diagram.mxGraphModel !== undefined &&
      diagram.mxGraphModel.root !== undefined &&
      diagram.mxGraphModel.root.object !== undefined
    );
  }
}
