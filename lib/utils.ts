import { clsx, type ClassValue } from 'clsx';

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