import { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverage: false,
  testMatch: ['<rootDir>/test/e2e/**/*.(spec|test).[tj]s'],
};

export default config;