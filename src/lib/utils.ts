import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(salary: {
  min: number
  max: number
  currency: string
}): string {
  return `${
    salary.currency
  } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
