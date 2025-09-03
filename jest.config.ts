import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  // RNTL prefers node env; jsdom is fine too but node is slightly faster for RN
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        'react-native',
        'react-native-.*',
        'expo',
        'expo-.*',
        '@expo',
        'unimodules-.*',
        'react-navigation',
        '@react-navigation/.*',
        'react-native-reanimated',
        'nativewind',
      ].join('|') +
    ')/)',
  ],
  // (Optional) Coverage
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/__mocks__/**'],
  // verbose: true,
};
export default config;