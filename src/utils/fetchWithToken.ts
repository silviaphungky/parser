import { cookies } from 'next/headers'

const baseUrl =
  'https://6170d78b-4b3c-4f02-a452-311836aaf499-00-274dya67izywv.sisko.replit.dev'

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
    console.log(response.status, '******* sisil ***')
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }
  const responseData = (await response.json()) || {}
  const data = responseData.data
  return data
}
