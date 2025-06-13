export * from './tryCatch'

export async function fetcher<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init)
  if (!response.ok)
    throw new Error(`network response was not OK\nURL: ${url}`, {
      cause: response.status,
    })
  return (await response.json()) as T
}
