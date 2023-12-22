import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {'rootDir': '.'}]
  },
  'testEnvironment': 'jsdom',
  'moduleFileExtensions': [
    'ts',
    'js',
    'json'
  ]
};

export default config;
