import {Executable} from '../../../../src/interfaces/executable.interface';
import {ExecutableRegistry} from '../../../../src/engine/registry/executable-registry';

class TestClass implements Executable {
  async execute(): Promise<void> {}
}

class TestClassNew implements Executable {
  async execute(): Promise<void> {}
}

describe('ChartContext', () => {
  let executableRegistry: ExecutableRegistry;

  beforeEach(() => (executableRegistry = ExecutableRegistry.instance));

  describe('instance', () => {
    it('should always return the same instance', () => {
      const result = ExecutableRegistry.instance;
      expect(result).toBe(executableRegistry);
    });
  });

  describe('addExecutable', () => {
    it('should add an executable', () => {
      executableRegistry.addExecutable('test', TestClass);

      const Result = executableRegistry['registry'].get('test');
      const instance = new Result!();

      expect(instance).toBeInstanceOf(TestClass);
    });

    it('should override an executable', () => {
      executableRegistry.addExecutable('test', TestClass);
      executableRegistry.addExecutable('test', TestClassNew);

      const Result = executableRegistry['registry'].get('test');
      const instance = new Result!();

      expect(instance).toBeInstanceOf(TestClassNew);
    });
  });

  describe('getExecutableByName', () => {
    it('should get an executable', () => {
      executableRegistry['registry'].set('new', TestClass);

      const Result = executableRegistry.getExecutableByName('new');
      const instance = new Result!();

      expect(instance).toBeInstanceOf(TestClass);
    });
  });
});
