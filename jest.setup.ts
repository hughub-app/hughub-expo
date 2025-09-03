// jest.setup.ts

// --- Gesture handler & Reanimated ---
import 'react-native-gesture-handler/jestSetup';
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Keep worklet init defined for Reanimated
// @ts-ignore
global.__reanimatedWorkletInit = () => {};

// --- NativeWind ---
jest.mock('nativewind', () => ({
  styled: (component: any) => component,
  cssInterop: () => {},
}));

// --- expo-router ---
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({})), // can override per-test with mockReturnValue
  router: {
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(),
  },
  Link: ({ children }: any) => children,
}));

// --- @rn-primitives/slot ---
// Some versions ship raw JSX that Jest can't parse, so stub it:
jest.mock('@rn-primitives/slot', () => {
  const Slot = ({ children }: any) => children;
  return { __esModule: true, Root: Slot, default: { Root: Slot } };
});

// --- AsyncStorage (optional) ---
// jest.mock('@react-native-async-storage/async-storage', () =>
//   require('@react-native-async-storage/async-storage/jest/async-storage-mock')
// );

// --- Toastify stub ---
// Stops ESM import errors and noisy toasts during tests
jest.mock('toastify-react-native', () => ({
  Toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// --- @testing-library/react-native matchers ---
import '@testing-library/jest-native/extend-expect';