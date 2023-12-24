import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {'rootDir': '.'}]
  },
  'testEnvironment': 'jsdom',
  'testRegex': '/__tests__/.*\\.spec\\.ts?$',
  'moduleFileExtensions': [
    'ts',
    'js',
    'json'
  ]
};

export default config;
