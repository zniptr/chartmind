import {ChartContext} from '../engine/chart/context/chart-context';

/**
 * Represents an executable action that can be performed within a chart context.
 *
 * @interface Executable
 * @remarks
 * Implement this interface to define custom actions that operate on a given {@link ChartContext}.
 *
 * @method execute
 * Executes the action using the provided chart context.
 * @param chartContext - The context in which the action should be executed.
 * @returns Returns nothing or a Promise that resolves when the action is complete.
 */
export interface Executable {
  execute(chartContext: ChartContext): void | Promise<void>;
}
