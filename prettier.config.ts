import { Options } from 'prettier';
import gtsConfig from 'gts/.prettierrc.json';

const config = {
  ...gtsConfig,
} as unknown as Options;

export default config;