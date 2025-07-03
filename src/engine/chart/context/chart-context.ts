/**
 * Represents a context for storing and retrieving chart-related variables.
 *
 * The `ChartContext` class encapsulates a map-based context that allows
 * variables to be set and retrieved by name. This is useful for managing
 * state or configuration relevant to chart components.
 */
export class ChartContext {
  private _context: Map<String, unknown>;

  constructor(context: Map<String, unknown>) {
    this._context = context;
  }

  /**
   * Gets the underlying context map containing all variables.
   *
   * @returns The map of variable names to their corresponding values.
   */
  public get context(): Map<String, unknown> {
    return this._context;
  }

  /**
   * Sets a variable in the context.
   *
   * @param name - The name of the variable to set.
   * @param value - The value to associate with the variable name.
   */
  public setVariable(name: string, value: unknown): void {
    this.context.set(name, value);
  }

  /**
   * Retrieves the value of a variable from the context.
   *
   * @param name - The name of the variable to retrieve.
   * @returns The value associated with the variable name, or `undefined` if not found.
   */
  public getVariable(name: string): unknown {
    return this.context.get(name);
  }
}
