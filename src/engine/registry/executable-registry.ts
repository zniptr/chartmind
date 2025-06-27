import {Executable} from '../../interfaces/executable.interface';
import {ExecutableConstructor} from '../../types/executable-constructor.type';

/**
 * Singleton registry for storing and retrieving executable constructors by name.
 *
 * This class maintains a mapping between string identifiers and their corresponding
 * executable constructors. It ensures that only one instance of the registry exists
 * throughout the application.
 */
export class ExecutableRegistry {
  private static _instance: ExecutableRegistry | null = null;

  private registry: Map<string, ExecutableConstructor<Executable>>;

  private constructor() {
    this.registry = new Map();
  }

  /**
   * Returns the singleton instance of the `ExecutableRegistry`.
   * If the instance does not exist, it will be created.
   */
  public static get instance(): ExecutableRegistry {
    if (ExecutableRegistry._instance === null) {
      ExecutableRegistry._instance = new ExecutableRegistry();
    }

    return ExecutableRegistry._instance;
  }

  /**
   * Registers an executable constructor with a given name.
   *
   * @param name - The unique name to associate with the executable constructor.
   * @param className - The constructor function for the executable.
   * @returns The singleton instance of the `ExecutableRegistry` for chaining.
   */
  public addExecutable(
    name: string,
    className: ExecutableConstructor<Executable>,
  ): ExecutableRegistry {
    this.registry.set(name, className);

    return ExecutableRegistry.instance;
  }

  /**
   * Retrieves the executable constructor associated with the given name.
   *
   * @param name - The name of the executable to retrieve.
   * @returns The constructor function for the executable, or `undefined` if not found.
   */
  public getExecutableByName(
    name: string,
  ): ExecutableConstructor<Executable> | undefined {
    return this.registry.get(name);
  }
}
