import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const cookiesOptions: Partial<ResponseCookie> = {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
}
