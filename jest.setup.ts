// Silence Reanimated “useNativeDriver” etc. & provide mocks
// Must be first:
import 'react-native-gesture-handler/jestSetup';
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Keep Reanimated mock stable
// @ts-ignore
global.__reanimatedWorkletInit = () => {};

// Mock nativewind (if you use it)
jest.mock('nativewind', () => ({
  styled: (c: any) => c,
}));

// Mock expo-router basics
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Stack: ({ children }: any) => children,
  Slot: ({ children }: any) => children,
  Link: ({ children }: any) => children,
}));

// Mock common Expo modules you use:
jest.mock('expo-linking', () => ({
  createURL: (p = '') => `exp://127.0.0.1:19000/${p}`,
}));
jest.mock('expo-constants', () => ({ default: { expoConfig: {}, manifest: {} } }));

// AsyncStorage (if used)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Timers more predictable in tests
jest.useFakeTimers();

// (Optional) MSW setup if you want request mocking in unit tests
// import { server } from './test/msw/server'
// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())