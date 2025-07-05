/**
 * This Jest configuration file is primarily for the VS Code extension.
 */

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
  testMatch: ['<rootDir>/test/**/*.(spec|test).[tj]s'],
  preset: 'ts-jest'
};

export default config;