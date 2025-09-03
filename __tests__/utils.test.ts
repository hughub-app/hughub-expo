import type { Mock } from 'jest-mock';

// 👇 Adjust this import if you don't use "@/..."
import { cn, getAge, goBack } from '@/lib/utils';

// Mock expo-router because utils imports router & Link types
jest.mock('expo-router', () => {
  const router = {
    canGoBack: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  };
  // Link is only used for its type; returning a noop component is fine for runtime
  const Link = (props: any) => null;
  return { router, Link };
});

const { router } = jest.requireMock('expo-router') as {
  router: {
    canGoBack: Mock;
    back: Mock;
    replace: Mock;
  };
};

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cn', () => {
    it('combines string classes', () => {
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
    });

    it('handles conditional and falsy values like clsx', () => {
      expect(cn('a', { b: true, c: false }, null, undefined, 0 && 'x')).toBe('a b');
    });
  });

  describe('getAge', () => {
    const FIXED_TODAY = new Date('2025-09-03T10:00:00.000Z');

    beforeAll(() => {
      // If your jest.setup already enables fake timers, this still works:
      jest.useFakeTimers();
      jest.setSystemTime(FIXED_TODAY);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns correct age when birthday already passed this year', () => {
      // 2000-01-01 -> as of 2025-09-03, age = 25
      expect(getAge(new Date('2000-01-01'))).toBe(25);
    });

    it('returns correct age on the exact birthday', () => {
      // 2000-09-03 -> exactly 25 on 2025-09-03
      expect(getAge(new Date('2000-09-03'))).toBe(25);
    });

    it('subtracts one if birthday has not occurred yet this year', () => {
      // 2000-09-04 -> day before birthday, age = 24
      expect(getAge(new Date('2000-09-04'))).toBe(24);
    });
  });

  describe('goBack', () => {
    const fallback = '/home' as any; // RoutePath type is from Link['href']; 'any' keeps test simple

    it('calls router.back when history exists', () => {
      router.canGoBack.mockReturnValue(true);
      goBack(fallback);
      expect(router.back).toHaveBeenCalledTimes(1);
      expect(router.replace).not.toHaveBeenCalled();
    });

    it('falls back to replace if back throws', () => {
      router.canGoBack.mockReturnValue(true);
      router.back.mockImplementation(() => {
        throw new Error('no history');
      });
      goBack(fallback);
      expect(router.back).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith(fallback);
    });

    it('replaces when cannot go back', () => {
      router.canGoBack.mockReturnValue(false);
      goBack(fallback);
      expect(router.back).not.toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith(fallback);
    });
  });
});