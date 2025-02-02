import { jwtVerify } from "jose"

export async function validateAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH0_CLIENT_SECRET))
    return payload
  } catch (error) {
    return null
  }
}

