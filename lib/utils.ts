import { clsx, type ClassValue } from 'clsx';
import { router, Link } from 'expo-router';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getAge(dateOfBirth: Date) {
   const today = new Date();
   let age = today.getFullYear() - dateOfBirth.getFullYear();
   const m = today.getMonth() - dateOfBirth.getMonth();
   if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
       age--;
   }
   return age;
}

export type RoutePath = React.ComponentProps<typeof Link>['href'];

export function goBack(fallbackUrl: RoutePath) {
  const canGoBack = router.canGoBack();
  if (canGoBack) {
    try {
      router.back();
    } catch {
      router.replace(fallbackUrl);
    }
  } else {
    router.replace(fallbackUrl);
  }
}