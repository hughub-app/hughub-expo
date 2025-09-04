import { render } from '@testing-library/react-native';

jest.mock('@rn-primitives/slot', () => {
  const Slot = ({ children }: any) => children;
  return { __esModule: true, Root: Slot, default: { Root: Slot } };
});

// Minimal expo-router mock so the screen renders
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}), // no child_id -> triggers your error UI
  router: { replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn() },
  Link: ({ children }: any) => children,
}));

import Feed from '@/app/(tabs)/diet/[child_id]/feed';
import React from 'react';

describe('<Feed />', () => {
  test('shows message when child_id is missing', () => {
    const { getByText } = render(<Feed />);
    getByText('Missing child_id in route.');
  });
});
