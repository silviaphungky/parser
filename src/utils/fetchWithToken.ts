import { cookies } from 'next/headers'

const baseUrl =
  'https://499e2567-eab8-4cda-bdb4-d2dd8fb584b8-00-2ns1p7d6pfgj6.pike.repl.co'

export async function fetchWithToken(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  // Get the token from cookies
  const token = cookies().get('ACCESS_TOKEN')?.value

  if (!token) {
    throw new Error('No authentication token found')
  }

  // Merge the token into headers and any additional options
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  // Fetch the API with merged options
  const response = await fetch(`${baseUrl}/${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }
  const responseData = (await response.json()) || {}
  const data = responseData.data
  return data
}
