import {ChartContext} from '../context/chart-context';
import {ChartInstance} from '../instance/chart-instance';
import {ChartValidator} from '../validation/chart-validator';
import {FileService} from '../../file/file-service';
import {ChartParser} from '../parser/chart-parser';
import {ParsedDiagram} from '../../../interfaces/parsed-diagram.interface';
import {Chart} from '../chart';

/**
 * Manages the lifecycle of chart objects, including loading, parsing, validating, and executing charts.
 *
 * The `ChartManager` class is responsible for:
 * - Loading chart definitions from files in a specified directory.
 * - Parsing file contents into chart diagrams and chart objects.
 * - Validating charts either collectively or individually by name.
 * - Starting chart processes with a given execution context.
 *
 * This class acts as the central point for chart management and orchestration within the application.
 */
export class ChartManager {
  private readonly charts: Map<string, Chart> = new Map<string, Chart>();

  private chartValidator: ChartValidator;
  private fileService: FileService;
  private chartParser: ChartParser;

  constructor() {
    this.chartValidator = new ChartValidator();
    this.fileService = new FileService();
    this.chartParser = new ChartParser();
  }

  /**
   * Loads chart data from all files within the specified directory and creates charts for each file's content.
   *
   * This method retrieves the contents of all files in the given directory using the file service,
   * then iterates over each file's content to create charts accordingly.
   *
   * @param directory - The path to the directory containing chart files to be loaded.
   * @returns The current instance of {@link ChartManager} to allow method chaining.
   */
  public loadCharts(directory: string): ChartManager {
    const contents = this.fileService.getContentFromFiles(directory);
    for (const content of contents) {
      this.createDiagrams(content);
    }

    return this;
  }

  private createDiagrams(content: string): void {
    const diagrams = this.chartParser.parseDiagrams(content);

    for (const diagram of diagrams) {
      this.createChart(diagram);
    }
  }

  private createChart(diagram: ParsedDiagram): void {
    const chart = this.chartParser.parseChart(diagram);

    if (chart) {
      this.charts.set(chart.name, chart);
    }
  }

  /**
   * Validates all charts managed by this ChartManager instance.
   *
   * Iterates through each chart in the internal collection and applies the chartValidator
   * to ensure each chart meets the required validation criteria.
   *
   * @returns {ChartManager} Returns the current instance to allow method chaining.
   */
  public validateCharts(): ChartManager {
    this.charts.forEach((value: Chart, key: string) =>
      this.chartValidator.validate(key, value),
    );

    return this;
  }

  /**
   * Validates a chart by its name using the chart validator.
   *
   * Looks up the chart with the specified name from the internal chart collection.
   * If the chart exists, it is validated using the chart validator.
   *
   * @param name - The name of the chart to validate.
   * @returns The current instance of {@link ChartManager} to allow method chaining.
   */
  public validateChartByName(name: string): ChartManager {
    const chart = this.charts.get(name);

    if (chart) {
      this.chartValidator.validate(name, chart);
    }

    return this;
  }

  public async startChartInstanceByName(
    name: string,
    context: Map<String, unknown>,
  ): Promise<void> {
    const chart = this.charts.get(name);

    if (!chart) {
      throw new Error(`unknown chart name ${name}`);
    }

    return this.startChart(chart, context);
  }

  public async startChartInstanceById(
    id: string,
    context: Map<String, unknown>,
  ): Promise<void> {
    const charts = this.charts.values();

    for (const chart of charts) {
      if (chart.id === id) {
        return this.startChart(chart, context);
      }
    }

    throw new Error(`unknown chart id ${id}`);
  }

  private async startChart(
    chart: Chart,
    context: Map<String, unknown>,
  ): Promise<void> {
    const chartContext = new ChartContext(context);
    const chartInstance = new ChartInstance(chartContext, chart, this);

    return chartInstance.run();
  }
}
