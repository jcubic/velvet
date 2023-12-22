import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {'rootDir': '.'}]
  },
  'testEnvironment': 'jsdom'
};

export default config;
