const baseUrl = 'https://backend-itrtechkpk.replit.app'

export async function getPNList(url: string, token: string): Promise<any> {
  // Merge the token into headers and any additional options
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  // Fetch the API with merged options
  const response = await fetch(`${baseUrl}/${url}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }

  const responseData = (await response.json()) || {}
  const data = responseData.data
  return data
}
