import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export * from './tryCatch'

export async function fetcher<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init)
  if (!response.ok)
    throw new Error(`network response was not OK\nURL: ${url}`, {
      cause: response.status,
    })
  return (await response.json()) as T
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
